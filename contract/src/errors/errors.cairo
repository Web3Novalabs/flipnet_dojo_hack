// Pool creation errors
pub const POOL_EXISTS: felt252 = 'Pool exists';
pub const BAD_DURATION: felt252 = 'Bad duration';

// Joining pool errors
pub const NOT_ONGOING: felt252 = 'Not ongoing';
pub const ALREADY_JOINED: felt252 = 'Already joined';
pub const BAD_OPTION: felt252 = 'Bad option';
pub const BAD_STAKE: felt252 = 'Bad stake';

// Closing pool errors
pub const ALREADY_CLOSED: felt252 = 'Already closed';
pub const NOT_CLOSABLE: felt252 = 'Not closable';
pub const NOT_MANAGER: felt252 = 'Not manager';

// Revealing outcome errors
pub const NOT_CLOSED: felt252 = 'Not closed';
pub const ALREADY_REVEALED: felt252 = 'Already revealed';
pub const NO_RANDOMNESS: felt252 = 'No randomness';

// Claiming reward errors
pub const NOT_REVEALED: felt252 = 'Not revealed';
pub const NOT_WINNER: felt252 = 'Not winner';
pub const ALREADY_CLAIMED: felt252 = 'Already claimed';
pub const NO_REWARD: felt252 = 'No reward';

// General errors
pub const NO_POOL: felt252 = 'No pool';
pub const NO_PLAYER: felt252 = 'No player';
pub const UNAUTHORIZED: felt252 = 'Unauthorized';
pub const INTERNAL_ERR: felt252 = 'Internal error';

