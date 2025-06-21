use dojo_starter::models::model::*;
use starknet::ContractAddress;

#[starknet::interface]
pub trait IAction<T> {
    /// Creates a new prediction pool if no ongoing pool exists.
    /// Returns the new pool's game_id.
    fn create_pool(ref self: T, duration: u64) -> u64;
    /// Allows a user to join the ongoing pool by staking on heads (0) or tails (1).
    /// Fails if the pool is closed or the user already joined.
    fn join_pool(ref self: T, option: u8, amount: u256);

    /// Closes the pool and triggers the verifiable random outcome generation.
    /// Only callable when the pool's time has ended or a condition is met.
    fn close_pool(ref self: T);

    /// Reveals the outcome of the closed pool using verifiable randomness.
    /// Sets the winning option and prepares for reward distribution.
    fn reveal_outcome(ref self: T, game_id: u64);

    /// Allows a user to claim their reward from the most recently settled pool.
    /// Calculates reward based on stake and winning side, deducts protocol fee.
    fn claim_reward(ref self: T, game_id: u64);

    /// Returns the current pool's information, or the most recent if none ongoing.
    fn get_current_pool_info(self: @T) -> Game;

    /// Returns the status of the current or specified pool (e.g., ongoing, closed, revealed,
    /// ended).
    fn get_pool_status(self: @T, game_id: u64) -> u8;

    /// Returns the reward amount claimable by a user for a given pool.
    fn get_claimable_reward(self: @T, game_id: u64, user: ContractAddress) -> u256;

    /// Returns the full list of users and their stakes for a given pool (for the "DEGEN CHAT" or
    /// pool details).
    fn get_pool_players(self: @T, game_id: u64) -> Span<(ContractAddress, u8, u256)>;

    /// Returns the total number of pools ever created (for UI stats).
    fn get_total_pools(self: @T) -> u64;

    /// Returns the total amount staked across all pools (for UI stats).
    fn get_total_staked(self: @T) -> u256;

    /// Returns the total number of bets placed (for UI stats).
    fn get_total_bets(self: @T) -> u64;

    /// Returns the payout rate (for UI stats).
    fn get_payout_rate(self: @T, game_id: u64, option: u8) -> u256;

    /// Returns whether there is an ongoing pool.
    fn get_ongoing_status(self: @T) -> bool;

    /// Returns the protocol-wide statistics struct.
    fn get_protocol_stats(self: @T) -> ProtocolStats;

    /// Returns the PoolPlayer struct for a given game and player address.
    fn get_pool_player(self: @T, game_id: u64, player: ContractAddress) -> PoolPlayer;
}
