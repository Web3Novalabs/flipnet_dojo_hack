import type { SchemaType as ISchemaType } from "@dojoengine/sdk";
import { BigNumberish } from 'starknet';
type WithFieldOrder<T> = T & { fieldOrder: string[] };

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

export interface GameCounter {
    universal_id: BigNumberish;
    current_game_id: BigNumberish;
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

export interface SchemaType extends ISchemaType {
    flipnet: {
        Game: WithFieldOrder<Game>,
        PoolPlayer: WithFieldOrder<PoolPlayer>,
        GameCounter: WithFieldOrder<GameCounter>,
        ProtocolStats: WithFieldOrder<ProtocolStats>,
        ClaimableReward: WithFieldOrder<ClaimableReward>,
        OngoingPool: WithFieldOrder<OngoingPool>,
        GamePlayers: WithFieldOrder<GamePlayers>,
    },
}

export const schema: SchemaType = {
    flipnet: {
        Game: {
            fieldOrder: ['id', 'num_players', 'num_heads', 'num_tails', 'total_stake_amount', 'total_heads_stake', 'total_tails_stake', 'status', 'is_live', 'created_at', 'starts_at', 'ends_at', 'duration', 'winning_option', 'manager_address', 'rewards_distributed', 'payout_rate'],
            id: 0,
            num_players: 0,
            num_heads: 0,
            num_tails: 0,
            total_stake_amount: 0,
            total_heads_stake: 0,
            total_tails_stake: 0,
            status: 0,
            is_live: false,
            created_at: 0,
            starts_at: 0,
            ends_at: 0,
            duration: 0,
            winning_option: null,
            manager_address: "",
            rewards_distributed: false,
            payout_rate: 0,
        },
        PoolPlayer: {
            fieldOrder: ['game_id', 'player_address', 'option', 'stake_amount', 'joined_at', 'claimed', 'reward_amount', 'user_staked_status'],
            game_id: 0,
            player_address: "",
            option: null,
            stake_amount: 0,
            joined_at: 0,
            claimed: false,
            reward_amount: 0,
            user_staked_status: false,
        },
        GameCounter: {
            fieldOrder: ['universal_id', 'current_game_id'],
            universal_id: 0,
            current_game_id: 0,
        },
        ProtocolStats: {
            fieldOrder: ['universal_id', 'total_pools', 'total_staked', 'total_bets', 'total_rewards', 'total_fees'],
            universal_id: 0,
            total_pools: 0,
            total_staked: 0,
            total_bets: 0,
            total_rewards: 0,
            total_fees: 0,
        },
        ClaimableReward: {
            fieldOrder: ['game_id', 'player_address', 'amount', 'claimed'],
            game_id: 0,
            player_address: "",
            amount: 0,
            claimed: false,
        },
        OngoingPool: {
            fieldOrder: ['universal_id', 'ongoing_status'],
            universal_id: 0,
            ongoing_status: false,
        },
        GamePlayers: {
            fieldOrder: ['game_id', 'players'],
            game_id: 0,
            players: [],
        },
    },
};
