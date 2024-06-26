// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import dotenv from "dotenv";
dotenv.config();

//import { AptosClient, AptosAccount, FaucetClient, TokenClient, CoinClient, BCS } from "aptos";
import { AptosClient, AptosAccount, FaucetClient, TokenClient, CoinClient, BCS } from "./dist/index";
//import { OptionalTransactionArgs } from "aptos";
import { OptionalTransactionArgs } from "./dist/index";
//import { HexString,MaybeHexString } from "aptos";
import { HexString,MaybeHexString } from "./dist/index";

import { NODE_URL, FAUCET_URL } from "./common";
import { AnyNumber, Bytes, Uint8 , Uint16 } from "./bcs";
import { MAX_U64_BIG_INT } from "./bcs/consts";
//import { HexString, MaybeHexString } from "./hex_string";

//const PRIVATE_KEY = "0x059476ec5425e7878cd6d85250cf66a17539e9ccea89e25a00292c7a102a53af";
//const PUBLIC_ADDRESS = "0x0f51874fefd26cc8b40a6632057bf34bf2a22bbfe6cdf46838a31dcf598f1b34";

const PRIVATE_KEY = "0x28a44b352e5f6dbc93cfbaae325aa8a68e99b401f54fee19ea03fd6ba4ab7633";
const PUBLIC_ADDRESS = "0xaf58703596ab584b8dc13f88fa09eca1b97eb11b74d042dcabd07fd0b269d6a2";

  /**
   * Creates a new NFT collection within the specified account
   *
   * @param account AptosAccount where collection will be created
   * @param name Collection name
   * @param description Collection description
   * @param uri URL to additional info about collection
   * @param maxAmount Maximum number of `token_data` allowed within this collection
   * @returns The hash of the transaction submitted to the API
   */
  // :!:>createCollection
  async function createCollection(
    client: AptosClient,
    tokenClient : TokenClient,
    account: AptosAccount,
    name: string,
    description: string,
    uri: string,
    maxAmount: AnyNumber = MAX_U64_BIG_INT,
    extraArgs?: OptionalTransactionArgs,
  ): Promise<string> {
    // <:!:createCollection
    const payload = tokenClient.transactionBuilder.buildTransactionPayload(
      "0x3::token::create_collection_script",
      [],
      [name, description, uri, maxAmount, [false, false, false]],
    );

    return client.generateSignSubmitTransaction(account, payload, extraArgs);
  }

/**
   * Creates a new NFT within the specified account
   *
   * @param account AptosAccount where token will be created
   * @param collectionName Name of collection, that token belongs to
   * @param name Token name
   * @param description Token description
   * @param supply Token supply
   * @param uri URL to additional info about token
   * @param max The maxium of tokens can be minted from this token
   * @param royalty_payee_address the address to receive the royalty, the address can be a shared account address.
   * @param royalty_points_denominator the denominator for calculating royalty
   * @param royalty_points_numerator the numerator for calculating royalty
   * @param property_keys the property keys for storing on-chain properties
   * @param property_values the property values to be stored on-chain
   * @param property_types the type of property values
   * @param mutability_config configs which field is mutable
   * @returns The hash of the transaction submitted to the API
   */
  // :!:>createToken
  async function createTokenWithMutabilityConfig(
    client: AptosClient,
    tokenClient : TokenClient,
    account: AptosAccount,
    collectionName: string,
    name: string,
    description: string,
    supply: AnyNumber,
    uri: string,
    max: AnyNumber = MAX_U64_BIG_INT,
    royalty_payee_address: MaybeHexString = account.address(),
    royalty_points_denominator: AnyNumber = 0,
    royalty_points_numerator: AnyNumber = 0,
    property_keys: Array<string> = [],
    property_values: Array<Bytes> = [],
    property_types: Array<string> = [],
    mutability_config: Array<boolean> = [false, false, false, false, false],
    extraArgs?: OptionalTransactionArgs,
  ): Promise<string> {
    // <:!:createToken
    const payload = tokenClient.transactionBuilder.buildTransactionPayload(
      "0x3::token::create_token_script",
      [],
      [
        collectionName,
        name,
        description,
        supply,
        max,
        uri,
        royalty_payee_address,
        royalty_points_denominator,
        royalty_points_numerator,
        mutability_config,
        property_keys,
        property_values,
        property_types,
      ],
    );

    return client.generateSignSubmitTransaction(account, payload, extraArgs);
  }

    /**
   * creator mutates the properties of the tokens
   *
   * @param account AptosAccount who modifies the token properties
   * @param tokenOwner the address of account owning the token
   * @param creator the creator of the token
   * @param collection_name the name of the token collection
   * @param tokenName the name of created token
   * @param propertyVersion the property_version of the token to be modified
   * @param amount the number of tokens to be modified
   *
   * @returns The hash of the transaction submitted to the API
   */
  async function mutateTokenProperties(
      client: AptosClient,
      tokenClient : TokenClient,
      account: AptosAccount,
      tokenOwner: HexString,
      creator: HexString,
      collection_name: string,
      tokenName: string,
      propertyVersion: AnyNumber,
      amount: AnyNumber,
      keys: Array<string>,
      values: Array<Bytes>,
      types: Array<string>,
      extraArgs?: OptionalTransactionArgs,
    ): Promise<string> {

      //console.log("mutateTokenProperties:", tokenOwner, creator, collection_name, tokenName, propertyVersion, amount, keys, values, types, "");
      const payload = tokenClient.transactionBuilder.buildTransactionPayload(
        "0x3::token::mutate_token_properties",
        [],
        [tokenOwner, creator, collection_name, tokenName, propertyVersion, amount, keys, values, types],
      );
  
      return client.generateSignSubmitTransaction(account, payload, extraArgs);
    }
/**
  * Creates a new NFT within the specified account
  *
* @param client AptosClient instance
* @param tokenClient AptosClient instance
* @param account AptosAccount where token will be created
* @param collectionName Name of collection, that token belongs to
* @param name Token name
* @param description Token description
* @param uri_cap URL to additional info about token
* @param uri_decap URL to additional info about token
* @param capped capped state of token
* @param stat1 stat1 of token
* @param stat2 stat2 of token
* @param stat3 stat3 of token
* @param stat4 stat4 of token
* @param stat4 stat4 of token
* @param badge1 count of badge1 of token
*/
async function createCannedbiToken(client: AptosClient,
  tokenClient: TokenClient,account: AptosAccount, collectionName: string,
  name: string, description: string, uri_cap: string, uri_decap: string,
  capped: boolean, stat1: Uint8, stat2: Uint8, stat3: Uint8, stat4: Uint8,
  badge1: Uint16) : Promise<void> {
  
    console.log(name);
    const txnHash2 = await createTokenWithMutabilityConfig(
      client,
      tokenClient,
      account,
      collectionName,
      name,
      description,//"Cannedbi First NFT",
      1,//supply,
      uri_cap,//"https://www.cannedbi.com",
      1,//max,
      account.address(),
      100,
      5,
      ["uri_cap","uri_decap","capped", "stat1", "stat2", "stat3", "stat4", "badge1"],
      [ BCS.bcsSerializeStr(uri_cap), 
        BCS.bcsSerializeStr(uri_decap), 
        BCS.bcsSerializeBool(capped), 
        BCS.bcsSerializeU8(stat1),
        BCS.bcsSerializeU8(stat2),
        BCS.bcsSerializeU8(stat3),
        BCS.bcsSerializeU8(stat4),
        BCS.bcsSerializeU16(badge1)
      ],
      ["string","string","bool", "u8", "u8", "u8", "u8", "u16"],
      [false,false,false,false,true],
    ); // <:!:section_5
    await client.waitForTransaction(txnHash2, { checkSuccess: true });
  

    //const tokenData = await tokenClient.getTokenData(account.address(), collectionName, name);
    //console.log(`Alice's token data: ${JSON.stringify(tokenData, null, 4)}`); // <:!:section_8
  
      // Get the token balance.
  // :!:>section_7
  const tokenPropertyVersion = 0;

  const aliceBalance1 = await tokenClient.getToken(
    account.address(),
    collectionName,
    name,
    `${tokenPropertyVersion}`,
  );
  console.log(`Alice's token balance: ${aliceBalance1["amount"]}`); // <:!:section_7

  // Get the token data.
  // :!:>section_8
  const tokenData = await tokenClient.getTokenData(account.address(), collectionName, name);
  console.log(`Alice's token data: ${JSON.stringify(tokenData, null, 4)}`); // <:!:section_8


}

(async () => {
  // Create API and faucet clients.
  // :!:>section_1a
  const client = new AptosClient(NODE_URL);
  const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); // <:!:section_1a

  // Create client for working with the token module.
  // :!:>section_1b
  const tokenClient = new TokenClient(client); // <:!:section_1b

  // Create a coin client for checking account balances.
  const coinClient = new CoinClient(client);

  // Create accounts.
  // :!:>section_2
  // TODO private key 로 생성하기 
  const alice_private_key = new HexString(PRIVATE_KEY);
  //const alice = new AptosAccount(alice_private_key.toUint8Array(),PUBLIC_ADDRESS);
  const alice = new AptosAccount();
  const bob = new AptosAccount(); // <:!:section_2

  // Print out account addresses.
  console.log("=== Addresses ===");
  console.log(`Alice: ${alice.address()}`);
  console.log(`Bob: ${bob.address()}`);
  console.log("");

  // Fund accounts.
  // :!:>section_3
  await faucetClient.fundAccount(alice.address(), 100_000_000);
  await faucetClient.fundAccount(bob.address(), 100_000_000); // <:!:section_3

  console.log("=== Initial Coin Balances ===");
  console.log(`Alice: ${await coinClient.checkBalance(alice)}`);
  console.log(`Bob: ${await coinClient.checkBalance(bob)}`);
  console.log("");

  console.log("=== Creating Collection and Token ===");

  const collectionName = "Alice's";
  const tokenName = "Alice's first token";
  const tokenName2 = "Alice's first token2";
  const tokenPropertyVersion = 0;

  const tokenId = {
    token_data_id: {
      creator: alice.address().hex(),
      collection: collectionName,
      name: tokenName,
    },
    property_version: `${tokenPropertyVersion}`,
  };

  // Create the collection.
  // :!:>section_4
  // const txnHash1 = await tokenClient.createCollection(
  //   alice,
  //   collectionName,
  //   "Alice's simple collection",
  //   "https://alice.com",
  // ); // <:!:section_4
  // await client.waitForTransaction(txnHash1, { checkSuccess: true });

  const txnHash1 = await createCollection(client,tokenClient,alice, collectionName, 
    "Cannedbi NFT collection", "https://cannedbi.com");
  await client.waitForTransaction(txnHash1, { checkSuccess: true });

  const collectionData = await tokenClient.getCollectionData(alice.address(), collectionName);
  console.log(`Alice's collection: ${JSON.stringify(collectionData, null, 4)}`); // <:!:section_6

  // Create a token in that collection.
  // :!:>section_5
  await createCannedbiToken(client,tokenClient,alice, collectionName, tokenName, 
      "Cannedbi NFT #1", 
      "ipfs://bafybeihq6s5paetbdh33hdxypua7tvchklfoymkaw7vpz4gzsc63fcupn4/0001.png", 
      "ipfs://bafybeibcbiix4xlnydklnfg3ympksr6cio4d2muwmulznvd5ep7k7fbzqe/0001.png", 
      true, 1, 2, 3, 4, 5);
  await createCannedbiToken(client,tokenClient,alice, collectionName, tokenName2, 
      "Cannedbi NFT #2", 
      "ipfs://bafybeihq6s5paetbdh33hdxypua7tvchklfoymkaw7vpz4gzsc63fcupn4/0002.png", 
      "ipfs://bafybeibcbiix4xlnydklnfg3ympksr6cio4d2muwmulznvd5ep7k7fbzqe/0002.png", 
      true, 1, 2, 3, 4, 5);


    let a = await mutateTokenProperties(
      client,tokenClient,
      alice,
      alice.address(),
      alice.address(),
      collectionName,
      tokenName,
      0,
      1,
      ["uri_cap","uri_decap","capped", "stat1", "stat2", "stat3", "stat4", "badge1"],
      [ BCS.bcsSerializeStr("uri"), 
        BCS.bcsSerializeStr("uri"), 
        BCS.bcsSerializeBool(false), 
        BCS.bcsSerializeU8(2),
        BCS.bcsSerializeU8(2),
        BCS.bcsSerializeU8(2),
        BCS.bcsSerializeU8(2),
        BCS.bcsSerializeU16(2)
      ],
      ["string","string","bool", "u8", "u8", "u8", "u8", "u16"],
    );
    await client.waitForTransactionWithResult(a);

    const tokenData = await tokenClient.getTokenData(alice.address(), collectionName, tokenName);
    console.log(`Alice's token data: ${JSON.stringify(tokenData, null, 4)}`); // <:!:section_8
  
})();
