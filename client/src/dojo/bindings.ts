import type { SchemaType as ISchemaType } from "@dojoengine/sdk";
import { BigNumberish } from 'starknet';

export interface Game {
    id: BigNumberish;
    num_players: BigNumberish;
    num_heads: BigNumberish;
    num_tails: BigNumberish;
    total_stake_amount: BigNumberish;
    total_heads_stake: BigNumberish;
    total_tails_stake: BigNumberish;
    status: BigNumberish;
    is_live: boolean;
    created_at: BigNumberish;
    starts_at: BigNumberish;
    ends_at: BigNumberish;
    duration: BigNumberish;
    winning_option: BigNumberish | null; // what is the type for Option<u8> in starknet?
    manager_address: string;
    rewards_distributed: boolean;
    payout_rate: BigNumberish;
}

export interface PoolPlayer {
    game_id: BigNumberish;
    player_address: string;
    option: BigNumberish | null;
    stake_amount: BigNumberish;
    joined_at: BigNumberish;
    claimed: boolean;
    reward_amount: BigNumberish;
    user_staked_status: boolean;
}

export interface ProtocolStats {
    universal_id: BigNumberish;
    total_pools: BigNumberish;
    total_staked: BigNumberish;
    total_bets: BigNumberish;
    total_rewards: BigNumberish;
    total_fees: BigNumberish;
}

export interface ClaimableReward {
    game_id: BigNumberish;
    player_address: string;
    amount: BigNumberish;
    claimed: boolean;
}

export interface OngoingPool {
    universal_id: BigNumberish;
    ongoing_status: boolean;
}

export interface GamePlayers {
    game_id: BigNumberish;
    players: Array<string>;
}