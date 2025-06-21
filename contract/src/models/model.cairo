use starknet::ContractAddress;

/// Main Pool/Game model for FLIPNET
#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    /// Unique identifier for the pool/game.
    pub id: u64,
    /// Number of players who joined this pool.
    pub num_players: u64,
    /// Number of players who picked heads.
    pub num_heads: u64,
    /// Number of players who picked tails.
    pub num_tails: u64,
    /// Total amount staked in this pool (across both sides).
    pub total_stake_amount: u256,
    /// Total amount staked on heads.
    pub total_heads_stake: u256,
    /// Total amount staked on tails.
    pub total_tails_stake: u256,
    /// Pool status: 0 = Ongoing, 1 = Closed, 2 = Revealed, 3 = Ended
    pub status: u8,
    /// Is the pool currently live/active?
    pub is_live: bool,
    /// Timestamp when pool was created.
    pub created_at: u64,
    /// Timestamp when pool started accepting bets.
    pub starts_at: u64,
    /// Timestamp when pool closed for new bets.
    pub ends_at: u64,
    /// Duration of the pool in seconds.
    pub duration: u64,
    /// Option<u8>: 0 = heads, 1 = tails, None = not revealed yet.
    pub winning_option: Option<u8>,
    /// Address of the pool creator/manager.
    pub manager_address: ContractAddress,
    /// Has rewards been distributed for this pool?
    pub rewards_distributed: bool,
    /// Payout rate for the pool.
    pub payout_rate: u256,
}

/// Player's participation in a specific pool/game
#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct PoolPlayer {
    #[key]
    /// Pool/game id.
    pub game_id: u64,
    #[key]
    /// Player's address.
    pub player_address: ContractAddress,
    /// Option picked by player: 0 = heads, 1 = tails.
    pub option: Option<u8>,
    /// Amount staked by player.
    pub stake_amount: u256,
    /// Timestamp when player joined.
    pub joined_at: u64,
    /// Has the player claimed their reward for this pool?
    pub claimed: bool,
}

/// Tracks the global pool/game counter for unique id generation
#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct GameCounter {
    #[key]
    pub universal_id: u64,
    pub current_game_id: u64,
}

/// Tracks protocol-wide statistics for analytics and UI
#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct ProtocolStats {
    #[key]
    pub universal_id: u8, // always 0
    /// Total number of pools ever created.
    pub total_pools: u64,
    /// Total amount staked across all pools.
    pub total_staked: u256,
    /// Total number of bets placed.
    pub total_bets: u64,
    /// Total rewards paid out.
    pub total_rewards: u256,
    /// Total protocol fees collected.
    pub total_fees: u256,
}

/// Tracks a user's claimable reward for a specific pool (for fast lookup)
#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct ClaimableReward {
    #[key]
    pub game_id: u64,
    #[key]
    pub player_address: ContractAddress,
    /// Amount claimable by the user for this pool.
    pub amount: u256,
    /// Has the reward been claimed?
    pub claimed: bool,
}

#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct OngoingPool {
    #[key]
    pub universal_id: u64,
    pub ongoing_status: bool,
}

