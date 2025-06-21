# Flipnet Documentation

## Overview

Flipnet is a decentralized betting dApp built on Starknet that allows users to participate in "Heads or Tails" coin-flip games. Users can create betting pools, stake on their chosen outcome (Heads or Tails), and claim rewards if their prediction is correct. The game is designed to be simple, transparent, and community-driven.

## Game Lifecycle

A game on Flipnet follows a clear, multi-stage lifecycle:

1.  **Creation**: A manager initiates a new betting pool with a set duration. Only one pool can be active at any given time.
2.  **Joining**: While the pool is active, players can join by staking an amount on either Heads (option `0`) or Tails (option `1`).
3.  **Closing**: Once the specified duration has passed, the pool is closed by anyone, preventing new players from joining.
4.  **Revealing**: The pool manager triggers the outcome revelation. The contract then pseudo-randomly determines a winning side.
5.  **Claiming**: Players who bet on the winning side can claim their proportional share of the rewards from the pool.

## Core Contract Functions

These are the main functions that drive the game logic.

### `create_pool(duration: u64)`

-   **Description**: Creates a new betting pool (game). It can only be called if there isn't another pool currently ongoing.
-   **Parameters**:
    -   `duration`: The time in seconds that the pool will remain open for players to join. The duration must be between 60 and 600 seconds.
-   **Caller**: Any address can call this function. The caller becomes the manager of the pool, responsible for revealing the outcome.
-   **Returns**: The `pool_id` of the newly created game.

### `join_pool(option: u8, amount: u256)`

-   **Description**: Allows a player to join the currently active pool by staking an amount on a chosen option. A player can only join a specific pool once.
-   **Parameters**:
    -   `option`: The chosen side. `0` for Heads, `1` for Tails.
    -   `amount`: The amount of tokens to stake. Must be greater than zero.
-   **Caller**: Any player who has not already joined the current pool.

### `close_pool()`

-   **Description**: Closes the current active pool to new participants.
-   **Caller**: Can be called by any address, but only after the pool's specified `duration` has expired.

### `reveal_outcome(game_id: u64)`

-   **Description**: Determines and records the winning outcome for a closed pool. This function uses a pseudo-random number generator based on block data to select the winning option.
-   **Parameters**:
    -   `game_id`: The ID of the pool for which to reveal the outcome.
-   **Caller**: Only the manager of the specified pool.

### `claim_reward(game_id: u64)`

-   **Description**: Allows a winning player to claim their reward. The reward is calculated based on their stake relative to the total stake on the winning option, minus a small protocol fee.
-   **Parameters**:
    -   `game_id`: The ID of the game from which to claim the reward.
-   **Caller**: Any player who participated in the game and chose the winning option.

## View Functions (Read-Only)

These functions allow anyone to read data from the contract without submitting a transaction. They are useful for front-end integration.

-   `get_current_pool_info()`: Returns details about the currently active game.
-   `get_protocol_stats()`: Returns statistics for the entire protocol, such as total pools created and total value staked.
-   `get_pool_player(game_id, player)`: Fetches information about a specific player in a specific game, including their stake and chosen option.
-   `get_claimable_reward(game_id, user)`: Calculates the reward a specific user can claim from a completed game.
-   `get_payout_rate(game_id, option)`: Calculates the potential payout multiplier for a given option in a game.
-   `get_pool_players(game_id)`: Returns a list of all players who participated in a specific game.

This documentation provides a foundational understanding of the Flipnet smart contract. For more detailed insights, refer to the contract source code and comments. 