// #[cfg(test)]
// mod tests {
//     use dojo_cairo_test::{
//         ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
//         spawn_test_world,
//     };
//     use dojo::model::ModelStorage;
//     use dojo::world::{WorldStorage, WorldStorageTrait};
//     use starknet::{contract_address_const, ContractAddress};
//     use starknet::{testing};

//     use dojo_starter::models::model::*;

//     use dojo_starter::systems::actions::{actions};
//     use dojo_starter::events::events::*;
//     use dojo_starter::interfaces::actions::{IAction, IActionDispatcher, IActionDispatcherTrait};
//     use dojo_starter::tests::test_world::{setup};

//     pub fn USER1() -> ContractAddress {
//         contract_address_const::<'user1'>()
//     }

//     pub fn USER2() -> ContractAddress {
//         contract_address_const::<'user2'>()
//     }

//     #[test]
//     fn test_integration_flow() {
//         let (world, game_actions) = setup();
//     }
// }
