// Test suite with integration tests
#[cfg(test)]
mod tests {
    // Importing necessary modules and traits for testing
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    // use dojo::model::ModelStorage;
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use starknet::{contract_address_const, ContractAddress, testing};
    use dojo_starter::models::model::*;
    use dojo_starter::systems::actions::{actions};
    use dojo_starter::events::events::*;
    use dojo_starter::interfaces::actions::{IAction, IActionDispatcher, IActionDispatcherTrait};

    // Defining the namespace for the test resources
    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "dojo_starter",
            resources: [
                // Models
                TestResource::Model(m_Game::TEST_CLASS_HASH),
                TestResource::Model(m_GameCounter::TEST_CLASS_HASH),
                TestResource::Model(m_ProtocolStats::TEST_CLASS_HASH),
                TestResource::Model(m_ClaimableReward::TEST_CLASS_HASH),
                TestResource::Model(m_OngoingPool::TEST_CLASS_HASH),
                TestResource::Model(m_PoolPlayer::TEST_CLASS_HASH),
                TestResource::Model(m_GamePlayers::TEST_CLASS_HASH),
                // Events
                TestResource::Event(e_PoolCreated::TEST_CLASS_HASH),
                TestResource::Event(e_PoolJoined::TEST_CLASS_HASH),
                TestResource::Event(e_PoolClosed::TEST_CLASS_HASH),
                TestResource::Event(e_OutcomeRevealed::TEST_CLASS_HASH),
                TestResource::Event(e_RewardClaimed::TEST_CLASS_HASH),
                // Contract
                TestResource::Contract(actions::TEST_CLASS_HASH),
            ]
                .span(),
        };
        ndef
    }

    // Defining contract definitions for the test world
    pub fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"dojo_starter", @"actions")
                .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span())
        ]
            .span()
    }

    // Setting up the test world and action dispatcher
    pub fn setup() -> (WorldStorage, IActionDispatcher) {
        let ndef = namespace_def();
        let mut world: WorldStorage = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let game_actions = IActionDispatcher { contract_address };
        (world, game_actions)
    }

    // Defining test user addresses
    pub fn USER1() -> ContractAddress {
        contract_address_const::<'user1'>()
    }
    pub fn USER2() -> ContractAddress {
        contract_address_const::<'user2'>()
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_pool_lifecycle() {
        // Setting up the test environment
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());

        // --- Step 1: Create Pool ---
        let duration = 120_u64;
        let game_id = game_actions.create_pool(duration);
        assert(game_id == 1, 'Pool creation failed');

        // --- Step 2: Multiple Users Join Pool ---
        testing::set_contract_address(USER2().into());
        let stake_amount_user2 = 100_u256;
        game_actions.join_pool(0_u8, stake_amount_user2); // USER2 joins with heads

        testing::set_contract_address(USER1().into());
        let stake_amount_user1 = 50_u256;
        game_actions.join_pool(1_u8, stake_amount_user1); // USER1 joins with tails

        let game_info_after_join = game_actions.get_current_pool_info();
        assert(game_info_after_join.num_players == 2, 'Incorrect player count');
        assert(
            game_info_after_join.total_stake_amount == stake_amount_user2 + stake_amount_user1,
            'Incorrect total stake',
        );

        // --- Step 3: Time Advances and Close Pool ---
        let game_info = game_actions.get_current_pool_info();
        let end_time = game_info.ends_at;
        testing::set_block_timestamp(end_time + 1);
        game_actions.close_pool();
        let closed_game = game_actions.get_current_pool_info();
        assert(closed_game.status == 1_u8, 'Pool should be closed');
        assert(!closed_game.is_live, 'Pool should not be live');

        // --- Step 4: Manager Reveals Outcome ---
        game_actions.reveal_outcome(game_id);
        let revealed_game = game_actions.get_current_pool_info();
        assert(revealed_game.status == 2_u8, 'Pool should be revealed');
        assert(revealed_game.winning_option.is_some(), 'Winning option should be set');

        // --- Step 5: Winners Claim Reward ---
        let winning_option = revealed_game.winning_option.unwrap();
        let winner = if winning_option == 0_u8 {
            USER2()
        } else {
            USER1()
        };
        testing::set_contract_address(winner.into());
        let _player_before = game_actions.get_pool_player(game_id, winner);
        game_actions.claim_reward(game_id);
        let player_after = game_actions.get_pool_player(game_id, winner);
        assert(player_after.claimed, 'Reward should be claimed');
        assert(player_after.reward_amount > 0, 'Reward amount be positive');
    }

    #[test]
    #[available_gas(3000000000)]
    #[should_panic(expected: ('Pool exists', 'ENTRYPOINT_FAILED'))]
    fn test_cannot_create_pool_if_active() {
        // Testing that a new pool cannot be created if one is active
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());
        game_actions.create_pool(120); // Create first pool
        let game_info = game_actions.get_current_pool_info();
        assert(game_info.is_live, 'Pool should be live');

        testing::set_contract_address(USER2().into());
        game_actions.create_pool(120); // Should panic
    }

    #[test]
    #[available_gas(3000000000)]
    #[should_panic(expected: ('Player already joined this pool', 'ENTRYPOINT_FAILED'))]
    fn test_cannot_join_twice() {
        // Testing that a user cannot join the same pool twice
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());
        game_actions.create_pool(120);
        testing::set_contract_address(USER2().into());
        game_actions.join_pool(0_u8, 100_u256);
        game_actions.join_pool(0_u8, 50_u256); // Should panic
    }

    #[test]
    #[available_gas(3000000000)]
    #[should_panic(expected: ('Pool is not ongoing', 'ENTRYPOINT_FAILED'))]
    fn test_cannot_join_after_closed() {
        // Testing that joining is not allowed after pool closure
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());
        game_actions.create_pool(60);
        let game_info = game_actions.get_current_pool_info();
        testing::set_block_timestamp(game_info.ends_at + 1);
        game_actions.close_pool();
        testing::set_contract_address(USER2().into());
        game_actions.join_pool(0_u8, 100_u256); // Should panic
    }

    #[test]
    #[available_gas(3000000000)]
    #[should_panic(expected: ('Player did not win', 'ENTRYPOINT_FAILED'))]
    fn test_cannot_claim_if_not_winner() {
        // Testing that only winners can claim rewards
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());
        let game_id = game_actions.create_pool(120);
        testing::set_contract_address(USER2().into());
        game_actions.join_pool(0_u8, 100_u256); // USER2 picks heads
        testing::set_contract_address(USER1().into());
        game_actions.join_pool(1_u8, 50_u256); // USER1 picks tails
        let game_info = game_actions.get_current_pool_info();
        let end_time = game_info.ends_at;
        testing::set_block_timestamp(end_time + 1);
        game_actions.close_pool();
        game_actions.reveal_outcome(game_id);

        // Get the actual winning option
        let revealed_game = game_actions.get_current_pool_info();
        let winning_option = revealed_game.winning_option.unwrap();

        // Pick the losing player
        let losing_player = if winning_option == 0_u8 {
            USER1() // tails lost
        } else {
            USER2() // heads lost
        };
        testing::set_contract_address(losing_player.into());
        game_actions.claim_reward(game_id); // Should panic
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_rewards_and_balances() {
        // Setting up the test environment
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());
        let game_id = game_actions.create_pool(120);

        // Users join the pool with larger stakes
        testing::set_contract_address(USER2().into());
        let stake_user2 = 1000_u256;
        game_actions.join_pool(0_u8, stake_user2); // USER2 picks heads

        testing::set_contract_address(USER1().into());
        let stake_user1 = 500_u256;
        game_actions.join_pool(1_u8, stake_user1); // USER1 picks tails

        // Advance time and close pool
        let game_info = game_actions.get_current_pool_info();
        testing::set_block_timestamp(game_info.ends_at + 1);
        game_actions.close_pool();

        // Reveal outcome
        game_actions.reveal_outcome(game_id);
        let revealed_game = game_actions.get_current_pool_info();
        let winning_option = revealed_game.winning_option.unwrap();
        assert(winning_option == 0_u8 || winning_option == 1_u8, 'Invalid winning option');

        // Winner claims reward
        let winner = if winning_option == 0_u8 {
            USER2()
        } else {
            USER1()
        };
        testing::set_contract_address(winner.into());
        let player_before = game_actions.get_pool_player(game_id, winner);
        let claimable_before = game_actions.get_claimable_reward(game_id, winner);

        // Assert reward amount is calculated correctly BEFORE claim
        let expected_reward = player_before.stake_amount * revealed_game.payout_rate / 1000_u256;
        let tolerance: u256 = 1; // Allow small rounding difference
        assert(
            claimable_before >= expected_reward
                - tolerance && claimable_before <= expected_reward
                + tolerance,
            'Incorrect claimable b4 claim',
        );

        // Protocol stats before claim
        let stats_before = game_actions.get_protocol_stats();
        let total_rewards_before = stats_before.total_rewards;

        // Claim
        game_actions.claim_reward(game_id); // First and only claim

        // Force re-read to ensure state propagation
        let player_after = game_actions.get_pool_player(game_id, winner);
        let claimable_after = game_actions.get_claimable_reward(game_id, winner);

        // Assert correct player can claim
        assert(player_after.claimed, 'Reward should be claimed');
        assert(claimable_before > 0, 'Claimable should be > 0');
        assert(claimable_after == 0, 'Reward shld be 0 after claim');
        assert(
            player_after.reward_amount >= expected_reward
                - tolerance && player_after.reward_amount <= expected_reward
                + tolerance,
            'Reward amount mismatch',
        );

        // Assert protocol fee is deducted by checking distributable amount
        let total_stake = revealed_game.total_stake_amount;
        let protocol_fee = total_stake * 1_u256 / 100_u256; // 1% fee
        let distributable_amount = total_stake - protocol_fee;
        assert(distributable_amount >= expected_reward, 'Protocol fee not deducted');

        // Assert balance before and after claim is updated
        let stats_after = game_actions.get_protocol_stats();
        assert(
            stats_after.total_rewards >= total_rewards_before
                + expected_reward
                - tolerance && stats_after.total_rewards <= total_rewards_before
                + expected_reward
                + tolerance,
            'Rewards not updated',
        );
    }
}
