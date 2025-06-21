// dojo decorator
#[dojo::contract]
pub mod actions {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;

    use dojo_starter::models::model::*;
    use dojo_starter::errors::errors;
    use dojo_starter::events::events::*;
    use dojo_starter::interfaces::actions::IAction;
    use core::poseidon::poseidon_hash_span;


    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    const PROTOCOL_FEE: u256 = 1;
    const PRECISION: u256 = 1000;

    #[abi(embed_v0)]
    impl ActionsImpl of IAction<ContractState> {
        fn create_pool(ref self: ContractState, duration: u64) -> u64 {
            let mut world = self.world_default();

            // --- Check if there is an ongoing pool ---
            let ongoing_status: OngoingPool = world.read_model(0);
            assert(!ongoing_status.ongoing_status, errors::POOL_EXISTS);

            assert(duration >= 60_u64, errors::BAD_DURATION);
            assert(duration <= 600_u64, errors::BAD_DURATION);

            // --- Generate a unique pool/game id using the GameCounter model ---
            let mut counter: GameCounter = world.read_model(0); // universal_id is always 0
            let pool_id = counter.current_game_id + 1;

            // --- Update the counter ---
            let updated_counter = GameCounter { universal_id: 0, current_game_id: pool_id };
            world.write_model(@updated_counter);

            // --- Set up pool timing and manager ---
            let now = get_block_timestamp();
            assert(duration > 0, errors::BAD_DURATION);
            let ends_at = now + duration;
            let manager = get_caller_address();

            // --- Create and store the new Game (Pool) model ---
            let new_pool = Game {
                id: pool_id,
                num_players: 0,
                num_heads: 0,
                num_tails: 0,
                total_stake_amount: 0,
                total_heads_stake: 0,
                total_tails_stake: 0,
                status: 0_u8, // Ongoing
                is_live: true,
                created_at: now,
                starts_at: now,
                ends_at: ends_at,
                duration: duration,
                winning_option: Option::None(()),
                manager_address: manager,
                rewards_distributed: false,
                payout_rate: 0,
            };
            world.write_model(@new_pool);

            // --- Create an empty GamePlayers model for this pool ---
            let new_game_players = GamePlayers { game_id: pool_id, players: array![] };
            world.write_model(@new_game_players);

            // --- Update ProtocolStats ---
            let mut stats: ProtocolStats = world.read_model(0);
            stats.total_pools += 1;

            world.write_model(@stats);

            // Update the OngoingPool status to true (there is now an ongoing pool)
            let ongoing = OngoingPool { universal_id: 0, ongoing_status: true };
            world.write_model(@ongoing);

            // --- Emit PoolCreated event ---
            world
                .emit_event(
                    @PoolCreated {
                        game_id: pool_id,
                        manager_address: manager,
                        created_at: now,
                        starts_at: now,
                        ends_at: ends_at,
                        duration: duration,
                        total_stake_amount: 0,
                        status: 0_u8,
                    },
                );

            pool_id
        }

        fn join_pool(ref self: ContractState, option: u8, amount: u256) {
            // --- Dojo logic: Join Pool Implementation ---

            let mut world = self.world_default();
            let caller_address = get_caller_address();
            let now = get_block_timestamp();

            // --- Get the current pool id ---
            let game_counter: GameCounter = world.read_model(0);
            let game_id = game_counter.current_game_id;

            // --- Read the current pool ---
            let mut game: Game = world.read_model(game_id);

            // --- Assert pool is ongoing and live ---
            assert(game.status == 0_u8, 'Pool is not ongoing');
            assert(game.is_live, 'Pool is not live');
            assert(now >= game.starts_at, 'Pool has not started');
            assert(now <= game.ends_at, 'Pool has ended');

            // --- Assert valid option ---
            assert(option == 0_u8 || option == 1_u8, 'Must be 0:heads or 1:tails');

            // --- Assert positive stake amount ---
            assert(amount != 0, 'Must be greater than 0');

            // --- Assert player has not joined the pool yet ---
            let maybe_player: PoolPlayer = world.read_model((game_id, caller_address));
            assert(maybe_player.user_staked_status == false, 'Player already joined this pool');

            // --- Update Game model ---
            game.num_players += 1;
            game.total_stake_amount = game.total_stake_amount + amount;
            if option == 0_u8 {
                game.num_heads += 1;
                game.total_heads_stake = game.total_heads_stake + amount;
            } else {
                game.num_tails += 1;
                game.total_tails_stake = game.total_tails_stake + amount;
            }
            world.write_model(@game);

            // --- Update ProtocolStats ---
            let mut stats: ProtocolStats = world.read_model(0);
            stats.total_bets += 1;
            stats.total_staked = stats.total_staked + amount;
            world.write_model(@stats);

            // --- Update PoolPlayer model ---
            world
                .write_model(
                    @PoolPlayer {
                        game_id: game_id,
                        player_address: caller_address,
                        option: Option::Some(option),
                        stake_amount: amount,
                        joined_at: now,
                        claimed: false,
                        reward_amount: 0,
                        user_staked_status: true,
                    },
                );

            // --- Add player to GamePlayers list ---
            let mut game_players: GamePlayers = world.read_model(game_id);
            game_players.players.append(caller_address);
            world.write_model(@game_players);

            // --- Emit PoolJoined event ---
            world
                .emit_event(
                    @PoolJoined {
                        game_id: game_id,
                        player_address: caller_address,
                        option: option,
                        stake_amount: amount,
                        joined_at: now,
                    },
                );
        }

        fn close_pool(ref self: ContractState) {
            let mut world = self.world_default();

            // --- Get the current ongoing pool ---
            let ongoing: OngoingPool = world.read_model(0);
            assert(ongoing.ongoing_status == true, 'No ongoing pool to close');

            // Get the current game id
            let game_counter: GameCounter = world.read_model(0);
            let game_id = game_counter.current_game_id;

            // Read the game model
            let mut game: Game = world.read_model(game_id);

            // Assert pool is ongoing
            assert(game.status == 0_u8, 'Pool is not ongoing');

            // Check if pool duration has ended
            let now = get_block_timestamp();
            let pool_end_time = game.ends_at;
            assert(now >= pool_end_time, 'Pool duration not ended yet');

            // Update game status to Closed (1)
            game.status = 1_u8;
            game.is_live = false;
            game.ends_at = now;
            world.write_model(@game);

            // Update OngoingPool status
            let mut ongoing_update: OngoingPool = ongoing;
            ongoing_update.ongoing_status = false;
            world.write_model(@ongoing_update);

            // Emit PoolClosed event
            world.emit_event(@PoolClosed { game_id: game_id, closed_at: now, status: 1_u8 });
        }

        fn reveal_outcome(ref self: ContractState, game_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // --- Get the current game ---
            let mut game: Game = world.read_model(game_id);

            // Assert pool is closed but not yet revealed
            assert(game.status == 1_u8, 'Pool is not closed');
            assert(game.winning_option.is_none(), 'Outcome already revealed');

            // Get current timestamp for randomness
            let current_timestamp = get_block_timestamp();

            // Create a chosen number using game_id, timestamp, and number of players
            let chosen_num: u64 = game_id + current_timestamp + game.num_players;
            let gotten_num: felt252 = chosen_num.try_into().unwrap_or(1);

            // Use Poseidon hash with the chosen number and a random felt
            let random_num: felt252 = poseidon_hash_span([gotten_num, 1].span());
            let random_num_u256: u256 = random_num.try_into().unwrap();

            // Determine winning option based on even/odd
            let winning_option = if random_num_u256 % 2 == 0 { 0_u8 } else { 1_u8 };
            // Update the game with the winning option and set status to Revealed (2)
            game.winning_option = Option::Some(winning_option);
            game.status = 2_u8;

            // Update the payout rate
            let payout_rate = self.calculate_odds(game_id, winning_option);
            game.payout_rate = payout_rate;

            world.write_model(@game);

            // Emit PoolOutcomeRevealed event
            world
                .emit_event(
                    @OutcomeRevealed {
                        game_id: game_id,
                        revealed_at: get_block_timestamp(),
                        winning_option: winning_option,
                        total_stake_amount: game.total_stake_amount,
                        num_players: game.num_players,
                        status: game.status,
                    },
                );
        }

        fn claim_reward(ref self: ContractState, game_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Get the game and player data
            let game: Game = world.read_model(game_id);
            let mut player: PoolPlayer = world.read_model((game_id, caller));

            // Assert the game is revealed and rewards not distributed
            assert(game.status == 2_u8, 'Game not revealed yet');
            assert(!player.claimed, 'Already claimed reward');

            // Assert player has a valid option
            assert(player.user_staked_status == true, 'Player has not staked');
            

            // Get the winning option
            assert(game.winning_option.is_some(), 'No winning option set');
            let winning_option = game.winning_option.unwrap();

            // Check if player won
            let player_option = player.option.unwrap();
            assert(player_option == winning_option, 'Player did not win');

            // Calculate reward based on payout rate
            let reward_amount = player.stake_amount * game.payout_rate / PRECISION;

            // Update player as claimed
            player.claimed = true;
            world.write_model(@player);

            // Update protocol stats
            let mut stats: ProtocolStats = world.read_model(0);
            stats.total_rewards += reward_amount;
            world.write_model(@stats);

            // Emit reward claimed event
            world.emit_event(
                @RewardClaimed {
                    game_id: game_id,
                    player_address: caller,
                    claimed_at: get_block_timestamp(),
                    reward_amount: reward_amount,
                    stake_amount: player.stake_amount,
                    winning_option: winning_option,
                }
            );
        }


        fn get_current_pool_info(self: @ContractState) -> Game {
            let world = self.world_default();
            // read the game model from the world storage
            let game_counter: GameCounter = world.read_model(0);
            let game: Game = world.read_model(game_counter.current_game_id);
            game
        }

        fn get_total_pools(self: @ContractState) -> u64 {
            let world = self.world_default();
            let stats: ProtocolStats = world.read_model(0);
            stats.total_pools
        }

        fn get_ongoing_status(self: @ContractState) -> bool {
            let world = self.world_default();
            let ongoing: OngoingPool = world.read_model(0);
            ongoing.ongoing_status
        }

        fn get_protocol_stats(self: @ContractState) -> ProtocolStats {
            let world = self.world_default();
            let stats: ProtocolStats = world.read_model(0);
            stats
        }


        fn get_pool_player(self: @ContractState, game_id: u64, player: ContractAddress) -> PoolPlayer {
            let mut world = self.world_default();
            world.read_model((game_id, player))
        }

        fn get_pool_status(self: @ContractState, game_id: u64) -> u8 {
            let world = self.world_default();
            let game: Game = world.read_model(game_id);
            game.status
        }

        fn get_claimable_reward(self: @ContractState, game_id: u64, user: ContractAddress) -> u256 {
            let world = self.world_default();
            let game: Game = world.read_model(game_id);
            let player: PoolPlayer = world.read_model((game_id, user));

            // if game is not revealed or player didnt stake, return 0
            if (game.status != 2_u8 || !player.user_staked_status) {
                return 0;
            }

            // if player option is not winning option, return 0
            if (player.option.unwrap() != game.winning_option.unwrap()) {
                return 0;
            }

            let reward = player.stake_amount * game.payout_rate / PRECISION;
            reward
        }

        fn get_payout_rate(self: @ContractState, game_id: u64, option: u8) -> u256 {
            let world = self.world_default();
            let game: Game = world.read_model(game_id);
            let payout_rate = self.calculate_odds(game_id, option);
            payout_rate
        }

        fn get_total_bets(self: @ContractState) -> u64 {
            let world = self.world_default();
            let stats: ProtocolStats = world.read_model(0);
            stats.total_bets
        }

        fn get_total_staked(self: @ContractState) -> u256 {
            let world = self.world_default();
            let stats: ProtocolStats = world.read_model(0);
            stats.total_staked
        }

        fn get_pool_players(
            self: @ContractState, game_id: u64
        ) -> Span<(ContractAddress, u8, u256)> {
            let mut world = self.world_default();
            let game_players: GamePlayers = world.read_model(game_id);

            let mut players_data = array![];

            let mut i = 0;
            loop {
                if i >= game_players.players.len() {
                    break;
                }
                let player_address = *game_players.players.at(i);
                let pool_player: PoolPlayer = world.read_model((game_id, player_address));

                let player_option = match pool_player.option {
                    Option::Some(opt) => opt,
                    Option::None => 2_u8, // Should not happen, 2 for invalid
                };

                players_data
                    .append(
                        (pool_player.player_address, player_option, pool_player.stake_amount)
                    );
                i += 1;
            };

            players_data.span()
        }

    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }

        fn get_distributable_pool_amount(self: @ContractState, game_id: u64) -> u256 {
            let world = self.world_default();
            let game: Game = world.read_model(game_id);
            let fee = game.total_stake_amount * PROTOCOL_FEE / 100_u256;
            let distributable_amount = game.total_stake_amount - fee;
            distributable_amount
        }

        fn calculate_odds(self: @ContractState, game_id: u64, option: u8) -> u256 {
            let world = self.world_default();
            let game: Game = world.read_model(game_id);
            let distributable_pool_amount = self.get_distributable_pool_amount(game_id);

            let total_winning_stake = if option == 0_u8 {
                game.total_heads_stake
            } else {
                game.total_tails_stake
            };

            if (total_winning_stake == 0) {
                return 0;
            }

            let odds = distributable_pool_amount * PRECISION / total_winning_stake;
            odds
        }

    }
}
