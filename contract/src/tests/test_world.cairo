#[cfg(test)]
mod tests {
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use dojo::model::ModelStorage;
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use starknet::{contract_address_const, ContractAddress};
    use starknet::{testing};

    use dojo_starter::models::model::*;

    use dojo_starter::systems::actions::{actions};
    use dojo_starter::events::events::*;
    use dojo_starter::interfaces::actions::{IAction, IActionDispatcher, IActionDispatcherTrait};

    const PRECISION: u256 = 1000;


    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "dojo_starter",
            resources: [
                // models
                TestResource::Model(m_Game::TEST_CLASS_HASH),
                TestResource::Model(m_GameCounter::TEST_CLASS_HASH),
                TestResource::Model(m_ProtocolStats::TEST_CLASS_HASH),
                TestResource::Model(m_ClaimableReward::TEST_CLASS_HASH),
                TestResource::Model(m_OngoingPool::TEST_CLASS_HASH),
                TestResource::Model(m_PoolPlayer::TEST_CLASS_HASH),
                TestResource::Model(m_GamePlayers::TEST_CLASS_HASH),
                // events
                TestResource::Event(e_PoolCreated::TEST_CLASS_HASH),
                TestResource::Event(e_PoolJoined::TEST_CLASS_HASH),
                TestResource::Event(e_PoolClosed::TEST_CLASS_HASH),
                TestResource::Event(e_OutcomeRevealed::TEST_CLASS_HASH),
                TestResource::Event(e_RewardClaimed::TEST_CLASS_HASH),
                // contract
                TestResource::Contract(actions::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    pub fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"dojo_starter", @"actions")
                .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span()),
        ]
            .span()
    }

    pub fn setup() -> (WorldStorage, IActionDispatcher) {
        let ndef = namespace_def();
        let mut world: WorldStorage = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let game_actions = IActionDispatcher { contract_address };
        (world, game_actions)
    }

    pub fn USER1() -> ContractAddress {
        contract_address_const::<'user1'>()
    }

    pub fn USER2() -> ContractAddress {
        contract_address_const::<'user2'>()
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_game_create_pool_success() {
        let (_world, game_actions) = setup();
        testing::set_contract_address(USER1().into());

        // Check OngoingPool status before pool creation
        let ongoing_before: bool = game_actions.get_ongoing_status();
        assert(ongoing_before == false, 'Should be false');

        // Check total pools before pool creation
        let total_pools_before: u64 = game_actions.get_total_pools();
        assert(total_pools_before == 0, 'should be 0');

        // Create the pool
        let game_id = game_actions.create_pool(120);

        // Check OngoingPool status after pool creation
        let ongoing_after: bool = game_actions.get_ongoing_status();
        assert(ongoing_after == true, 'should be true');

        // Check total pools after pool creation
        let total_pools_after: u64 = game_actions.get_total_pools();
        assert(total_pools_after == 1, 'should be 1');

        // Check that the returned game_id is 1 (first pool)
        assert(game_id == 1, 'Game ID should be 1');

        // Check that the game_info fields are set correctly
        let game_info: Game = game_actions.get_current_pool_info();
        assert(game_info.id == 1, 'Game id should be 1');
        assert(game_info.num_players == 0, 'num_players should be 0');
        assert(game_info.num_heads == 0, 'num_heads should be 0');
        assert(game_info.num_tails == 0, 'num_tails should be 0');
        assert(game_info.total_stake_amount == 0, 'total_stake_amount should be 0');
        assert(game_info.total_heads_stake == 0, 'total_heads_stake should be 0');
        assert(game_info.total_tails_stake == 0, 'total_tails_stake should be 0');
        assert(game_info.status == 0_u8, 'status should be 0 (Ongoing)');
        assert(game_info.is_live == true, 'is_live should be true');
        assert(game_info.duration == 120, 'duration should be 120');
        assert(game_info.winning_option.is_none(), 'winning_option should be None');
        assert(game_info.manager_address == USER1(), 'manager_address should be USER1');
        assert(game_info.rewards_distributed == false, 'should be false');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_game_payout_logic() {
        let (_world, game_actions) = setup();

        // --- PHASE 1: Pool Creation ---
        testing::set_contract_address(USER1().into());
        let game_id = game_actions.create_pool(120);

        // --- PHASE 2: Players Joining Pool ---
        testing::set_contract_address(USER2().into());
        let stake_amount: u256 = 1000_u256.into(); // Increased stake to avoid precision issues
        game_actions.join_pool(0_u8, stake_amount);

        testing::set_contract_address(USER1().into());
        let stake2: u256 = 500_u256.into(); // Increased stake
        game_actions.join_pool(1_u8, stake2);

        // Check initial payout_rate is 0 (default)
        let game_info_before: Game = game_actions.get_current_pool_info();
        assert(game_info_before.payout_rate == 0, 'Initial payout_rate should be 0');

        // --- PHASE 3: Pool Closing ---
        let game_info: Game = game_actions.get_current_pool_info();
        let end_time = game_info.ends_at;
        testing::set_block_timestamp(end_time + 1);
        game_actions.close_pool();

        let game_info_after_close: Game = game_actions.get_current_pool_info();
        assert(game_info_after_close.payout_rate == 0, 'rate should still be 0');

        // --- PHASE 4: Outcome Revelation ---
        game_actions.reveal_outcome(game_id);
        let game_info_after_reveal: Game = game_actions.get_current_pool_info();
        assert(game_info_after_reveal.payout_rate > 0, 'rate should be updated');
        assert(game_info_after_reveal.winning_option.is_some(), 'option should be set');

        // Verify payout calculation with tolerance
        let winning_option = game_info_after_reveal.winning_option.unwrap();
        let total_stake = game_info_after_reveal.total_stake_amount;
        let protocol_fee = total_stake * 1_u256 / 100_u256;
        let distributable_amount = total_stake - protocol_fee;
        let expected_payout_rate = if winning_option == 0_u8 {
            (distributable_amount * PRECISION) / game_info_after_reveal.total_heads_stake
        } else {
            (distributable_amount * PRECISION) / game_info_after_reveal.total_tails_stake
        };
        let tolerance: u256 = 1; // Allow small rounding difference
        assert(
            game_info_after_reveal.payout_rate >= expected_payout_rate
                - tolerance && game_info_after_reveal.payout_rate <= expected_payout_rate
                + tolerance,
            'rate should match odds',
        );
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_join_pool_success() {
        let (_world, game_actions) = setup();

        // Set contract address to USER1 (manager / creator)
        testing::set_contract_address(USER1().into());

        // Create a pool with duration 120
        let game_id = game_actions.create_pool(120);

        // Set contract address to USER2 (player)
        testing::set_contract_address(USER2().into());

        // Prepare stake amount
        let stake_amount: u256 = 100_u256.into();

        // Join the pool as USER2, pick option 0 (heads)
        game_actions.join_pool(0_u8, stake_amount);

        // Check that the Game model is updated
        let game_info: Game = game_actions.get_current_pool_info();
        assert(game_info.id == game_id, 'Game id should match');
        assert(game_info.num_players == 1, 'num_players should be 1');
        assert(game_info.num_heads == 1, 'num_heads should be 1');
        assert(game_info.num_tails == 0, 'num_tails should be 0');
        assert(game_info.total_stake_amount == stake_amount, 'total_stake_amount should match');
        assert(game_info.total_heads_stake == stake_amount, 'total_heads_stake should match');
        assert(game_info.total_tails_stake == 0_u256.into(), 'total_tails_stake should be 0');
        assert(game_info.status == 0_u8, 'status should be 0 (Ongoing)');
        assert(game_info.is_live == true, 'is_live should be true');

        // Check ProtocolStats updated
        let stats: ProtocolStats = game_actions.get_protocol_stats();
        assert(stats.total_pools == 1, 'total_pools should be 1');
        assert(stats.total_bets == 1, 'total_bets should be 1');
        assert(stats.total_staked == stake_amount, 'total_staked should match');
        // total_rewards and total_fees should still be 0
        assert(stats.total_rewards == 0_u256.into(), 'total_rewards should be 0');
        assert(stats.total_fees == 0_u256.into(), 'total_fees should be 0');

        // Use dojo_test to assert USER2's PoolPlayer stake is correct
        let user2_player: PoolPlayer = game_actions.get_pool_player(game_id, USER2());
        assert(user2_player.stake_amount == stake_amount, 'USER2 stake_amount should match');
        assert(user2_player.option.is_some(), 'USER2 option should be Some');
        assert(user2_player.option.unwrap() == 0_u8, 'option should be 0');
        assert(user2_player.claimed == false, 'USER2 claimed should be false');

        // Join as USER1 (manager) with option 1 (tails)
        testing::set_contract_address(USER1().into());
        let stake2: u256 = 50_u256.into();
        game_actions.join_pool(1_u8, stake2);

        // Check Game model again
        let game_info2: Game = game_actions.get_current_pool_info();
        assert(game_info2.num_players == 2, 'num_players should be 2');
        assert(game_info2.num_heads == 1, 'num_heads should be 1');
        assert(game_info2.num_tails == 1, 'num_tails should be 1');
        assert(
            game_info2.total_stake_amount == stake_amount + stake2, 'total_stake_amount should sum',
        );
        assert(game_info2.total_heads_stake == stake_amount, 'total_heads_stake should match');
        assert(game_info2.total_tails_stake == stake2, 'total_tails_stake should match');

        // Use dojo_test to assert USER1's PoolPlayer stake is correct
        let user1_player: PoolPlayer = game_actions.get_pool_player(game_id, USER1());
        assert(user1_player.stake_amount == stake2, 'USER1 stake_amount should match');
        assert(user1_player.option.is_some(), 'USER1 option should be Some');
        assert(user1_player.option.unwrap() == 1_u8, 'option should be 1');
        assert(user1_player.claimed == false, 'USER1 claimed should be false');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_close_pool_updates_status() {
        // Setup: deploy contract, create pool, join pool, fast-forward time
        let (_world, game_actions) = setup();

        // Set contract address to USER1 (manager)
        testing::set_contract_address(USER1().into());

        // Create a pool with 60 seconds duration
        let duration: u64 = 60;
        game_actions.create_pool(duration);

        // Join as USER2 with option 0 (heads)
        testing::set_contract_address(USER2().into());
        let stake_amount: u256 = 100_u256.into();
        game_actions.join_pool(0_u8, stake_amount);

        // Join as USER1 (manager) with option 1 (tails)
        testing::set_contract_address(USER1().into());
        let stake2: u256 = 50_u256.into();
        game_actions.join_pool(1_u8, stake2);

        // Fast-forward time to after pool ends
        let game_info: Game = game_actions.get_current_pool_info();
        let end_time = game_info.ends_at;
        testing::set_block_timestamp(end_time + 1);

        // Close the pool
        game_actions.close_pool();

        // Check that the pool status is updated to Closed (1)
        let closed_game: Game = game_actions.get_current_pool_info();
        assert(closed_game.status == 1_u8, 'status should be 1');
        assert(closed_game.is_live == false, 'is_live should be false');

        // Check that OngoingPool status is false
        let ongoing_status = game_actions.get_ongoing_status();
        assert(ongoing_status == false, 'status should be false');
    }

    #[test]
    #[available_gas(3000000000)]
    #[should_panic(expected: ('Pool duration not ended yet', 'ENTRYPOINT_FAILED'))]
    fn test_close_pool_should_panic_closed_before_time() {
        let (_world, game_actions) = setup();

        // Set contract address to USER1 (manager)
        testing::set_contract_address(USER1().into());

        // Create a pool with 60 seconds duration
        let duration: u64 = 60;
        game_actions.create_pool(duration);

        // Close the pool
        game_actions.close_pool();
    }
}
