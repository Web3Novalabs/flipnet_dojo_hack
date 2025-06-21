use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PoolCreated {
    #[key]
    pub game_id: u64,
    pub manager_address: ContractAddress,
    pub created_at: u64,
    pub starts_at: u64,
    pub ends_at: u64,
    pub duration: u64,
    pub total_stake_amount: u256,
    pub status: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PoolJoined {
    #[key]
    pub game_id: u64,
    #[key]
    pub player_address: ContractAddress,
    pub option: u8,
    pub stake_amount: u256,
    pub joined_at: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PoolClosed {
    #[key]
    pub game_id: u64,
    pub closed_at: u64,
    pub status: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct OutcomeRevealed {
    #[key]
    pub game_id: u64,
    pub revealed_at: u64,
    pub winning_option: u8,
    pub total_stake_amount: u256,
    pub num_players: u64,
    pub status: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct RewardClaimed {
    #[key]
    pub game_id: u64,
    #[key]
    pub player_address: ContractAddress,
    pub claimed_at: u64,
    pub reward_amount: u256,
    pub stake_amount: u256,
    pub winning_option: u8,
}

