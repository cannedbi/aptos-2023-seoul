import nacl from 'tweetnacl';

declare type ApiRequestOptions = {
    readonly method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    readonly url: string;
    readonly path?: Record<string, any>;
    readonly cookies?: Record<string, any>;
    readonly headers?: Record<string, any>;
    readonly query?: Record<string, any>;
    readonly formData?: Record<string, any>;
    readonly body?: any;
    readonly mediaType?: string;
    readonly responseHeader?: string;
    readonly errors?: Record<number, string>;
};

declare class CancelError extends Error {
    constructor(message: string);
    get isCancelled(): boolean;
}
interface OnCancel {
    readonly isResolved: boolean;
    readonly isRejected: boolean;
    readonly isCancelled: boolean;
    (cancelHandler: () => void): void;
}
declare class CancelablePromise<T> implements Promise<T> {
    readonly [Symbol.toStringTag]: string;
    private _isResolved;
    private _isRejected;
    private _isCancelled;
    private readonly _cancelHandlers;
    private readonly _promise;
    private _resolve?;
    private _reject?;
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void, onCancel: OnCancel) => void);
    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null, onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): Promise<T | TResult>;
    finally(onFinally?: (() => void) | null): Promise<T>;
    cancel(): void;
    get isCancelled(): boolean;
}

declare type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
declare type Headers = Record<string, string>;
declare type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string>;
    USERNAME?: string | Resolver<string>;
    PASSWORD?: string | Resolver<string>;
    HEADERS?: Headers | Resolver<Headers>;
    ENCODE_PATH?: (path: string) => string;
};
declare const OpenAPI: OpenAPIConfig;

declare abstract class BaseHttpRequest {
    readonly config: OpenAPIConfig;
    constructor(config: OpenAPIConfig);
    abstract request<T>(options: ApiRequestOptions): CancelablePromise<T>;
}

/**
 * All bytes (Vec<u8>) data is represented as hex-encoded string prefixed with `0x` and fulfilled with
 * two hex digits per byte.
 *
 * Unlike the `Address` type, HexEncodedBytes will not trim any zeros.
 *
 */
declare type HexEncodedBytes = string;

/**
 * A string containing a 64-bit unsigned integer.
 *
 * We represent u64 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u64s in JSON natively.
 *
 */
declare type U64$1 = string;

/**
 * Account data
 *
 * A simplified version of the onchain Account resource
 */
declare type AccountData = {
    sequence_number: U64$1;
    authentication_key: HexEncodedBytes;
};

/**
 * A hex encoded 32 byte Aptos account address.
 *
 * This is represented in a string as a 64 character hex string, sometimes
 * shortened by stripping leading 0s, and adding a 0x.
 *
 * For example, address 0x0000000000000000000000000000000000000000000000000000000000000001 is represented as 0x1.
 *
 */
declare type Address = string;

declare type IdentifierWrapper = string;

declare type MoveAbility = string;

/**
 * Move function generic type param
 */
declare type MoveFunctionGenericTypeParam = {
    /**
     * Move abilities tied to the generic type param and associated with the function that uses it
     */
    constraints: Array<MoveAbility>;
};

/**
 * Move function visibility
 */
declare enum MoveFunctionVisibility {
    PRIVATE = "private",
    PUBLIC = "public",
    FRIEND = "friend"
}

/**
 * String representation of an on-chain Move type tag that is exposed in transaction payload.
 * Values:
 * - bool
 * - u8
 * - u16
 * - u32
 * - u64
 * - u128
 * - u256
 * - address
 * - signer
 * - vector: `vector<{non-reference MoveTypeId}>`
 * - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`
 *
 * Vector type value examples:
 * - `vector<u8>`
 * - `vector<vector<u64>>`
 * - `vector<0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>>`
 *
 * Struct type value examples:
 * - `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
 * - `0x1::account::Account`
 *
 * Note:
 * 1. Empty chars should be ignored when comparing 2 struct tag ids.
 * 2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 */
declare type MoveType = string;

/**
 * Move function
 */
declare type MoveFunction = {
    name: IdentifierWrapper;
    visibility: MoveFunctionVisibility;
    /**
     * Whether the function can be called as an entry function directly in a transaction
     */
    is_entry: boolean;
    /**
     * Generic type params associated with the Move function
     */
    generic_type_params: Array<MoveFunctionGenericTypeParam>;
    /**
     * Parameters associated with the move function
     */
    params: Array<MoveType>;
    /**
     * Return type of the function
     */
    return: Array<MoveType>;
};

/**
 * Move module id is a string representation of Move module.
 *
 * Format: `{address}::{module name}`
 *
 * `address` should be hex-encoded 32 byte account address that is prefixed with `0x`.
 *
 * Module name is case-sensitive.
 *
 */
declare type MoveModuleId = string;

/**
 * Move struct field
 */
declare type MoveStructField = {
    name: IdentifierWrapper;
    type: MoveType;
};

/**
 * Move generic type param
 */
declare type MoveStructGenericTypeParam = {
    /**
     * Move abilities tied to the generic type param and associated with the type that uses it
     */
    constraints: Array<MoveAbility>;
};

/**
 * A move struct
 */
declare type MoveStruct = {
    name: IdentifierWrapper;
    /**
     * Whether the struct is a native struct of Move
     */
    is_native: boolean;
    /**
     * Abilities associated with the struct
     */
    abilities: Array<MoveAbility>;
    /**
     * Generic types associated with the struct
     */
    generic_type_params: Array<MoveStructGenericTypeParam>;
    /**
     * Fields associated with the struct
     */
    fields: Array<MoveStructField>;
};

/**
 * A Move module
 */
declare type MoveModule = {
    address: Address;
    name: IdentifierWrapper;
    /**
     * Friends of the module
     */
    friends: Array<MoveModuleId>;
    /**
     * Public functions of the module
     */
    exposed_functions: Array<MoveFunction>;
    /**
     * Structs of the module
     */
    structs: Array<MoveStruct>;
};

/**
 * Move module bytecode along with it's ABI
 */
declare type MoveModuleBytecode = {
    bytecode: HexEncodedBytes;
    abi?: MoveModule;
};

/**
 * String representation of a MoveStructTag (on-chain Move struct type). This exists so you
 * can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.
 *
 * It is a combination of:
 * 1. `move_module_address`, `module_name` and `struct_name`, all joined by `::`
 * 2. `struct generic type parameters` joined by `, `
 *
 * Examples:
 * * `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
 * * `0x1::account::Account`
 *
 * Note:
 * 1. Empty chars should be ignored when comparing 2 struct tag ids.
 * 2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 * See [doc](https://aptos.dev/concepts/accounts) for more details.
 *
 */
declare type MoveStructTag = string;

/**
 * This is a JSON representation of some data within an account resource. More specifically,
 * it is a map of strings to arbitrary JSON values / objects, where the keys are top level
 * fields within the given resource.
 *
 * To clarify, you might query for 0x1::account::Account and see the example data.
 *
 * Move `bool` type value is serialized into `boolean`.
 *
 * Move `u8`, `u16` and `u32` type value is serialized into `integer`.
 *
 * Move `u64`, `u128` and `u256` type value is serialized into `string`.
 *
 * Move `address` type value (32 byte Aptos account address) is serialized into a HexEncodedBytes string.
 * For example:
 * - `0x1`
 * - `0x1668f6be25668c1a17cd8caf6b8d2f25`
 *
 * Move `vector` type value is serialized into `array`, except `vector<u8>` which is serialized into a
 * HexEncodedBytes string with `0x` prefix.
 * For example:
 * - `vector<u64>{255, 255}` => `["255", "255"]`
 * - `vector<u8>{255, 255}` => `0xffff`
 *
 * Move `struct` type value is serialized into `object` that looks like this (except some Move stdlib types, see the following section):
 * ```json
 * {
     * field1_name: field1_value,
     * field2_name: field2_value,
     * ......
     * }
     * ```
     *
     * For example:
     * `{ "created": "0xa550c18", "role_id": "0" }`
     *
     * **Special serialization for Move stdlib types**:
     * - [0x1::string::String](https://github.com/aptos-labs/aptos-core/blob/main/language/move-stdlib/docs/ascii.md)
     * is serialized into `string`. For example, struct value `0x1::string::String{bytes: b"Hello World!"}`
     * is serialized as `"Hello World!"` in JSON.
     *
     */
declare type MoveStructValue = {};

/**
 * A parsed Move resource
 */
declare type MoveResource = {
    type: MoveStructTag;
    data: MoveStructValue;
};

/**
 * Representation of a StateKey as a hex string. This is used for cursor based pagination.
 *
 */
declare type StateKeyWrapper = string;

declare class AccountsService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get account
     * Return the authentication key and the sequence number for an account
     * address. Optionally, a ledger version can be specified. If the ledger
     * version is not specified in the request, the latest ledger version is used.
     * @param address Address of account with or without a `0x` prefix
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns AccountData
     * @throws ApiError
     */
    getAccount(address: Address, ledgerVersion?: U64$1): CancelablePromise<AccountData>;
    /**
     * Get account resources
     * Retrieves all account resources for a given account and a specific ledger version.  If the
     * ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @param start Cursor specifying where to start for pagination
     *
     * This cursor cannot be derived manually client-side. Instead, you must
     * call this endpoint once without this query parameter specified, and
     * then use the cursor returned in the X-Aptos-Cursor header in the
     * response.
     * @param limit Max number of account resources to retrieve
     *
     * If not provided, defaults to default page size.
     * @returns MoveResource
     * @throws ApiError
     */
    getAccountResources(address: Address, ledgerVersion?: U64$1, start?: StateKeyWrapper, limit?: number): CancelablePromise<Array<MoveResource>>;
    /**
     * Get account modules
     * Retrieves all account modules' bytecode for a given account at a specific ledger version.
     * If the ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @param start Cursor specifying where to start for pagination
     *
     * This cursor cannot be derived manually client-side. Instead, you must
     * call this endpoint once without this query parameter specified, and
     * then use the cursor returned in the X-Aptos-Cursor header in the
     * response.
     * @param limit Max number of account modules to retrieve
     *
     * If not provided, defaults to default page size.
     * @returns MoveModuleBytecode
     * @throws ApiError
     */
    getAccountModules(address: Address, ledgerVersion?: U64$1, start?: StateKeyWrapper, limit?: number): CancelablePromise<Array<MoveModuleBytecode>>;
    /**
     * Get account resource
     * Retrieves an individual resource from a given account and at a specific ledger version. If the
     * ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param resourceType Name of struct to retrieve e.g. `0x1::account::Account`
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveResource
     * @throws ApiError
     */
    getAccountResource(address: Address, resourceType: MoveStructTag, ledgerVersion?: U64$1): CancelablePromise<MoveResource>;
    /**
     * Get account module
     * Retrieves an individual module from a given account and at a specific ledger version. If the
     * ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param moduleName Name of module to retrieve e.g. `coin`
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveModuleBytecode
     * @throws ApiError
     */
    getAccountModule(address: Address, moduleName: IdentifierWrapper, ledgerVersion?: U64$1): CancelablePromise<MoveModuleBytecode>;
}

declare type HashValue = string;

declare type EventGuid = {
    creation_number: U64$1;
    account_address: Address;
};

/**
 * An event from a transaction
 */
declare type Event = {
    guid: EventGuid;
    sequence_number: U64$1;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};

/**
 * Delete a module
 */
declare type DeleteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    module: MoveModuleId;
};

declare type WriteSetChange_DeleteModule = ({
    type: string;
} & DeleteModule);

/**
 * Delete a resource
 */
declare type DeleteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    resource: MoveStructTag;
};

declare type WriteSetChange_DeleteResource = ({
    type: string;
} & DeleteResource);

/**
 * Deleted table data
 */
declare type DeletedTableData = {
    /**
     * Deleted key
     */
    key: any;
    /**
     * Deleted key type
     */
    key_type: string;
};

/**
 * Delete a table item
 */
declare type DeleteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    data?: DeletedTableData;
};

declare type WriteSetChange_DeleteTableItem = ({
    type: string;
} & DeleteTableItem);

/**
 * Write a new module or update an existing one
 */
declare type WriteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveModuleBytecode;
};

declare type WriteSetChange_WriteModule = ({
    type: string;
} & WriteModule);

/**
 * Write a resource or update an existing one
 */
declare type WriteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveResource;
};

declare type WriteSetChange_WriteResource = ({
    type: string;
} & WriteResource);

/**
 * Decoded table data
 */
declare type DecodedTableData = {
    /**
     * Key of table in JSON
     */
    key: any;
    /**
     * Type of key
     */
    key_type: string;
    /**
     * Value of table in JSON
     */
    value: any;
    /**
     * Type of value
     */
    value_type: string;
};

/**
 * Change set to write a table item
 */
declare type WriteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    value: HexEncodedBytes;
    data?: DecodedTableData;
};

declare type WriteSetChange_WriteTableItem = ({
    type: string;
} & WriteTableItem);

/**
 * A final state change of a transaction on a resource or module
 */
declare type WriteSetChange = (WriteSetChange_DeleteModule | WriteSetChange_DeleteResource | WriteSetChange_DeleteTableItem | WriteSetChange_WriteModule | WriteSetChange_WriteResource | WriteSetChange_WriteTableItem);

/**
 * A block metadata transaction
 *
 * This signifies the beginning of a block, and contains information
 * about the specific block
 */
declare type BlockMetadataTransaction = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    id: HashValue;
    epoch: U64$1;
    round: U64$1;
    /**
     * The events emitted at the block creation
     */
    events: Array<Event>;
    /**
     * Previous block votes
     */
    previous_block_votes_bitvec: Array<number>;
    proposer: Address;
    /**
     * The indices of the proposers who failed to propose
     */
    failed_proposer_indices: Array<number>;
    timestamp: U64$1;
};

declare type Transaction_BlockMetadataTransaction = ({
    type: string;
} & BlockMetadataTransaction);

declare type DirectWriteSet = {
    changes: Array<WriteSetChange>;
    events: Array<Event>;
};

declare type WriteSet_DirectWriteSet = ({
    type: string;
} & DirectWriteSet);

/**
 * Move script bytecode
 */
declare type MoveScriptBytecode = {
    bytecode: HexEncodedBytes;
    abi?: MoveFunction;
};

/**
 * Payload which runs a script that can run multiple functions
 */
declare type ScriptPayload = {
    code: MoveScriptBytecode;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

declare type ScriptWriteSet = {
    execute_as: Address;
    script: ScriptPayload;
};

declare type WriteSet_ScriptWriteSet = ({
    type: string;
} & ScriptWriteSet);

/**
 * The associated writeset with a payload
 */
declare type WriteSet$1 = (WriteSet_ScriptWriteSet | WriteSet_DirectWriteSet);

/**
 * A writeset payload, used only for genesis
 */
declare type WriteSetPayload = {
    write_set: WriteSet$1;
};

declare type GenesisPayload_WriteSetPayload = ({
    type: string;
} & WriteSetPayload);

/**
 * The writeset payload of the Genesis transaction
 */
declare type GenesisPayload = GenesisPayload_WriteSetPayload;

/**
 * The genesis transaction
 *
 * This only occurs at the genesis transaction (version 0)
 */
declare type GenesisTransaction = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    payload: GenesisPayload;
    /**
     * Events emitted during genesis
     */
    events: Array<Event>;
};

declare type Transaction_GenesisTransaction = ({
    type: string;
} & GenesisTransaction);

/**
 * Entry function id is string representation of a entry function defined on-chain.
 *
 * Format: `{address}::{module name}::{function name}`
 *
 * Both `module name` and `function name` are case-sensitive.
 *
 */
declare type EntryFunctionId = string;

/**
 * Payload which runs a single entry function
 */
declare type EntryFunctionPayload = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

declare type TransactionPayload_EntryFunctionPayload = ({
    type: string;
} & EntryFunctionPayload);

declare type ModuleBundlePayload = {
    modules: Array<MoveModuleBytecode>;
};

declare type TransactionPayload_ModuleBundlePayload = ({
    type: string;
} & ModuleBundlePayload);

declare type TransactionPayload_ScriptPayload = ({
    type: string;
} & ScriptPayload);

/**
 * An enum of the possible transaction payloads
 */
declare type TransactionPayload$1 = (TransactionPayload_EntryFunctionPayload | TransactionPayload_ScriptPayload | TransactionPayload_ModuleBundlePayload);

/**
 * A single Ed25519 signature
 */
declare type Ed25519Signature$1 = {
    public_key: HexEncodedBytes;
    signature: HexEncodedBytes;
};

declare type TransactionSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

declare type AccountSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

/**
 * A Ed25519 multi-sig signature
 *
 * This allows k-of-n signing for a transaction
 */
declare type MultiEd25519Signature$1 = {
    /**
     * The public keys for the Ed25519 signature
     */
    public_keys: Array<HexEncodedBytes>;
    /**
     * Signature associated with the public keys in the same order
     */
    signatures: Array<HexEncodedBytes>;
    /**
     * The number of signatures required for a successful transaction
     */
    threshold: number;
    bitmap: HexEncodedBytes;
};

declare type AccountSignature_MultiEd25519Signature = ({
    type: string;
} & MultiEd25519Signature$1);

/**
 * Account signature scheme
 *
 * The account signature scheme allows you to have two types of accounts:
 *
 * 1. A single Ed25519 key account, one private key
 * 2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.
 */
declare type AccountSignature = (AccountSignature_Ed25519Signature | AccountSignature_MultiEd25519Signature);

/**
 * Multi agent signature for multi agent transactions
 *
 * This allows you to have transactions across multiple accounts
 */
declare type MultiAgentSignature = {
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<Address>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
};

declare type TransactionSignature_MultiAgentSignature = ({
    type: string;
} & MultiAgentSignature);

declare type TransactionSignature_MultiEd25519Signature = ({
    type: string;
} & MultiEd25519Signature$1);

/**
 * An enum representing the different transaction signatures available
 */
declare type TransactionSignature = (TransactionSignature_Ed25519Signature | TransactionSignature_MultiEd25519Signature | TransactionSignature_MultiAgentSignature);

/**
 * A transaction waiting in mempool
 */
declare type PendingTransaction = {
    hash: HashValue;
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    signature?: TransactionSignature;
};

declare type Transaction_PendingTransaction = ({
    type: string;
} & PendingTransaction);

/**
 * A state checkpoint transaction
 */
declare type StateCheckpointTransaction = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    timestamp: U64$1;
};

declare type Transaction_StateCheckpointTransaction = ({
    type: string;
} & StateCheckpointTransaction);

/**
 * A transaction submitted by a user to change the state of the blockchain
 */
declare type UserTransaction$1 = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    signature?: TransactionSignature;
    /**
     * Events generated by the transaction
     */
    events: Array<Event>;
    timestamp: U64$1;
};

declare type Transaction_UserTransaction = ({
    type: string;
} & UserTransaction$1);

/**
 * Enum of the different types of transactions in Aptos
 */
declare type Transaction$1 = (Transaction_PendingTransaction | Transaction_UserTransaction | Transaction_GenesisTransaction | Transaction_BlockMetadataTransaction | Transaction_StateCheckpointTransaction);

/**
 * A Block with or without transactions
 *
 * This contains the information about a transactions along with
 * associated transactions if requested
 */
declare type Block = {
    block_height: U64$1;
    block_hash: HashValue;
    block_timestamp: U64$1;
    first_version: U64$1;
    last_version: U64$1;
    /**
     * The transactions in the block in sequential order
     */
    transactions?: Array<Transaction$1>;
};

declare class BlocksService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get blocks by height
     * This endpoint allows you to get the transactions in a block
     * and the corresponding block information.
     *
     * Transactions are limited by max default transactions size.  If not all transactions
     * are present, the user will need to query for the rest of the transactions via the
     * get transactions API.
     *
     * If the block is pruned, it will return a 410
     * @param blockHeight Block height to lookup.  Starts at 0
     * @param withTransactions If set to true, include all transactions in the block
     *
     * If not provided, no transactions will be retrieved
     * @returns Block
     * @throws ApiError
     */
    getBlockByHeight(blockHeight: number, withTransactions?: boolean): CancelablePromise<Block>;
    /**
     * Get blocks by version
     * This endpoint allows you to get the transactions in a block
     * and the corresponding block information given a version in the block.
     *
     * Transactions are limited by max default transactions size.  If not all transactions
     * are present, the user will need to query for the rest of the transactions via the
     * get transactions API.
     *
     * If the block has been pruned, it will return a 410
     * @param version Ledger version to lookup block information for.
     * @param withTransactions If set to true, include all transactions in the block
     *
     * If not provided, no transactions will be retrieved
     * @returns Block
     * @throws ApiError
     */
    getBlockByVersion(version: number, withTransactions?: boolean): CancelablePromise<Block>;
}

/**
 * An event from a transaction with a version
 */
declare type VersionedEvent = {
    version: U64$1;
    guid: EventGuid;
    sequence_number: U64$1;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};

declare class EventsService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get events by creation number
     * Event types are globally identifiable by an account `address` and
     * monotonically increasing `creation_number`, one per event type emitted
     * to the given account. This API returns events corresponding to that
     * that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix, for
     * which events are queried. This refers to the account that events were
     * emitted to, not the account hosting the move module that emits that
     * event type.
     * @param creationNumber Creation number corresponding to the event stream originating
     * from the given account.
     * @param start Starting sequence number of events.
     *
     * If unspecified, by default will retrieve the most recent events
     * @param limit Max number of events to retrieve.
     *
     * If unspecified, defaults to default page size
     * @returns VersionedEvent
     * @throws ApiError
     */
    getEventsByCreationNumber(address: Address, creationNumber: U64$1, start?: U64$1, limit?: number): CancelablePromise<Array<VersionedEvent>>;
    /**
     * Get events by event handle
     * This API uses the given account `address`, `eventHandle`, and `fieldName`
     * to build a key that can globally identify an event types. It then uses this
     * key to return events emitted to the given account matching that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix, for
     * which events are queried. This refers to the account that events were
     * emitted to, not the account hosting the move module that emits that
     * event type.
     * @param eventHandle Name of struct to lookup event handle e.g. `0x1::account::Account`
     * @param fieldName Name of field to lookup event handle e.g. `withdraw_events`
     * @param start Starting sequence number of events.
     *
     * If unspecified, by default will retrieve the most recent
     * @param limit Max number of events to retrieve.
     *
     * If unspecified, defaults to default page size
     * @returns VersionedEvent
     * @throws ApiError
     */
    getEventsByEventHandle(address: Address, eventHandle: MoveStructTag, fieldName: IdentifierWrapper, start?: U64$1, limit?: number): CancelablePromise<Array<VersionedEvent>>;
}

/**
 * Representation of a successful healthcheck
 */
declare type HealthCheckSuccess = {
    message: string;
};

declare enum RoleType {
    VALIDATOR = "validator",
    FULL_NODE = "full_node"
}

/**
 * The struct holding all data returned to the client by the
 * index endpoint (i.e., GET "/").  Only for responding in JSON
 */
declare type IndexResponse = {
    /**
     * Chain ID of the current chain
     */
    chain_id: number;
    epoch: U64$1;
    ledger_version: U64$1;
    oldest_ledger_version: U64$1;
    ledger_timestamp: U64$1;
    node_role: RoleType;
    oldest_block_height: U64$1;
    block_height: U64$1;
    /**
     * Git hash of the build of the API endpoint.  Can be used to determine the exact
     * software version used by the API endpoint.
     */
    git_hash?: string;
};

declare class GeneralService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Show OpenAPI explorer
     * Provides a UI that you can use to explore the API. You can also
     * retrieve the API directly at `/spec.yaml` and `/spec.json`.
     * @returns string
     * @throws ApiError
     */
    spec(): CancelablePromise<string>;
    /**
     * Check basic node health
     * By default this endpoint just checks that it can get the latest ledger
     * info and then returns 200.
     *
     * If the duration_secs param is provided, this endpoint will return a
     * 200 if the following condition is true:
     *
     * `server_latest_ledger_info_timestamp >= server_current_time_timestamp - duration_secs`
     * @param durationSecs Threshold in seconds that the server can be behind to be considered healthy
     *
     * If not provided, the healthcheck will always succeed
     * @returns HealthCheckSuccess
     * @throws ApiError
     */
    healthy(durationSecs?: number): CancelablePromise<HealthCheckSuccess>;
    /**
     * Get ledger info
     * Get the latest ledger information, including data such as chain ID,
     * role type, ledger versions, epoch, etc.
     * @returns IndexResponse
     * @throws ApiError
     */
    getLedgerInfo(): CancelablePromise<IndexResponse>;
}

/**
 * A string containing a 128-bit unsigned integer.
 *
 * We represent u128 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u128s in JSON natively.
 *
 */
declare type U128 = string;

/**
 * A string containing a 256-bit unsigned integer.
 *
 * We represent u256 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u256s in JSON natively.
 *
 */
declare type U256 = string;

/**
 * An enum of the possible Move value types
 */
declare type MoveValue = (number | U64$1 | U128 | U256 | boolean | Address | Array<MoveValue> | HexEncodedBytes | MoveStructValue | string);

/**
 * Table Item request for the GetTableItemRaw API
 */
declare type RawTableItemRequest = {
    key: HexEncodedBytes;
};

/**
 * Table Item request for the GetTableItem API
 */
declare type TableItemRequest = {
    key_type: MoveType;
    value_type: MoveType;
    /**
     * The value of the table item's key
     */
    key: any;
};

declare class TablesService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get table item
     * Get a table item at a specific ledger version from the table identified by {table_handle}
     * in the path and the "key" (TableItemRequest) provided in the request body.
     *
     * This is a POST endpoint because the "key" for requesting a specific
     * table item (TableItemRequest) could be quite complex, as each of its
     * fields could themselves be composed of other structs. This makes it
     * impractical to express using query params, meaning GET isn't an option.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param tableHandle Table handle hex encoded 32-byte string
     * @param requestBody
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveValue
     * @throws ApiError
     */
    getTableItem(tableHandle: Address, requestBody: TableItemRequest, ledgerVersion?: U64$1): CancelablePromise<MoveValue>;
    /**
     * Get raw table item
     * Get a table item at a specific ledger version from the table identified by {table_handle}
     * in the path and the "key" (RawTableItemRequest) provided in the request body.
     *
     * The `get_raw_table_item` requires only a serialized key comparing to the full move type information
     * comparing to the `get_table_item` api, and can only return the query in the bcs format.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param tableHandle Table handle hex encoded 32-byte string
     * @param requestBody
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveValue
     * @throws ApiError
     */
    getRawTableItem(tableHandle: Address, requestBody: RawTableItemRequest, ledgerVersion?: U64$1): CancelablePromise<MoveValue>;
}

/**
 * Request to encode a submission
 */
declare type EncodeSubmissionRequest = {
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    /**
     * Secondary signer accounts of the request for Multi-agent
     */
    secondary_signers?: Array<Address>;
};

/**
 * Struct holding the outputs of the estimate gas API
 */
declare type GasEstimation = {
    /**
     * The deprioritized estimate for the gas unit price
     */
    deprioritized_gas_estimate?: number;
    /**
     * The current estimate for the gas unit price
     */
    gas_estimate: number;
    /**
     * The prioritized estimate for the gas unit price
     */
    prioritized_gas_estimate?: number;
};

/**
 * A request to submit a transaction
 *
 * This requires a transaction and a signature of it
 */
declare type SubmitTransactionRequest = {
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    signature: TransactionSignature;
};

/**
 * These codes provide more granular error information beyond just the HTTP
 * status code of the response.
 */
declare enum AptosErrorCode {
    ACCOUNT_NOT_FOUND = "account_not_found",
    RESOURCE_NOT_FOUND = "resource_not_found",
    MODULE_NOT_FOUND = "module_not_found",
    STRUCT_FIELD_NOT_FOUND = "struct_field_not_found",
    VERSION_NOT_FOUND = "version_not_found",
    TRANSACTION_NOT_FOUND = "transaction_not_found",
    TABLE_ITEM_NOT_FOUND = "table_item_not_found",
    BLOCK_NOT_FOUND = "block_not_found",
    VERSION_PRUNED = "version_pruned",
    BLOCK_PRUNED = "block_pruned",
    INVALID_INPUT = "invalid_input",
    INVALID_TRANSACTION_UPDATE = "invalid_transaction_update",
    SEQUENCE_NUMBER_TOO_OLD = "sequence_number_too_old",
    VM_ERROR = "vm_error",
    HEALTH_CHECK_FAILED = "health_check_failed",
    MEMPOOL_IS_FULL = "mempool_is_full",
    INTERNAL_ERROR = "internal_error",
    WEB_FRAMEWORK_ERROR = "web_framework_error",
    BCS_NOT_SUPPORTED = "bcs_not_supported",
    API_DISABLED = "api_disabled"
}

/**
 * This is the generic struct we use for all API errors, it contains a string
 * message and an Aptos API specific error code.
 */
declare type AptosError = {
    /**
     * A message describing the error
     */
    message: string;
    error_code: AptosErrorCode;
    /**
     * A code providing VM error details when submitting transactions to the VM
     */
    vm_error_code?: number;
};

/**
 * Information telling which batch submission transactions failed
 */
declare type TransactionsBatchSingleSubmissionFailure = {
    error: AptosError;
    /**
     * The index of which transaction failed, same as submission order
     */
    transaction_index: number;
};

/**
 * Batch transaction submission result
 *
 * Tells which transactions failed
 */
declare type TransactionsBatchSubmissionResult = {
    /**
     * Summary of the failed transactions
     */
    transaction_failures: Array<TransactionsBatchSingleSubmissionFailure>;
};

declare class TransactionsService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get transactions
     * Retrieve on-chain committed transactions. The page size and start ledger version
     * can be provided to get a specific sequence of transactions.
     *
     * If the version has been pruned, then a 410 will be returned.
     *
     * To retrieve a pending transaction, use /transactions/by_hash.
     * @param start Ledger version to start list of transactions
     *
     * If not provided, defaults to showing the latest transactions
     * @param limit Max number of transactions to retrieve.
     *
     * If not provided, defaults to default page size
     * @returns Transaction
     * @throws ApiError
     */
    getTransactions(start?: U64$1, limit?: number): CancelablePromise<Array<Transaction$1>>;
    /**
     * Submit transaction
     * This endpoint accepts transaction submissions in two formats.
     *
     * To submit a transaction as JSON, you must submit a SubmitTransactionRequest.
     * To build this request, do the following:
     *
     * 1. Encode the transaction as BCS. If you are using a language that has
     * native BCS support, make sure of that library. If not, you may take
     * advantage of /transactions/encode_submission. When using this
     * endpoint, make sure you trust the node you're talking to, as it is
     * possible they could manipulate your request.
     * 2. Sign the encoded transaction and use it to create a TransactionSignature.
     * 3. Submit the request. Make sure to use the "application/json" Content-Type.
     *
     * To submit a transaction as BCS, you must submit a SignedTransaction
     * encoded as BCS. See SignedTransaction in types/src/transaction/mod.rs.
     * Make sure to use the `application/x.aptos.signed_transaction+bcs` Content-Type.
     * @param requestBody
     * @returns PendingTransaction
     * @throws ApiError
     */
    submitTransaction(requestBody: SubmitTransactionRequest): CancelablePromise<PendingTransaction>;
    /**
     * Get transaction by hash
     * Look up a transaction by its hash. This is the same hash that is returned
     * by the API when submitting a transaction (see PendingTransaction).
     *
     * When given a transaction hash, the server first looks for the transaction
     * in storage (on-chain, committed). If no on-chain transaction is found, it
     * looks the transaction up by hash in the mempool (pending, not yet committed).
     *
     * To create a transaction hash by yourself, do the following:
     * 1. Hash message bytes: "RawTransaction" bytes + BCS bytes of [Transaction](https://aptos-labs.github.io/aptos-core/aptos_types/transaction/enum.Transaction.html).
     * 2. Apply hash algorithm `SHA3-256` to the hash message bytes.
     * 3. Hex-encode the hash bytes with `0x` prefix.
     * @param txnHash Hash of transaction to retrieve
     * @returns Transaction
     * @throws ApiError
     */
    getTransactionByHash(txnHash: HashValue): CancelablePromise<Transaction$1>;
    /**
     * Get transaction by version
     * Retrieves a transaction by a given version. If the version has been
     * pruned, a 410 will be returned.
     * @param txnVersion Version of transaction to retrieve
     * @returns Transaction
     * @throws ApiError
     */
    getTransactionByVersion(txnVersion: U64$1): CancelablePromise<Transaction$1>;
    /**
     * Get account transactions
     * Retrieves on-chain committed transactions from an account. If the start
     * version is too far in the past, a 410 will be returned.
     *
     * If no start version is given, it will start at version 0.
     *
     * To retrieve a pending transaction, use /transactions/by_hash.
     * @param address Address of account with or without a `0x` prefix
     * @param start Account sequence number to start list of transactions
     *
     * If not provided, defaults to showing the latest transactions
     * @param limit Max number of transactions to retrieve.
     *
     * If not provided, defaults to default page size
     * @returns Transaction
     * @throws ApiError
     */
    getAccountTransactions(address: Address, start?: U64$1, limit?: number): CancelablePromise<Array<Transaction$1>>;
    /**
     * Submit batch transactions
     * This allows you to submit multiple transactions.  The response has three outcomes:
     *
     * 1. All transactions succeed, and it will return a 202
     * 2. Some transactions succeed, and it will return the failed transactions and a 206
     * 3. No transactions succeed, and it will also return the failed transactions and a 206
     *
     * To submit a transaction as JSON, you must submit a SubmitTransactionRequest.
     * To build this request, do the following:
     *
     * 1. Encode the transaction as BCS. If you are using a language that has
     * native BCS support, make sure to use that library. If not, you may take
     * advantage of /transactions/encode_submission. When using this
     * endpoint, make sure you trust the node you're talking to, as it is
     * possible they could manipulate your request.
     * 2. Sign the encoded transaction and use it to create a TransactionSignature.
     * 3. Submit the request. Make sure to use the "application/json" Content-Type.
     *
     * To submit a transaction as BCS, you must submit a SignedTransaction
     * encoded as BCS. See SignedTransaction in types/src/transaction/mod.rs.
     * Make sure to use the `application/x.aptos.signed_transaction+bcs` Content-Type.
     * @param requestBody
     * @returns TransactionsBatchSubmissionResult
     * @throws ApiError
     */
    submitBatchTransactions(requestBody: Array<SubmitTransactionRequest>): CancelablePromise<TransactionsBatchSubmissionResult>;
    /**
     * Simulate transaction
     * The output of the transaction will have the exact transaction outputs and events that running
     * an actual signed transaction would have.  However, it will not have the associated state
     * hashes, as they are not updated in storage.  This can be used to estimate the maximum gas
     * units for a submitted transaction.
     *
     * To use this, you must:
     * - Create a SignedTransaction with a zero-padded signature.
     * - Submit a SubmitTransactionRequest containing a UserTransactionRequest containing that signature.
     *
     * To use this endpoint with BCS, you must submit a SignedTransaction
     * encoded as BCS. See SignedTransaction in types/src/transaction/mod.rs.
     * @param requestBody
     * @param estimateMaxGasAmount If set to true, the max gas value in the transaction will be ignored
     * and the maximum possible gas will be used
     * @param estimateGasUnitPrice If set to true, the gas unit price in the transaction will be ignored
     * and the estimated value will be used
     * @param estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the original
     * estimate.
     * @returns UserTransaction
     * @throws ApiError
     */
    simulateTransaction(requestBody: SubmitTransactionRequest, estimateMaxGasAmount?: boolean, estimateGasUnitPrice?: boolean, estimatePrioritizedGasUnitPrice?: boolean): CancelablePromise<Array<UserTransaction$1>>;
    /**
     * Encode submission
     * This endpoint accepts an EncodeSubmissionRequest, which internally is a
     * UserTransactionRequestInner (and optionally secondary signers) encoded
     * as JSON, validates the request format, and then returns that request
     * encoded in BCS. The client can then use this to create a transaction
     * signature to be used in a SubmitTransactionRequest, which it then
     * passes to the /transactions POST endpoint.
     *
     * To be clear, this endpoint makes it possible to submit transaction
     * requests to the API from languages that do not have library support for
     * BCS. If you are using an SDK that has BCS support, such as the official
     * Rust, TypeScript, or Python SDKs, you do not need to use this endpoint.
     *
     * To sign a message using the response from this endpoint:
     * - Decode the hex encoded string in the response to bytes.
     * - Sign the bytes to create the signature.
     * - Use that as the signature field in something like Ed25519Signature, which you then use to build a TransactionSignature.
     * @param requestBody
     * @returns HexEncodedBytes
     * @throws ApiError
     */
    encodeSubmission(requestBody: EncodeSubmissionRequest): CancelablePromise<HexEncodedBytes>;
    /**
     * Estimate gas price
     * Currently, the gas estimation is handled by taking the median of the last 100,000 transactions
     * If a user wants to prioritize their transaction and is willing to pay, they can pay more
     * than the gas price.  If they're willing to wait longer, they can pay less.  Note that the
     * gas price moves with the fee market, and should only increase when demand outweighs supply.
     *
     * If there have been no transactions in the last 100,000 transactions, the price will be 1.
     * @returns GasEstimation
     * @throws ApiError
     */
    estimateGasPrice(): CancelablePromise<GasEstimation>;
}

/**
 * View request for the Move View Function API
 */
declare type ViewRequest = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

declare class ViewService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Execute view function of a module
     * Execute the Move function with the given parameters and return its execution result.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param requestBody
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveValue
     * @throws ApiError
     */
    view(requestBody: ViewRequest, ledgerVersion?: U64$1): CancelablePromise<Array<MoveValue>>;
}

declare type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
declare class AptosGeneratedClient {
    readonly accounts: AccountsService;
    readonly blocks: BlocksService;
    readonly events: EventsService;
    readonly general: GeneralService;
    readonly tables: TablesService;
    readonly transactions: TransactionsService;
    readonly view: ViewService;
    readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest?: HttpRequestConstructor);
}

declare type ApiResult = {
    readonly url: string;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly body: any;
};

declare class ApiError$1 extends Error {
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly body: any;
    readonly request: ApiRequestOptions;
    constructor(request: ApiRequestOptions, response: ApiResult, message: string);
}

declare const $AccountData: {
    readonly description: "Account data\n\n    A simplified version of the onchain Account resource";
    readonly properties: {
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly authentication_key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
    };
};

declare const $AccountSignature: {
    readonly type: "one-of";
    readonly description: "Account signature scheme\n\n    The account signature scheme allows you to have two types of accounts:\n\n    1. A single Ed25519 key account, one private key\n    2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.";
    readonly contains: readonly [{
        readonly type: "AccountSignature_Ed25519Signature";
    }, {
        readonly type: "AccountSignature_MultiEd25519Signature";
    }];
};

declare const $AccountSignature_Ed25519Signature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "Ed25519Signature";
    }];
};

declare const $AccountSignature_MultiEd25519Signature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "MultiEd25519Signature";
    }];
};

declare const $Address: {
    readonly type: "string";
    readonly description: "A hex encoded 32 byte Aptos account address.\n\n    This is represented in a string as a 64 character hex string, sometimes\n    shortened by stripping leading 0s, and adding a 0x.\n\n    For example, address 0x0000000000000000000000000000000000000000000000000000000000000001 is represented as 0x1.\n    ";
    readonly format: "hex";
};

declare const $AptosError: {
    readonly description: "This is the generic struct we use for all API errors, it contains a string\n    message and an Aptos API specific error code.";
    readonly properties: {
        readonly message: {
            readonly type: "string";
            readonly description: "A message describing the error";
            readonly isRequired: true;
        };
        readonly error_code: {
            readonly type: "AptosErrorCode";
            readonly isRequired: true;
        };
        readonly vm_error_code: {
            readonly type: "number";
            readonly description: "A code providing VM error details when submitting transactions to the VM";
            readonly format: "uint64";
        };
    };
};

declare const $AptosErrorCode: {
    readonly type: "Enum";
};

declare const $Block: {
    readonly description: "A Block with or without transactions\n\n    This contains the information about a transactions along with\n    associated transactions if requested";
    readonly properties: {
        readonly block_height: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly block_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly block_timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly first_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly last_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly transactions: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Transaction";
            };
        };
    };
};

declare const $BlockMetadataTransaction: {
    readonly description: "A block metadata transaction\n\n    This signifies the beginning of a block, and contains information\n    about the specific block";
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_change_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly event_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_checkpoint_hash: {
            readonly type: "HashValue";
        };
        readonly gas_used: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly success: {
            readonly type: "boolean";
            readonly description: "Whether the transaction was successful";
            readonly isRequired: true;
        };
        readonly vm_status: {
            readonly type: "string";
            readonly description: "The VM status of the transaction, can tell useful information in a failure";
            readonly isRequired: true;
        };
        readonly accumulator_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
            readonly isRequired: true;
        };
        readonly id: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly epoch: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly round: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
        readonly previous_block_votes_bitvec: {
            readonly type: "array";
            readonly contains: {
                readonly type: "number";
                readonly format: "uint8";
            };
            readonly isRequired: true;
        };
        readonly proposer: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly failed_proposer_indices: {
            readonly type: "array";
            readonly contains: {
                readonly type: "number";
                readonly format: "uint32";
            };
            readonly isRequired: true;
        };
        readonly timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};

declare const $DecodedTableData: {
    readonly description: "Decoded table data";
    readonly properties: {
        readonly key: {
            readonly description: "Key of table in JSON";
            readonly properties: {};
            readonly isRequired: true;
        };
        readonly key_type: {
            readonly type: "string";
            readonly description: "Type of key";
            readonly isRequired: true;
        };
        readonly value: {
            readonly description: "Value of table in JSON";
            readonly properties: {};
            readonly isRequired: true;
        };
        readonly value_type: {
            readonly type: "string";
            readonly description: "Type of value";
            readonly isRequired: true;
        };
    };
};

declare const $DeletedTableData: {
    readonly description: "Deleted table data";
    readonly properties: {
        readonly key: {
            readonly description: "Deleted key";
            readonly properties: {};
            readonly isRequired: true;
        };
        readonly key_type: {
            readonly type: "string";
            readonly description: "Deleted key type";
            readonly isRequired: true;
        };
    };
};

declare const $DeleteModule: {
    readonly description: "Delete a module";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly state_key_hash: {
            readonly type: "string";
            readonly description: "State key hash";
            readonly isRequired: true;
        };
        readonly module: {
            readonly type: "MoveModuleId";
            readonly isRequired: true;
        };
    };
};

declare const $DeleteResource: {
    readonly description: "Delete a resource";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly state_key_hash: {
            readonly type: "string";
            readonly description: "State key hash";
            readonly isRequired: true;
        };
        readonly resource: {
            readonly type: "MoveStructTag";
            readonly isRequired: true;
        };
    };
};

declare const $DeleteTableItem: {
    readonly description: "Delete a table item";
    readonly properties: {
        readonly state_key_hash: {
            readonly type: "string";
            readonly isRequired: true;
        };
        readonly handle: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "DeletedTableData";
        };
    };
};

declare const $DirectWriteSet: {
    readonly properties: {
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
            readonly isRequired: true;
        };
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
    };
};

declare const $Ed25519Signature: {
    readonly description: "A single Ed25519 signature";
    readonly properties: {
        readonly public_key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly signature: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
    };
};

declare const $EncodeSubmissionRequest: {
    readonly description: "Request to encode a submission";
    readonly properties: {
        readonly sender: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly max_gas_amount: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly gas_unit_price: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly expiration_timestamp_secs: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly payload: {
            readonly type: "TransactionPayload";
            readonly isRequired: true;
        };
        readonly secondary_signers: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Address";
            };
        };
    };
};

declare const $EntryFunctionId: {
    readonly type: "string";
    readonly description: "Entry function id is string representation of a entry function defined on-chain.\n\n    Format: `{address}::{module name}::{function name}`\n\n    Both `module name` and `function name` are case-sensitive.\n    ";
};

declare const $EntryFunctionPayload: {
    readonly description: "Payload which runs a single entry function";
    readonly properties: {
        readonly function: {
            readonly type: "EntryFunctionId";
            readonly isRequired: true;
        };
        readonly type_arguments: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
        readonly arguments: {
            readonly type: "array";
            readonly contains: {
                readonly properties: {};
            };
            readonly isRequired: true;
        };
    };
};

declare const $Event: {
    readonly description: "An event from a transaction";
    readonly properties: {
        readonly guid: {
            readonly type: "EventGuid";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly data: {
            readonly description: "The JSON representation of the event";
            readonly properties: {};
            readonly isRequired: true;
        };
    };
};

declare const $EventGuid: {
    readonly properties: {
        readonly creation_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly account_address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
    };
};

declare const $GasEstimation: {
    readonly description: "Struct holding the outputs of the estimate gas API";
    readonly properties: {
        readonly deprioritized_gas_estimate: {
            readonly type: "number";
            readonly description: "The deprioritized estimate for the gas unit price";
            readonly format: "uint64";
        };
        readonly gas_estimate: {
            readonly type: "number";
            readonly description: "The current estimate for the gas unit price";
            readonly isRequired: true;
            readonly format: "uint64";
        };
        readonly prioritized_gas_estimate: {
            readonly type: "number";
            readonly description: "The prioritized estimate for the gas unit price";
            readonly format: "uint64";
        };
    };
};

declare const $GenesisPayload: {
    readonly type: "one-of";
    readonly description: "The writeset payload of the Genesis transaction";
    readonly contains: readonly [{
        readonly type: "GenesisPayload_WriteSetPayload";
    }];
};

declare const $GenesisPayload_WriteSetPayload: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "WriteSetPayload";
    }];
};

declare const $GenesisTransaction: {
    readonly description: "The genesis transaction\n\n    This only occurs at the genesis transaction (version 0)";
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_change_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly event_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_checkpoint_hash: {
            readonly type: "HashValue";
        };
        readonly gas_used: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly success: {
            readonly type: "boolean";
            readonly description: "Whether the transaction was successful";
            readonly isRequired: true;
        };
        readonly vm_status: {
            readonly type: "string";
            readonly description: "The VM status of the transaction, can tell useful information in a failure";
            readonly isRequired: true;
        };
        readonly accumulator_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
            readonly isRequired: true;
        };
        readonly payload: {
            readonly type: "GenesisPayload";
            readonly isRequired: true;
        };
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
    };
};

declare const $HashValue: {
    readonly type: "string";
};

declare const $HealthCheckSuccess: {
    readonly description: "Representation of a successful healthcheck";
    readonly properties: {
        readonly message: {
            readonly type: "string";
            readonly isRequired: true;
        };
    };
};

declare const $HexEncodedBytes: {
    readonly type: "string";
    readonly description: "All bytes (Vec<u8>) data is represented as hex-encoded string prefixed with `0x` and fulfilled with\n    two hex digits per byte.\n\n    Unlike the `Address` type, HexEncodedBytes will not trim any zeros.\n    ";
    readonly format: "hex";
};

declare const $IdentifierWrapper: {
    readonly type: "string";
};

declare const $IndexResponse: {
    readonly description: "The struct holding all data returned to the client by the\n    index endpoint (i.e., GET \"/\").  Only for responding in JSON";
    readonly properties: {
        readonly chain_id: {
            readonly type: "number";
            readonly description: "Chain ID of the current chain";
            readonly isRequired: true;
            readonly format: "uint8";
        };
        readonly epoch: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly ledger_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly oldest_ledger_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly ledger_timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly node_role: {
            readonly type: "RoleType";
            readonly isRequired: true;
        };
        readonly oldest_block_height: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly block_height: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly git_hash: {
            readonly type: "string";
            readonly description: "Git hash of the build of the API endpoint.  Can be used to determine the exact\n            software version used by the API endpoint.";
        };
    };
};

declare const $ModuleBundlePayload: {
    readonly properties: {
        readonly modules: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveModuleBytecode";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MoveAbility: {
    readonly type: "string";
};

declare const $MoveFunction: {
    readonly description: "Move function";
    readonly properties: {
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly visibility: {
            readonly type: "MoveFunctionVisibility";
            readonly isRequired: true;
        };
        readonly is_entry: {
            readonly type: "boolean";
            readonly description: "Whether the function can be called as an entry function directly in a transaction";
            readonly isRequired: true;
        };
        readonly generic_type_params: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveFunctionGenericTypeParam";
            };
            readonly isRequired: true;
        };
        readonly params: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
        readonly return: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MoveFunctionGenericTypeParam: {
    readonly description: "Move function generic type param";
    readonly properties: {
        readonly constraints: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveAbility";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MoveFunctionVisibility: {
    readonly type: "Enum";
};

declare const $MoveModule: {
    readonly description: "A Move module";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly friends: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveModuleId";
            };
            readonly isRequired: true;
        };
        readonly exposed_functions: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveFunction";
            };
            readonly isRequired: true;
        };
        readonly structs: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveStruct";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MoveModuleBytecode: {
    readonly description: "Move module bytecode along with it's ABI";
    readonly properties: {
        readonly bytecode: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly abi: {
            readonly type: "MoveModule";
        };
    };
};

declare const $MoveModuleId: {
    readonly type: "string";
    readonly description: "Move module id is a string representation of Move module.\n\n    Format: `{address}::{module name}`\n\n    `address` should be hex-encoded 32 byte account address that is prefixed with `0x`.\n\n    Module name is case-sensitive.\n    ";
};

declare const $MoveResource: {
    readonly description: "A parsed Move resource";
    readonly properties: {
        readonly type: {
            readonly type: "MoveStructTag";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "MoveStructValue";
            readonly isRequired: true;
        };
    };
};

declare const $MoveScriptBytecode: {
    readonly description: "Move script bytecode";
    readonly properties: {
        readonly bytecode: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly abi: {
            readonly type: "MoveFunction";
        };
    };
};

declare const $MoveStruct: {
    readonly description: "A move struct";
    readonly properties: {
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly is_native: {
            readonly type: "boolean";
            readonly description: "Whether the struct is a native struct of Move";
            readonly isRequired: true;
        };
        readonly abilities: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveAbility";
            };
            readonly isRequired: true;
        };
        readonly generic_type_params: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveStructGenericTypeParam";
            };
            readonly isRequired: true;
        };
        readonly fields: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveStructField";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MoveStructField: {
    readonly description: "Move struct field";
    readonly properties: {
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
    };
};

declare const $MoveStructGenericTypeParam: {
    readonly description: "Move generic type param";
    readonly properties: {
        readonly constraints: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveAbility";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MoveStructTag: {
    readonly type: "string";
    readonly description: "String representation of a MoveStructTag (on-chain Move struct type). This exists so you\n    can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.\n\n    It is a combination of:\n    1. `move_module_address`, `module_name` and `struct_name`, all joined by `::`\n    2. `struct generic type parameters` joined by `, `\n\n    Examples:\n     * `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`\n     * `0x1::account::Account`\n\n    Note:\n    1. Empty chars should be ignored when comparing 2 struct tag ids.\n    2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).\n\n    See [doc](https://aptos.dev/concepts/accounts) for more details.\n    ";
    readonly pattern: "^0x[0-9a-zA-Z:_<>]+$";
};

declare const $MoveStructValue: {
    readonly description: "This is a JSON representation of some data within an account resource. More specifically,\n    it is a map of strings to arbitrary JSON values / objects, where the keys are top level\n    fields within the given resource.\n\n    To clarify, you might query for 0x1::account::Account and see the example data.\n\n    Move `bool` type value is serialized into `boolean`.\n\n    Move `u8`, `u16` and `u32` type value is serialized into `integer`.\n\n    Move `u64`, `u128` and `u256` type value is serialized into `string`.\n\n    Move `address` type value (32 byte Aptos account address) is serialized into a HexEncodedBytes string.\n    For example:\n    - `0x1`\n    - `0x1668f6be25668c1a17cd8caf6b8d2f25`\n\n    Move `vector` type value is serialized into `array`, except `vector<u8>` which is serialized into a\n    HexEncodedBytes string with `0x` prefix.\n    For example:\n    - `vector<u64>{255, 255}` => `[\"255\", \"255\"]`\n    - `vector<u8>{255, 255}` => `0xffff`\n\n    Move `struct` type value is serialized into `object` that looks like this (except some Move stdlib types, see the following section):\n    ```json\n    {\n        field1_name: field1_value,\n        field2_name: field2_value,\n        ......\n    }\n    ```\n\n    For example:\n    `{ \"created\": \"0xa550c18\", \"role_id\": \"0\" }`\n\n     **Special serialization for Move stdlib types**:\n    - [0x1::string::String](https://github.com/aptos-labs/aptos-core/blob/main/language/move-stdlib/docs/ascii.md)\n    is serialized into `string`. For example, struct value `0x1::string::String{bytes: b\"Hello World!\"}`\n    is serialized as `\"Hello World!\"` in JSON.\n    ";
    readonly properties: {};
};

declare const $MoveType: {
    readonly type: "string";
    readonly description: "String representation of an on-chain Move type tag that is exposed in transaction payload.\n    Values:\n    - bool\n    - u8\n    - u16\n    - u32\n    - u64\n    - u128\n    - u256\n    - address\n    - signer\n    - vector: `vector<{non-reference MoveTypeId}>`\n    - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`\n\n    Vector type value examples:\n    - `vector<u8>`\n    - `vector<vector<u64>>`\n    - `vector<0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>>`\n\n    Struct type value examples:\n    - `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>\n    - `0x1::account::Account`\n\n    Note:\n    1. Empty chars should be ignored when comparing 2 struct tag ids.\n    2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).\n    ";
    readonly pattern: "^(bool|u8|u64|u128|address|signer|vector<.+>|0x[0-9a-zA-Z:_<, >]+)$";
};

declare const $MoveValue: {
    readonly type: "any-of";
    readonly description: "An enum of the possible Move value types";
    readonly contains: readonly [{
        readonly type: "number";
        readonly format: "uint8";
    }, {
        readonly type: "number";
        readonly format: "uint16";
    }, {
        readonly type: "number";
        readonly format: "uint32";
    }, {
        readonly type: "U64";
    }, {
        readonly type: "U128";
    }, {
        readonly type: "U256";
    }, {
        readonly type: "boolean";
    }, {
        readonly type: "Address";
    }, {
        readonly type: "array";
        readonly contains: {
            readonly type: "MoveValue";
        };
    }, {
        readonly type: "HexEncodedBytes";
    }, {
        readonly type: "MoveStructValue";
    }, {
        readonly type: "string";
    }];
};

declare const $MultiAgentSignature: {
    readonly description: "Multi agent signature for multi agent transactions\n\n    This allows you to have transactions across multiple accounts";
    readonly properties: {
        readonly sender: {
            readonly type: "AccountSignature";
            readonly isRequired: true;
        };
        readonly secondary_signer_addresses: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Address";
            };
            readonly isRequired: true;
        };
        readonly secondary_signers: {
            readonly type: "array";
            readonly contains: {
                readonly type: "AccountSignature";
            };
            readonly isRequired: true;
        };
    };
};

declare const $MultiEd25519Signature: {
    readonly description: "A Ed25519 multi-sig signature\n\n    This allows k-of-n signing for a transaction";
    readonly properties: {
        readonly public_keys: {
            readonly type: "array";
            readonly contains: {
                readonly type: "HexEncodedBytes";
            };
            readonly isRequired: true;
        };
        readonly signatures: {
            readonly type: "array";
            readonly contains: {
                readonly type: "HexEncodedBytes";
            };
            readonly isRequired: true;
        };
        readonly threshold: {
            readonly type: "number";
            readonly description: "The number of signatures required for a successful transaction";
            readonly isRequired: true;
            readonly format: "uint8";
        };
        readonly bitmap: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
    };
};

declare const $PendingTransaction: {
    readonly description: "A transaction waiting in mempool";
    readonly properties: {
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly sender: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly max_gas_amount: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly gas_unit_price: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly expiration_timestamp_secs: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly payload: {
            readonly type: "TransactionPayload";
            readonly isRequired: true;
        };
        readonly signature: {
            readonly type: "TransactionSignature";
        };
    };
};

declare const $RawTableItemRequest: {
    readonly description: "Table Item request for the GetTableItemRaw API";
    readonly properties: {
        readonly key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
    };
};

declare const $RoleType: {
    readonly type: "Enum";
};

declare const $ScriptPayload: {
    readonly description: "Payload which runs a script that can run multiple functions";
    readonly properties: {
        readonly code: {
            readonly type: "MoveScriptBytecode";
            readonly isRequired: true;
        };
        readonly type_arguments: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
        readonly arguments: {
            readonly type: "array";
            readonly contains: {
                readonly properties: {};
            };
            readonly isRequired: true;
        };
    };
};

declare const $ScriptWriteSet: {
    readonly properties: {
        readonly execute_as: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly script: {
            readonly type: "ScriptPayload";
            readonly isRequired: true;
        };
    };
};

declare const $StateCheckpointTransaction: {
    readonly description: "A state checkpoint transaction";
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_change_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly event_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_checkpoint_hash: {
            readonly type: "HashValue";
        };
        readonly gas_used: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly success: {
            readonly type: "boolean";
            readonly description: "Whether the transaction was successful";
            readonly isRequired: true;
        };
        readonly vm_status: {
            readonly type: "string";
            readonly description: "The VM status of the transaction, can tell useful information in a failure";
            readonly isRequired: true;
        };
        readonly accumulator_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
            readonly isRequired: true;
        };
        readonly timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};

declare const $StateKeyWrapper: {
    readonly type: "string";
    readonly description: "Representation of a StateKey as a hex string. This is used for cursor based pagination.\n    ";
};

declare const $SubmitTransactionRequest: {
    readonly description: "A request to submit a transaction\n\n    This requires a transaction and a signature of it";
    readonly properties: {
        readonly sender: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly max_gas_amount: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly gas_unit_price: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly expiration_timestamp_secs: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly payload: {
            readonly type: "TransactionPayload";
            readonly isRequired: true;
        };
        readonly signature: {
            readonly type: "TransactionSignature";
            readonly isRequired: true;
        };
    };
};

declare const $TableItemRequest: {
    readonly description: "Table Item request for the GetTableItem API";
    readonly properties: {
        readonly key_type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly value_type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly key: {
            readonly description: "The value of the table item's key";
            readonly properties: {};
            readonly isRequired: true;
        };
    };
};

declare const $Transaction: {
    readonly type: "one-of";
    readonly description: "Enum of the different types of transactions in Aptos";
    readonly contains: readonly [{
        readonly type: "Transaction_PendingTransaction";
    }, {
        readonly type: "Transaction_UserTransaction";
    }, {
        readonly type: "Transaction_GenesisTransaction";
    }, {
        readonly type: "Transaction_BlockMetadataTransaction";
    }, {
        readonly type: "Transaction_StateCheckpointTransaction";
    }];
};

declare const $Transaction_BlockMetadataTransaction: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "BlockMetadataTransaction";
    }];
};

declare const $Transaction_GenesisTransaction: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "GenesisTransaction";
    }];
};

declare const $Transaction_PendingTransaction: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "PendingTransaction";
    }];
};

declare const $Transaction_StateCheckpointTransaction: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "StateCheckpointTransaction";
    }];
};

declare const $Transaction_UserTransaction: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "UserTransaction";
    }];
};

declare const $TransactionPayload: {
    readonly type: "one-of";
    readonly description: "An enum of the possible transaction payloads";
    readonly contains: readonly [{
        readonly type: "TransactionPayload_EntryFunctionPayload";
    }, {
        readonly type: "TransactionPayload_ScriptPayload";
    }, {
        readonly type: "TransactionPayload_ModuleBundlePayload";
    }];
};

declare const $TransactionPayload_EntryFunctionPayload: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "EntryFunctionPayload";
    }];
};

declare const $TransactionPayload_ModuleBundlePayload: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "ModuleBundlePayload";
    }];
};

declare const $TransactionPayload_ScriptPayload: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "ScriptPayload";
    }];
};

declare const $TransactionsBatchSingleSubmissionFailure: {
    readonly description: "Information telling which batch submission transactions failed";
    readonly properties: {
        readonly error: {
            readonly type: "AptosError";
            readonly isRequired: true;
        };
        readonly transaction_index: {
            readonly type: "number";
            readonly description: "The index of which transaction failed, same as submission order";
            readonly isRequired: true;
            readonly format: "uint64";
        };
    };
};

declare const $TransactionsBatchSubmissionResult: {
    readonly description: "Batch transaction submission result\n\n    Tells which transactions failed";
    readonly properties: {
        readonly transaction_failures: {
            readonly type: "array";
            readonly contains: {
                readonly type: "TransactionsBatchSingleSubmissionFailure";
            };
            readonly isRequired: true;
        };
    };
};

declare const $TransactionSignature: {
    readonly type: "one-of";
    readonly description: "An enum representing the different transaction signatures available";
    readonly contains: readonly [{
        readonly type: "TransactionSignature_Ed25519Signature";
    }, {
        readonly type: "TransactionSignature_MultiEd25519Signature";
    }, {
        readonly type: "TransactionSignature_MultiAgentSignature";
    }];
};

declare const $TransactionSignature_Ed25519Signature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "Ed25519Signature";
    }];
};

declare const $TransactionSignature_MultiAgentSignature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "MultiAgentSignature";
    }];
};

declare const $TransactionSignature_MultiEd25519Signature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "MultiEd25519Signature";
    }];
};

declare const $U128: {
    readonly type: "string";
    readonly description: "A string containing a 128-bit unsigned integer.\n\n    We represent u128 values as a string to ensure compatibility with languages such\n    as JavaScript that do not parse u128s in JSON natively.\n    ";
    readonly format: "uint128";
};

declare const $U256: {
    readonly type: "string";
    readonly description: "A string containing a 256-bit unsigned integer.\n\n    We represent u256 values as a string to ensure compatibility with languages such\n    as JavaScript that do not parse u256s in JSON natively.\n    ";
    readonly format: "uint256";
};

declare const $U64: {
    readonly type: "string";
    readonly description: "A string containing a 64-bit unsigned integer.\n\n    We represent u64 values as a string to ensure compatibility with languages such\n    as JavaScript that do not parse u64s in JSON natively.\n    ";
    readonly format: "uint64";
};

declare const $UserTransaction: {
    readonly description: "A transaction submitted by a user to change the state of the blockchain";
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_change_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly event_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_checkpoint_hash: {
            readonly type: "HashValue";
        };
        readonly gas_used: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly success: {
            readonly type: "boolean";
            readonly description: "Whether the transaction was successful";
            readonly isRequired: true;
        };
        readonly vm_status: {
            readonly type: "string";
            readonly description: "The VM status of the transaction, can tell useful information in a failure";
            readonly isRequired: true;
        };
        readonly accumulator_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
            readonly isRequired: true;
        };
        readonly sender: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly max_gas_amount: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly gas_unit_price: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly expiration_timestamp_secs: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly payload: {
            readonly type: "TransactionPayload";
            readonly isRequired: true;
        };
        readonly signature: {
            readonly type: "TransactionSignature";
        };
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
        readonly timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};

declare const $VersionedEvent: {
    readonly description: "An event from a transaction with a version";
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly guid: {
            readonly type: "EventGuid";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly data: {
            readonly description: "The JSON representation of the event";
            readonly properties: {};
            readonly isRequired: true;
        };
    };
};

declare const $ViewRequest: {
    readonly description: "View request for the Move View Function API";
    readonly properties: {
        readonly function: {
            readonly type: "EntryFunctionId";
            readonly isRequired: true;
        };
        readonly type_arguments: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
        readonly arguments: {
            readonly type: "array";
            readonly contains: {
                readonly properties: {};
            };
            readonly isRequired: true;
        };
    };
};

declare const $WriteModule: {
    readonly description: "Write a new module or update an existing one";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly state_key_hash: {
            readonly type: "string";
            readonly description: "State key hash";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "MoveModuleBytecode";
            readonly isRequired: true;
        };
    };
};

declare const $WriteResource: {
    readonly description: "Write a resource or update an existing one";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly state_key_hash: {
            readonly type: "string";
            readonly description: "State key hash";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "MoveResource";
            readonly isRequired: true;
        };
    };
};

declare const $WriteSet: {
    readonly type: "one-of";
    readonly description: "The associated writeset with a payload";
    readonly contains: readonly [{
        readonly type: "WriteSet_ScriptWriteSet";
    }, {
        readonly type: "WriteSet_DirectWriteSet";
    }];
};

declare const $WriteSet_DirectWriteSet: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "DirectWriteSet";
    }];
};

declare const $WriteSet_ScriptWriteSet: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "ScriptWriteSet";
    }];
};

declare const $WriteSetChange: {
    readonly type: "one-of";
    readonly description: "A final state change of a transaction on a resource or module";
    readonly contains: readonly [{
        readonly type: "WriteSetChange_DeleteModule";
    }, {
        readonly type: "WriteSetChange_DeleteResource";
    }, {
        readonly type: "WriteSetChange_DeleteTableItem";
    }, {
        readonly type: "WriteSetChange_WriteModule";
    }, {
        readonly type: "WriteSetChange_WriteResource";
    }, {
        readonly type: "WriteSetChange_WriteTableItem";
    }];
};

declare const $WriteSetChange_DeleteModule: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "DeleteModule";
    }];
};

declare const $WriteSetChange_DeleteResource: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "DeleteResource";
    }];
};

declare const $WriteSetChange_DeleteTableItem: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "DeleteTableItem";
    }];
};

declare const $WriteSetChange_WriteModule: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "WriteModule";
    }];
};

declare const $WriteSetChange_WriteResource: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "WriteResource";
    }];
};

declare const $WriteSetChange_WriteTableItem: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "WriteTableItem";
    }];
};

declare const $WriteSetPayload: {
    readonly description: "A writeset payload, used only for genesis";
    readonly properties: {
        readonly write_set: {
            readonly type: "WriteSet";
            readonly isRequired: true;
        };
    };
};

declare const $WriteTableItem: {
    readonly description: "Change set to write a table item";
    readonly properties: {
        readonly state_key_hash: {
            readonly type: "string";
            readonly isRequired: true;
        };
        readonly handle: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly value: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "DecodedTableData";
        };
    };
};

type index$2_AptosGeneratedClient = AptosGeneratedClient;
declare const index$2_AptosGeneratedClient: typeof AptosGeneratedClient;
type index$2_BaseHttpRequest = BaseHttpRequest;
declare const index$2_BaseHttpRequest: typeof BaseHttpRequest;
type index$2_CancelablePromise<T> = CancelablePromise<T>;
declare const index$2_CancelablePromise: typeof CancelablePromise;
type index$2_CancelError = CancelError;
declare const index$2_CancelError: typeof CancelError;
declare const index$2_OpenAPI: typeof OpenAPI;
type index$2_OpenAPIConfig = OpenAPIConfig;
type index$2_AccountData = AccountData;
type index$2_AccountSignature = AccountSignature;
type index$2_AccountSignature_Ed25519Signature = AccountSignature_Ed25519Signature;
type index$2_AccountSignature_MultiEd25519Signature = AccountSignature_MultiEd25519Signature;
type index$2_Address = Address;
type index$2_AptosError = AptosError;
type index$2_AptosErrorCode = AptosErrorCode;
declare const index$2_AptosErrorCode: typeof AptosErrorCode;
type index$2_Block = Block;
type index$2_BlockMetadataTransaction = BlockMetadataTransaction;
type index$2_DecodedTableData = DecodedTableData;
type index$2_DeletedTableData = DeletedTableData;
type index$2_DeleteModule = DeleteModule;
type index$2_DeleteResource = DeleteResource;
type index$2_DeleteTableItem = DeleteTableItem;
type index$2_DirectWriteSet = DirectWriteSet;
type index$2_EncodeSubmissionRequest = EncodeSubmissionRequest;
type index$2_EntryFunctionId = EntryFunctionId;
type index$2_EntryFunctionPayload = EntryFunctionPayload;
type index$2_Event = Event;
type index$2_EventGuid = EventGuid;
type index$2_GasEstimation = GasEstimation;
type index$2_GenesisPayload = GenesisPayload;
type index$2_GenesisPayload_WriteSetPayload = GenesisPayload_WriteSetPayload;
type index$2_GenesisTransaction = GenesisTransaction;
type index$2_HashValue = HashValue;
type index$2_HealthCheckSuccess = HealthCheckSuccess;
type index$2_HexEncodedBytes = HexEncodedBytes;
type index$2_IdentifierWrapper = IdentifierWrapper;
type index$2_IndexResponse = IndexResponse;
type index$2_ModuleBundlePayload = ModuleBundlePayload;
type index$2_MoveAbility = MoveAbility;
type index$2_MoveFunction = MoveFunction;
type index$2_MoveFunctionGenericTypeParam = MoveFunctionGenericTypeParam;
type index$2_MoveFunctionVisibility = MoveFunctionVisibility;
declare const index$2_MoveFunctionVisibility: typeof MoveFunctionVisibility;
type index$2_MoveModule = MoveModule;
type index$2_MoveModuleBytecode = MoveModuleBytecode;
type index$2_MoveModuleId = MoveModuleId;
type index$2_MoveResource = MoveResource;
type index$2_MoveScriptBytecode = MoveScriptBytecode;
type index$2_MoveStruct = MoveStruct;
type index$2_MoveStructField = MoveStructField;
type index$2_MoveStructGenericTypeParam = MoveStructGenericTypeParam;
type index$2_MoveStructTag = MoveStructTag;
type index$2_MoveStructValue = MoveStructValue;
type index$2_MoveType = MoveType;
type index$2_MoveValue = MoveValue;
type index$2_MultiAgentSignature = MultiAgentSignature;
type index$2_PendingTransaction = PendingTransaction;
type index$2_RawTableItemRequest = RawTableItemRequest;
type index$2_RoleType = RoleType;
declare const index$2_RoleType: typeof RoleType;
type index$2_ScriptPayload = ScriptPayload;
type index$2_ScriptWriteSet = ScriptWriteSet;
type index$2_StateCheckpointTransaction = StateCheckpointTransaction;
type index$2_StateKeyWrapper = StateKeyWrapper;
type index$2_SubmitTransactionRequest = SubmitTransactionRequest;
type index$2_TableItemRequest = TableItemRequest;
type index$2_Transaction_BlockMetadataTransaction = Transaction_BlockMetadataTransaction;
type index$2_Transaction_GenesisTransaction = Transaction_GenesisTransaction;
type index$2_Transaction_PendingTransaction = Transaction_PendingTransaction;
type index$2_Transaction_StateCheckpointTransaction = Transaction_StateCheckpointTransaction;
type index$2_Transaction_UserTransaction = Transaction_UserTransaction;
type index$2_TransactionPayload_EntryFunctionPayload = TransactionPayload_EntryFunctionPayload;
type index$2_TransactionPayload_ModuleBundlePayload = TransactionPayload_ModuleBundlePayload;
type index$2_TransactionPayload_ScriptPayload = TransactionPayload_ScriptPayload;
type index$2_TransactionsBatchSingleSubmissionFailure = TransactionsBatchSingleSubmissionFailure;
type index$2_TransactionsBatchSubmissionResult = TransactionsBatchSubmissionResult;
type index$2_TransactionSignature = TransactionSignature;
type index$2_TransactionSignature_Ed25519Signature = TransactionSignature_Ed25519Signature;
type index$2_TransactionSignature_MultiAgentSignature = TransactionSignature_MultiAgentSignature;
type index$2_TransactionSignature_MultiEd25519Signature = TransactionSignature_MultiEd25519Signature;
type index$2_U128 = U128;
type index$2_U256 = U256;
type index$2_VersionedEvent = VersionedEvent;
type index$2_ViewRequest = ViewRequest;
type index$2_WriteModule = WriteModule;
type index$2_WriteResource = WriteResource;
type index$2_WriteSet_DirectWriteSet = WriteSet_DirectWriteSet;
type index$2_WriteSet_ScriptWriteSet = WriteSet_ScriptWriteSet;
type index$2_WriteSetChange = WriteSetChange;
type index$2_WriteSetChange_DeleteModule = WriteSetChange_DeleteModule;
type index$2_WriteSetChange_DeleteResource = WriteSetChange_DeleteResource;
type index$2_WriteSetChange_DeleteTableItem = WriteSetChange_DeleteTableItem;
type index$2_WriteSetChange_WriteModule = WriteSetChange_WriteModule;
type index$2_WriteSetChange_WriteResource = WriteSetChange_WriteResource;
type index$2_WriteSetChange_WriteTableItem = WriteSetChange_WriteTableItem;
type index$2_WriteSetPayload = WriteSetPayload;
type index$2_WriteTableItem = WriteTableItem;
declare const index$2_$AccountData: typeof $AccountData;
declare const index$2_$AccountSignature: typeof $AccountSignature;
declare const index$2_$AccountSignature_Ed25519Signature: typeof $AccountSignature_Ed25519Signature;
declare const index$2_$AccountSignature_MultiEd25519Signature: typeof $AccountSignature_MultiEd25519Signature;
declare const index$2_$Address: typeof $Address;
declare const index$2_$AptosError: typeof $AptosError;
declare const index$2_$AptosErrorCode: typeof $AptosErrorCode;
declare const index$2_$Block: typeof $Block;
declare const index$2_$BlockMetadataTransaction: typeof $BlockMetadataTransaction;
declare const index$2_$DecodedTableData: typeof $DecodedTableData;
declare const index$2_$DeletedTableData: typeof $DeletedTableData;
declare const index$2_$DeleteModule: typeof $DeleteModule;
declare const index$2_$DeleteResource: typeof $DeleteResource;
declare const index$2_$DeleteTableItem: typeof $DeleteTableItem;
declare const index$2_$DirectWriteSet: typeof $DirectWriteSet;
declare const index$2_$Ed25519Signature: typeof $Ed25519Signature;
declare const index$2_$EncodeSubmissionRequest: typeof $EncodeSubmissionRequest;
declare const index$2_$EntryFunctionId: typeof $EntryFunctionId;
declare const index$2_$EntryFunctionPayload: typeof $EntryFunctionPayload;
declare const index$2_$Event: typeof $Event;
declare const index$2_$EventGuid: typeof $EventGuid;
declare const index$2_$GasEstimation: typeof $GasEstimation;
declare const index$2_$GenesisPayload: typeof $GenesisPayload;
declare const index$2_$GenesisPayload_WriteSetPayload: typeof $GenesisPayload_WriteSetPayload;
declare const index$2_$GenesisTransaction: typeof $GenesisTransaction;
declare const index$2_$HashValue: typeof $HashValue;
declare const index$2_$HealthCheckSuccess: typeof $HealthCheckSuccess;
declare const index$2_$HexEncodedBytes: typeof $HexEncodedBytes;
declare const index$2_$IdentifierWrapper: typeof $IdentifierWrapper;
declare const index$2_$IndexResponse: typeof $IndexResponse;
declare const index$2_$ModuleBundlePayload: typeof $ModuleBundlePayload;
declare const index$2_$MoveAbility: typeof $MoveAbility;
declare const index$2_$MoveFunction: typeof $MoveFunction;
declare const index$2_$MoveFunctionGenericTypeParam: typeof $MoveFunctionGenericTypeParam;
declare const index$2_$MoveFunctionVisibility: typeof $MoveFunctionVisibility;
declare const index$2_$MoveModule: typeof $MoveModule;
declare const index$2_$MoveModuleBytecode: typeof $MoveModuleBytecode;
declare const index$2_$MoveModuleId: typeof $MoveModuleId;
declare const index$2_$MoveResource: typeof $MoveResource;
declare const index$2_$MoveScriptBytecode: typeof $MoveScriptBytecode;
declare const index$2_$MoveStruct: typeof $MoveStruct;
declare const index$2_$MoveStructField: typeof $MoveStructField;
declare const index$2_$MoveStructGenericTypeParam: typeof $MoveStructGenericTypeParam;
declare const index$2_$MoveStructTag: typeof $MoveStructTag;
declare const index$2_$MoveStructValue: typeof $MoveStructValue;
declare const index$2_$MoveType: typeof $MoveType;
declare const index$2_$MoveValue: typeof $MoveValue;
declare const index$2_$MultiAgentSignature: typeof $MultiAgentSignature;
declare const index$2_$MultiEd25519Signature: typeof $MultiEd25519Signature;
declare const index$2_$PendingTransaction: typeof $PendingTransaction;
declare const index$2_$RawTableItemRequest: typeof $RawTableItemRequest;
declare const index$2_$RoleType: typeof $RoleType;
declare const index$2_$ScriptPayload: typeof $ScriptPayload;
declare const index$2_$ScriptWriteSet: typeof $ScriptWriteSet;
declare const index$2_$StateCheckpointTransaction: typeof $StateCheckpointTransaction;
declare const index$2_$StateKeyWrapper: typeof $StateKeyWrapper;
declare const index$2_$SubmitTransactionRequest: typeof $SubmitTransactionRequest;
declare const index$2_$TableItemRequest: typeof $TableItemRequest;
declare const index$2_$Transaction: typeof $Transaction;
declare const index$2_$Transaction_BlockMetadataTransaction: typeof $Transaction_BlockMetadataTransaction;
declare const index$2_$Transaction_GenesisTransaction: typeof $Transaction_GenesisTransaction;
declare const index$2_$Transaction_PendingTransaction: typeof $Transaction_PendingTransaction;
declare const index$2_$Transaction_StateCheckpointTransaction: typeof $Transaction_StateCheckpointTransaction;
declare const index$2_$Transaction_UserTransaction: typeof $Transaction_UserTransaction;
declare const index$2_$TransactionPayload: typeof $TransactionPayload;
declare const index$2_$TransactionPayload_EntryFunctionPayload: typeof $TransactionPayload_EntryFunctionPayload;
declare const index$2_$TransactionPayload_ModuleBundlePayload: typeof $TransactionPayload_ModuleBundlePayload;
declare const index$2_$TransactionPayload_ScriptPayload: typeof $TransactionPayload_ScriptPayload;
declare const index$2_$TransactionsBatchSingleSubmissionFailure: typeof $TransactionsBatchSingleSubmissionFailure;
declare const index$2_$TransactionsBatchSubmissionResult: typeof $TransactionsBatchSubmissionResult;
declare const index$2_$TransactionSignature: typeof $TransactionSignature;
declare const index$2_$TransactionSignature_Ed25519Signature: typeof $TransactionSignature_Ed25519Signature;
declare const index$2_$TransactionSignature_MultiAgentSignature: typeof $TransactionSignature_MultiAgentSignature;
declare const index$2_$TransactionSignature_MultiEd25519Signature: typeof $TransactionSignature_MultiEd25519Signature;
declare const index$2_$U128: typeof $U128;
declare const index$2_$U256: typeof $U256;
declare const index$2_$U64: typeof $U64;
declare const index$2_$UserTransaction: typeof $UserTransaction;
declare const index$2_$VersionedEvent: typeof $VersionedEvent;
declare const index$2_$ViewRequest: typeof $ViewRequest;
declare const index$2_$WriteModule: typeof $WriteModule;
declare const index$2_$WriteResource: typeof $WriteResource;
declare const index$2_$WriteSet: typeof $WriteSet;
declare const index$2_$WriteSet_DirectWriteSet: typeof $WriteSet_DirectWriteSet;
declare const index$2_$WriteSet_ScriptWriteSet: typeof $WriteSet_ScriptWriteSet;
declare const index$2_$WriteSetChange: typeof $WriteSetChange;
declare const index$2_$WriteSetChange_DeleteModule: typeof $WriteSetChange_DeleteModule;
declare const index$2_$WriteSetChange_DeleteResource: typeof $WriteSetChange_DeleteResource;
declare const index$2_$WriteSetChange_DeleteTableItem: typeof $WriteSetChange_DeleteTableItem;
declare const index$2_$WriteSetChange_WriteModule: typeof $WriteSetChange_WriteModule;
declare const index$2_$WriteSetChange_WriteResource: typeof $WriteSetChange_WriteResource;
declare const index$2_$WriteSetChange_WriteTableItem: typeof $WriteSetChange_WriteTableItem;
declare const index$2_$WriteSetPayload: typeof $WriteSetPayload;
declare const index$2_$WriteTableItem: typeof $WriteTableItem;
type index$2_AccountsService = AccountsService;
declare const index$2_AccountsService: typeof AccountsService;
type index$2_BlocksService = BlocksService;
declare const index$2_BlocksService: typeof BlocksService;
type index$2_EventsService = EventsService;
declare const index$2_EventsService: typeof EventsService;
type index$2_GeneralService = GeneralService;
declare const index$2_GeneralService: typeof GeneralService;
type index$2_TablesService = TablesService;
declare const index$2_TablesService: typeof TablesService;
type index$2_TransactionsService = TransactionsService;
declare const index$2_TransactionsService: typeof TransactionsService;
type index$2_ViewService = ViewService;
declare const index$2_ViewService: typeof ViewService;
declare namespace index$2 {
  export {
    index$2_AptosGeneratedClient as AptosGeneratedClient,
    ApiError$1 as ApiError,
    index$2_BaseHttpRequest as BaseHttpRequest,
    index$2_CancelablePromise as CancelablePromise,
    index$2_CancelError as CancelError,
    index$2_OpenAPI as OpenAPI,
    index$2_OpenAPIConfig as OpenAPIConfig,
    index$2_AccountData as AccountData,
    index$2_AccountSignature as AccountSignature,
    index$2_AccountSignature_Ed25519Signature as AccountSignature_Ed25519Signature,
    index$2_AccountSignature_MultiEd25519Signature as AccountSignature_MultiEd25519Signature,
    index$2_Address as Address,
    index$2_AptosError as AptosError,
    index$2_AptosErrorCode as AptosErrorCode,
    index$2_Block as Block,
    index$2_BlockMetadataTransaction as BlockMetadataTransaction,
    index$2_DecodedTableData as DecodedTableData,
    index$2_DeletedTableData as DeletedTableData,
    index$2_DeleteModule as DeleteModule,
    index$2_DeleteResource as DeleteResource,
    index$2_DeleteTableItem as DeleteTableItem,
    index$2_DirectWriteSet as DirectWriteSet,
    Ed25519Signature$1 as Ed25519Signature,
    index$2_EncodeSubmissionRequest as EncodeSubmissionRequest,
    index$2_EntryFunctionId as EntryFunctionId,
    index$2_EntryFunctionPayload as EntryFunctionPayload,
    index$2_Event as Event,
    index$2_EventGuid as EventGuid,
    index$2_GasEstimation as GasEstimation,
    index$2_GenesisPayload as GenesisPayload,
    index$2_GenesisPayload_WriteSetPayload as GenesisPayload_WriteSetPayload,
    index$2_GenesisTransaction as GenesisTransaction,
    index$2_HashValue as HashValue,
    index$2_HealthCheckSuccess as HealthCheckSuccess,
    index$2_HexEncodedBytes as HexEncodedBytes,
    index$2_IdentifierWrapper as IdentifierWrapper,
    index$2_IndexResponse as IndexResponse,
    index$2_ModuleBundlePayload as ModuleBundlePayload,
    index$2_MoveAbility as MoveAbility,
    index$2_MoveFunction as MoveFunction,
    index$2_MoveFunctionGenericTypeParam as MoveFunctionGenericTypeParam,
    index$2_MoveFunctionVisibility as MoveFunctionVisibility,
    index$2_MoveModule as MoveModule,
    index$2_MoveModuleBytecode as MoveModuleBytecode,
    index$2_MoveModuleId as MoveModuleId,
    index$2_MoveResource as MoveResource,
    index$2_MoveScriptBytecode as MoveScriptBytecode,
    index$2_MoveStruct as MoveStruct,
    index$2_MoveStructField as MoveStructField,
    index$2_MoveStructGenericTypeParam as MoveStructGenericTypeParam,
    index$2_MoveStructTag as MoveStructTag,
    index$2_MoveStructValue as MoveStructValue,
    index$2_MoveType as MoveType,
    index$2_MoveValue as MoveValue,
    index$2_MultiAgentSignature as MultiAgentSignature,
    MultiEd25519Signature$1 as MultiEd25519Signature,
    index$2_PendingTransaction as PendingTransaction,
    index$2_RawTableItemRequest as RawTableItemRequest,
    index$2_RoleType as RoleType,
    index$2_ScriptPayload as ScriptPayload,
    index$2_ScriptWriteSet as ScriptWriteSet,
    index$2_StateCheckpointTransaction as StateCheckpointTransaction,
    index$2_StateKeyWrapper as StateKeyWrapper,
    index$2_SubmitTransactionRequest as SubmitTransactionRequest,
    index$2_TableItemRequest as TableItemRequest,
    Transaction$1 as Transaction,
    index$2_Transaction_BlockMetadataTransaction as Transaction_BlockMetadataTransaction,
    index$2_Transaction_GenesisTransaction as Transaction_GenesisTransaction,
    index$2_Transaction_PendingTransaction as Transaction_PendingTransaction,
    index$2_Transaction_StateCheckpointTransaction as Transaction_StateCheckpointTransaction,
    index$2_Transaction_UserTransaction as Transaction_UserTransaction,
    TransactionPayload$1 as TransactionPayload,
    index$2_TransactionPayload_EntryFunctionPayload as TransactionPayload_EntryFunctionPayload,
    index$2_TransactionPayload_ModuleBundlePayload as TransactionPayload_ModuleBundlePayload,
    index$2_TransactionPayload_ScriptPayload as TransactionPayload_ScriptPayload,
    index$2_TransactionsBatchSingleSubmissionFailure as TransactionsBatchSingleSubmissionFailure,
    index$2_TransactionsBatchSubmissionResult as TransactionsBatchSubmissionResult,
    index$2_TransactionSignature as TransactionSignature,
    index$2_TransactionSignature_Ed25519Signature as TransactionSignature_Ed25519Signature,
    index$2_TransactionSignature_MultiAgentSignature as TransactionSignature_MultiAgentSignature,
    index$2_TransactionSignature_MultiEd25519Signature as TransactionSignature_MultiEd25519Signature,
    index$2_U128 as U128,
    index$2_U256 as U256,
    U64$1 as U64,
    UserTransaction$1 as UserTransaction,
    index$2_VersionedEvent as VersionedEvent,
    index$2_ViewRequest as ViewRequest,
    index$2_WriteModule as WriteModule,
    index$2_WriteResource as WriteResource,
    WriteSet$1 as WriteSet,
    index$2_WriteSet_DirectWriteSet as WriteSet_DirectWriteSet,
    index$2_WriteSet_ScriptWriteSet as WriteSet_ScriptWriteSet,
    index$2_WriteSetChange as WriteSetChange,
    index$2_WriteSetChange_DeleteModule as WriteSetChange_DeleteModule,
    index$2_WriteSetChange_DeleteResource as WriteSetChange_DeleteResource,
    index$2_WriteSetChange_DeleteTableItem as WriteSetChange_DeleteTableItem,
    index$2_WriteSetChange_WriteModule as WriteSetChange_WriteModule,
    index$2_WriteSetChange_WriteResource as WriteSetChange_WriteResource,
    index$2_WriteSetChange_WriteTableItem as WriteSetChange_WriteTableItem,
    index$2_WriteSetPayload as WriteSetPayload,
    index$2_WriteTableItem as WriteTableItem,
    index$2_$AccountData as $AccountData,
    index$2_$AccountSignature as $AccountSignature,
    index$2_$AccountSignature_Ed25519Signature as $AccountSignature_Ed25519Signature,
    index$2_$AccountSignature_MultiEd25519Signature as $AccountSignature_MultiEd25519Signature,
    index$2_$Address as $Address,
    index$2_$AptosError as $AptosError,
    index$2_$AptosErrorCode as $AptosErrorCode,
    index$2_$Block as $Block,
    index$2_$BlockMetadataTransaction as $BlockMetadataTransaction,
    index$2_$DecodedTableData as $DecodedTableData,
    index$2_$DeletedTableData as $DeletedTableData,
    index$2_$DeleteModule as $DeleteModule,
    index$2_$DeleteResource as $DeleteResource,
    index$2_$DeleteTableItem as $DeleteTableItem,
    index$2_$DirectWriteSet as $DirectWriteSet,
    index$2_$Ed25519Signature as $Ed25519Signature,
    index$2_$EncodeSubmissionRequest as $EncodeSubmissionRequest,
    index$2_$EntryFunctionId as $EntryFunctionId,
    index$2_$EntryFunctionPayload as $EntryFunctionPayload,
    index$2_$Event as $Event,
    index$2_$EventGuid as $EventGuid,
    index$2_$GasEstimation as $GasEstimation,
    index$2_$GenesisPayload as $GenesisPayload,
    index$2_$GenesisPayload_WriteSetPayload as $GenesisPayload_WriteSetPayload,
    index$2_$GenesisTransaction as $GenesisTransaction,
    index$2_$HashValue as $HashValue,
    index$2_$HealthCheckSuccess as $HealthCheckSuccess,
    index$2_$HexEncodedBytes as $HexEncodedBytes,
    index$2_$IdentifierWrapper as $IdentifierWrapper,
    index$2_$IndexResponse as $IndexResponse,
    index$2_$ModuleBundlePayload as $ModuleBundlePayload,
    index$2_$MoveAbility as $MoveAbility,
    index$2_$MoveFunction as $MoveFunction,
    index$2_$MoveFunctionGenericTypeParam as $MoveFunctionGenericTypeParam,
    index$2_$MoveFunctionVisibility as $MoveFunctionVisibility,
    index$2_$MoveModule as $MoveModule,
    index$2_$MoveModuleBytecode as $MoveModuleBytecode,
    index$2_$MoveModuleId as $MoveModuleId,
    index$2_$MoveResource as $MoveResource,
    index$2_$MoveScriptBytecode as $MoveScriptBytecode,
    index$2_$MoveStruct as $MoveStruct,
    index$2_$MoveStructField as $MoveStructField,
    index$2_$MoveStructGenericTypeParam as $MoveStructGenericTypeParam,
    index$2_$MoveStructTag as $MoveStructTag,
    index$2_$MoveStructValue as $MoveStructValue,
    index$2_$MoveType as $MoveType,
    index$2_$MoveValue as $MoveValue,
    index$2_$MultiAgentSignature as $MultiAgentSignature,
    index$2_$MultiEd25519Signature as $MultiEd25519Signature,
    index$2_$PendingTransaction as $PendingTransaction,
    index$2_$RawTableItemRequest as $RawTableItemRequest,
    index$2_$RoleType as $RoleType,
    index$2_$ScriptPayload as $ScriptPayload,
    index$2_$ScriptWriteSet as $ScriptWriteSet,
    index$2_$StateCheckpointTransaction as $StateCheckpointTransaction,
    index$2_$StateKeyWrapper as $StateKeyWrapper,
    index$2_$SubmitTransactionRequest as $SubmitTransactionRequest,
    index$2_$TableItemRequest as $TableItemRequest,
    index$2_$Transaction as $Transaction,
    index$2_$Transaction_BlockMetadataTransaction as $Transaction_BlockMetadataTransaction,
    index$2_$Transaction_GenesisTransaction as $Transaction_GenesisTransaction,
    index$2_$Transaction_PendingTransaction as $Transaction_PendingTransaction,
    index$2_$Transaction_StateCheckpointTransaction as $Transaction_StateCheckpointTransaction,
    index$2_$Transaction_UserTransaction as $Transaction_UserTransaction,
    index$2_$TransactionPayload as $TransactionPayload,
    index$2_$TransactionPayload_EntryFunctionPayload as $TransactionPayload_EntryFunctionPayload,
    index$2_$TransactionPayload_ModuleBundlePayload as $TransactionPayload_ModuleBundlePayload,
    index$2_$TransactionPayload_ScriptPayload as $TransactionPayload_ScriptPayload,
    index$2_$TransactionsBatchSingleSubmissionFailure as $TransactionsBatchSingleSubmissionFailure,
    index$2_$TransactionsBatchSubmissionResult as $TransactionsBatchSubmissionResult,
    index$2_$TransactionSignature as $TransactionSignature,
    index$2_$TransactionSignature_Ed25519Signature as $TransactionSignature_Ed25519Signature,
    index$2_$TransactionSignature_MultiAgentSignature as $TransactionSignature_MultiAgentSignature,
    index$2_$TransactionSignature_MultiEd25519Signature as $TransactionSignature_MultiEd25519Signature,
    index$2_$U128 as $U128,
    index$2_$U256 as $U256,
    index$2_$U64 as $U64,
    index$2_$UserTransaction as $UserTransaction,
    index$2_$VersionedEvent as $VersionedEvent,
    index$2_$ViewRequest as $ViewRequest,
    index$2_$WriteModule as $WriteModule,
    index$2_$WriteResource as $WriteResource,
    index$2_$WriteSet as $WriteSet,
    index$2_$WriteSet_DirectWriteSet as $WriteSet_DirectWriteSet,
    index$2_$WriteSet_ScriptWriteSet as $WriteSet_ScriptWriteSet,
    index$2_$WriteSetChange as $WriteSetChange,
    index$2_$WriteSetChange_DeleteModule as $WriteSetChange_DeleteModule,
    index$2_$WriteSetChange_DeleteResource as $WriteSetChange_DeleteResource,
    index$2_$WriteSetChange_DeleteTableItem as $WriteSetChange_DeleteTableItem,
    index$2_$WriteSetChange_WriteModule as $WriteSetChange_WriteModule,
    index$2_$WriteSetChange_WriteResource as $WriteSetChange_WriteResource,
    index$2_$WriteSetChange_WriteTableItem as $WriteSetChange_WriteTableItem,
    index$2_$WriteSetPayload as $WriteSetPayload,
    index$2_$WriteTableItem as $WriteTableItem,
    index$2_AccountsService as AccountsService,
    index$2_BlocksService as BlocksService,
    index$2_EventsService as EventsService,
    index$2_GeneralService as GeneralService,
    index$2_TablesService as TablesService,
    index$2_TransactionsService as TransactionsService,
    index$2_ViewService as ViewService,
  };
}

declare type MaybeHexString = HexString | string | HexEncodedBytes;
/**
 * A util class for working with hex strings.
 * Hex strings are strings that are prefixed with `0x`
 */
declare class HexString {
    private readonly hexString;
    /**
     * Creates new hex string from Buffer
     * @param buffer A buffer to convert
     * @returns New HexString
     */
    static fromBuffer(buffer: Uint8Array): HexString;
    /**
     * Creates new hex string from Uint8Array
     * @param arr Uint8Array to convert
     * @returns New HexString
     */
    static fromUint8Array(arr: Uint8Array): HexString;
    /**
     * Ensures `hexString` is instance of `HexString` class
     * @param hexString String to check
     * @returns New HexString if `hexString` is regular string or `hexString` if it is HexString instance
     * @example
     * ```
     *  const regularString = "string";
     *  const hexString = new HexString("string"); // "0xstring"
     *  HexString.ensure(regularString); // "0xstring"
     *  HexString.ensure(hexString); // "0xstring"
     * ```
     */
    static ensure(hexString: MaybeHexString): HexString;
    /**
     * Creates new HexString instance from regular string. If specified string already starts with "0x" prefix,
     * it will not add another one
     * @param hexString String to convert
     * @example
     * ```
     *  const string = "string";
     *  new HexString(string); // "0xstring"
     * ```
     */
    constructor(hexString: string | HexEncodedBytes);
    /**
     * Getter for inner hexString
     * @returns Inner hex string
     */
    hex(): string;
    /**
     * Getter for inner hexString without prefix
     * @returns Inner hex string without prefix
     * @example
     * ```
     *  const hexString = new HexString("string"); // "0xstring"
     *  hexString.noPrefix(); // "string"
     * ```
     */
    noPrefix(): string;
    /**
     * Overrides default `toString` method
     * @returns Inner hex string
     */
    toString(): string;
    /**
     * Trimmes extra zeroes in the begining of a string
     * @returns Inner hexString without leading zeroes
     * @example
     * ```
     *  new HexString("0x000000string").toShortString(); // result = "0xstring"
     * ```
     */
    toShortString(): string;
    /**
     * Converts hex string to a Uint8Array
     * @returns Uint8Array from inner hexString without prefix
     */
    toUint8Array(): Uint8Array;
}

interface AptosAccountObject {
    address?: HexEncodedBytes;
    publicKeyHex?: HexEncodedBytes;
    privateKeyHex: HexEncodedBytes;
}
/**
 * Class for creating and managing Aptos account
 */
declare class AptosAccount {
    /**
     * A private key and public key, associated with the given account
     */
    readonly signingKey: nacl.SignKeyPair;
    /**
     * Address associated with the given account
     */
    private readonly accountAddress;
    static fromAptosAccountObject(obj: AptosAccountObject): AptosAccount;
    /**
     * Test derive path
     */
    static isValidPath: (path: string) => boolean;
    /**
     * Creates new account with bip44 path and mnemonics,
     * @param path. (e.g. m/44'/637'/0'/0'/0')
     * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
     * @param mnemonics.
     * @returns AptosAccount
     */
    static fromDerivePath(path: string, mnemonics: string): AptosAccount;
    /**
     * Creates new account instance. Constructor allows passing in an address,
     * to handle account key rotation, where auth_key != public_key
     * @param privateKeyBytes  Private key from which account key pair will be generated.
     * If not specified, new key pair is going to be created.
     * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
     * If not specified, a new one will be generated from public key
     */
    constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString);
    /**
     * This is the key by which Aptos account is referenced.
     * It is the 32-byte of the SHA-3 256 cryptographic hash
     * of the public key(s) concatenated with a signature scheme identifier byte
     * @returns Address associated with the given account
     */
    address(): HexString;
    /**
     * This key enables account owners to rotate their private key(s)
     * associated with the account without changing the address that hosts their account.
     * See here for more info: {@link https://aptos.dev/concepts/accounts#single-signer-authentication}
     * @returns Authentication key for the associated account
     */
    authKey(): HexString;
    /**
     * Takes source address and seeds and returns the resource account address
     * @param sourceAddress Address used to derive the resource account
     * @param seed The seed bytes
     * @returns The resource account address
     */
    static getResourceAccountAddress(sourceAddress: MaybeHexString, seed: Uint8Array): HexString;
    /**
     * This key is generated with Ed25519 scheme.
     * Public key is used to check a signature of transaction, signed by given account
     * @returns The public key for the associated account
     */
    pubKey(): HexString;
    /**
     * Signs specified `buffer` with account's private key
     * @param buffer A buffer to sign
     * @returns A signature HexString
     */
    signBuffer(buffer: Uint8Array): HexString;
    /**
     * Signs specified `hexString` with account's private key
     * @param hexString A regular string or HexString to sign
     * @returns A signature HexString
     */
    signHexString(hexString: MaybeHexString): HexString;
    /**
     * Derives account address, public key and private key
     * @returns AptosAccountObject instance.
     * @example An example of the returned AptosAccountObject object
     * ```
     * {
     *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
     *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
     *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
     *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
     * }
     * ```
     */
    toPrivateKeyObject(): AptosAccountObject;
}
declare function getAddressFromAccountOrAddress(accountOrAddress: AptosAccount | MaybeHexString): HexString;

declare type Seq<T> = T[];
declare type Uint8 = number;
declare type Uint16 = number;
declare type Uint32 = number;
declare type Uint64 = bigint;
declare type Uint128 = bigint;
declare type Uint256 = bigint;
declare type AnyNumber = bigint | number;
declare type Bytes = Uint8Array;

declare class Serializer {
    private buffer;
    private offset;
    constructor();
    private ensureBufferWillHandleSize;
    protected serialize(values: Bytes): void;
    private serializeWithFunction;
    /**
     * Serializes a string. UTF8 string is supported. Serializes the string's bytes length "l" first,
     * and then serializes "l" bytes of the string content.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeStr("çå∞≠¢õß∂ƒ∫");
     * assert(serializer.getBytes() === new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * ```
     */
    serializeStr(value: string): void;
    /**
     * Serializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    serializeBytes(value: Bytes): void;
    /**
     * Serializes an array of bytes with known length. Therefore length doesn't need to be
     * serialized to help deserialization.  When deserializing, the number of
     * bytes to deserialize needs to be passed in.
     */
    serializeFixedBytes(value: Bytes): void;
    /**
     * Serializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    serializeBool(value: boolean): void;
    /**
     * Serializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    serializeU8(value: Uint8): void;
    /**
     * Serializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU16(4660);
     * assert(serializer.getBytes() === new Uint8Array([0x34, 0x12]));
     * ```
     */
    serializeU16(value: Uint16): void;
    /**
     * Serializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU32(305419896);
     * assert(serializer.getBytes() === new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU32(value: Uint32): void;
    /**
     * Serializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU64(1311768467750121216);
     * assert(serializer.getBytes() === new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU64(value: AnyNumber): void;
    /**
     * Serializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU128(value: AnyNumber): void;
    /**
     * Serializes a uint256 number.
     *
     * BCS layout for "uint256": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU256(value: AnyNumber): void;
    /**
     * Serializes a uint32 number with uleb128.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    serializeU32AsUleb128(val: Uint32): void;
    /**
     * Returns the buffered bytes
     */
    getBytes(): Bytes;
}

declare class Deserializer {
    private buffer;
    private offset;
    constructor(data: Bytes);
    private read;
    /**
     * Deserializes a string. UTF8 string is supported. Reads the string's bytes length "l" first,
     * and then reads "l" bytes of content. Decodes the byte array into a string.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * assert(deserializer.deserializeStr() === "çå∞≠¢õß∂ƒ∫");
     * ```
     */
    deserializeStr(): string;
    /**
     * Deserializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    deserializeBytes(): Bytes;
    /**
     * Deserializes an array of bytes. The number of bytes to read is already known.
     *
     */
    deserializeFixedBytes(len: number): Bytes;
    /**
     * Deserializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    deserializeBool(): boolean;
    /**
     * Deserializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    deserializeU8(): Uint8;
    /**
     * Deserializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x34, 0x12]));
     * assert(deserializer.deserializeU16() === 4660);
     * ```
     */
    deserializeU16(): Uint16;
    /**
     * Deserializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU32() === 305419896);
     * ```
     */
    deserializeU32(): Uint32;
    /**
     * Deserializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU64() === 1311768467750121216);
     * ```
     */
    deserializeU64(): Uint64;
    /**
     * Deserializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    deserializeU128(): Uint128;
    /**
     * Deserializes a uint256 number.
     *
     * BCS layout for "uint256": Thirty-two bytes. Binary format in little-endian representation.
     */
    deserializeU256(): Uint256;
    /**
     * Deserializes a uleb128 encoded uint32 number.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    deserializeUleb128AsU32(): Uint32;
}

interface Serializable {
    serialize(serializer: Serializer): void;
}
/**
 * Serializes a vector values that are "Serializable".
 */
declare function serializeVector<T extends Serializable>(value: Seq<T>, serializer: Serializer): void;
/**
 * Serializes a vector with specified item serialization function.
 * Very dynamic function and bypasses static typechecking.
 */
declare function serializeVectorWithFunc(value: any[], func: string): Bytes;
/**
 * Deserializes a vector of values.
 */
declare function deserializeVector(deserializer: Deserializer, cls: any): any[];
declare function bcsToBytes<T extends Serializable>(value: T): Bytes;
declare function bcsSerializeUint64(value: AnyNumber): Bytes;
declare function bcsSerializeU8(value: Uint8): Bytes;
declare function bcsSerializeU16(value: Uint16): Bytes;
declare function bcsSerializeU32(value: Uint32): Bytes;
declare function bcsSerializeU128(value: AnyNumber): Bytes;
declare function bcsSerializeBool(value: boolean): Bytes;
declare function bcsSerializeStr(value: string): Bytes;
declare function bcsSerializeBytes(value: Bytes): Bytes;
declare function bcsSerializeFixedBytes(value: Bytes): Bytes;

type index$1_Seq<T> = Seq<T>;
type index$1_Uint8 = Uint8;
type index$1_Uint16 = Uint16;
type index$1_Uint32 = Uint32;
type index$1_Uint64 = Uint64;
type index$1_Uint128 = Uint128;
type index$1_Uint256 = Uint256;
type index$1_AnyNumber = AnyNumber;
type index$1_Bytes = Bytes;
type index$1_Serializer = Serializer;
declare const index$1_Serializer: typeof Serializer;
type index$1_Deserializer = Deserializer;
declare const index$1_Deserializer: typeof Deserializer;
declare const index$1_serializeVector: typeof serializeVector;
declare const index$1_serializeVectorWithFunc: typeof serializeVectorWithFunc;
declare const index$1_deserializeVector: typeof deserializeVector;
declare const index$1_bcsToBytes: typeof bcsToBytes;
declare const index$1_bcsSerializeUint64: typeof bcsSerializeUint64;
declare const index$1_bcsSerializeU8: typeof bcsSerializeU8;
declare const index$1_bcsSerializeU16: typeof bcsSerializeU16;
declare const index$1_bcsSerializeU32: typeof bcsSerializeU32;
declare const index$1_bcsSerializeU128: typeof bcsSerializeU128;
declare const index$1_bcsSerializeBool: typeof bcsSerializeBool;
declare const index$1_bcsSerializeStr: typeof bcsSerializeStr;
declare const index$1_bcsSerializeBytes: typeof bcsSerializeBytes;
declare const index$1_bcsSerializeFixedBytes: typeof bcsSerializeFixedBytes;
declare namespace index$1 {
  export {
    index$1_Seq as Seq,
    index$1_Uint8 as Uint8,
    index$1_Uint16 as Uint16,
    index$1_Uint32 as Uint32,
    index$1_Uint64 as Uint64,
    index$1_Uint128 as Uint128,
    index$1_Uint256 as Uint256,
    index$1_AnyNumber as AnyNumber,
    index$1_Bytes as Bytes,
    index$1_Serializer as Serializer,
    index$1_Deserializer as Deserializer,
    index$1_serializeVector as serializeVector,
    index$1_serializeVectorWithFunc as serializeVectorWithFunc,
    index$1_deserializeVector as deserializeVector,
    index$1_bcsToBytes as bcsToBytes,
    index$1_bcsSerializeUint64 as bcsSerializeUint64,
    index$1_bcsSerializeU8 as bcsSerializeU8,
    index$1_bcsSerializeU16 as bcsSerializeU16,
    index$1_bcsSerializeU32 as bcsSerializeU32,
    index$1_bcsSerializeU128 as bcsSerializeU128,
    index$1_bcsSerializeBool as bcsSerializeBool,
    index$1_bcsSerializeStr as bcsSerializeStr,
    index$1_bcsSerializeBytes as bcsSerializeBytes,
    index$1_bcsSerializeFixedBytes as bcsSerializeFixedBytes,
  };
}

declare class AccountAddress {
    static readonly LENGTH: number;
    readonly address: Bytes;
    static CORE_CODE_ADDRESS: AccountAddress;
    constructor(address: Bytes);
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr: MaybeHexString): AccountAddress;
    /**
     * Checks if the string is a valid AccountAddress
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static isValid(addr: MaybeHexString): boolean;
    /**
     * Return a hex string from account Address.
     */
    toHexString(): MaybeHexString;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAddress;
}

declare class Ed25519PublicKey {
    static readonly LENGTH: number;
    readonly value: Bytes;
    constructor(value: Bytes);
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519PublicKey;
}
declare class Ed25519Signature {
    readonly value: Bytes;
    static readonly LENGTH = 64;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519Signature;
}

declare class MultiEd25519PublicKey {
    readonly public_keys: Seq<Ed25519PublicKey>;
    readonly threshold: Uint8;
    /**
     * Public key for a K-of-N multisig transaction. A K-of-N multisig transaction means that for such a
     * transaction to be executed, at least K out of the N authorized signers have signed the transaction
     * and passed the check conducted by the chain.
     *
     * @see {@link
     * https://aptos.dev/guides/creating-a-signed-transaction#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param public_keys A list of public keys
     * @param threshold At least "threshold" signatures must be valid
     */
    constructor(public_keys: Seq<Ed25519PublicKey>, threshold: Uint8);
    /**
     * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519PublicKey;
}
declare class MultiEd25519Signature {
    readonly signatures: Seq<Ed25519Signature>;
    readonly bitmap: Uint8Array;
    static BITMAP_LEN: Uint8;
    /**
     * Signature for a K-of-N multisig transaction.
     *
     * @see {@link
     * https://aptos.dev/guides/creating-a-signed-transaction#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param signatures A list of ed25519 signatures
     * @param bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
     * signature should be provided in `signatures`. Bits are read from left to right
     */
    constructor(signatures: Seq<Ed25519Signature>, bitmap: Uint8Array);
    /**
     * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    toBytes(): Bytes;
    /**
     * Helper method to create a bitmap out of the specified bit positions
     * @param bits The bitmap positions that should be set. A position starts at index 0.
     * Valid position should range between 0 and 31.
     * @example
     * Here's an example of valid `bits`
     * ```
     * [0, 2, 31]
     * ```
     * `[0, 2, 31]` means the 1st, 3rd and 32nd bits should be set in the bitmap.
     * The result bitmap should be 0b1010000000000000000000000000001
     *
     * @returns bitmap that is 32bit long
     */
    static createBitmap(bits: Seq<Uint8>): Uint8Array;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519Signature;
}

declare abstract class TransactionAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionAuthenticator;
}
declare class TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    /**
     * An authenticator for single signature.
     *
     * @param public_key Client's public key.
     * @param signature Signature of a raw transaction.
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     * for details about generating a signature.
     */
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorEd25519;
}
declare class TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    /**
     * An authenticator for multiple signatures.
     *
     * @param public_key
     * @param signature
     *
     */
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiEd25519;
}
declare class TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly secondary_signers: Seq<AccountAuthenticator>;
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Seq<AccountAddress>, secondary_signers: Seq<AccountAuthenticator>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
declare abstract class AccountAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAuthenticator;
}
declare class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorEd25519;
}
declare class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorMultiEd25519;
}

declare class Identifier {
    value: string;
    constructor(value: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Identifier;
}

declare abstract class TypeTag {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeTag;
}
declare class TypeTagBool extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagBool;
}
declare class TypeTagU8 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU8;
}
declare class TypeTagU16 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU16;
}
declare class TypeTagU32 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU32;
}
declare class TypeTagU64 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU64;
}
declare class TypeTagU128 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU128;
}
declare class TypeTagU256 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU256;
}
declare class TypeTagAddress extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagAddress;
}
declare class TypeTagSigner extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagSigner;
}
declare class TypeTagVector extends TypeTag {
    readonly value: TypeTag;
    constructor(value: TypeTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagVector;
}
declare class TypeTagStruct extends TypeTag {
    readonly value: StructTag;
    constructor(value: StructTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagStruct;
    isStringTypeTag(): boolean;
}
declare class StructTag {
    readonly address: AccountAddress;
    readonly module_name: Identifier;
    readonly name: Identifier;
    readonly type_args: Seq<TypeTag>;
    constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Seq<TypeTag>);
    /**
     * Converts a string literal to a StructTag
     * @param structTag String literal in format "AcountAddress::module_name::ResourceName",
     *   e.g. "0x1::aptos_coin::AptosCoin"
     * @returns
     */
    static fromString(structTag: string): StructTag;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): StructTag;
}

declare class RawTransaction {
    readonly sender: AccountAddress;
    readonly sequence_number: Uint64;
    readonly payload: TransactionPayload;
    readonly max_gas_amount: Uint64;
    readonly gas_unit_price: Uint64;
    readonly expiration_timestamp_secs: Uint64;
    readonly chain_id: ChainId;
    /**
     * RawTransactions contain the metadata and payloads that can be submitted to Aptos chain for execution.
     * RawTransactions must be signed before Aptos chain can execute them.
     *
     * @param sender Account address of the sender.
     * @param sequence_number Sequence number of this transaction. This must match the sequence number stored in
     *   the sender's account at the time the transaction executes.
     * @param payload Instructions for the Aptos Blockchain, including publishing a module,
     *   execute a entry function or execute a script payload.
     * @param max_gas_amount Maximum total gas to spend for this transaction. The account must have more
     *   than this gas or the transaction will be discarded during validation.
     * @param gas_unit_price Price to be paid per gas unit.
     * @param expiration_timestamp_secs The blockchain timestamp at which the blockchain would discard this transaction.
     * @param chain_id The chain ID of the blockchain that this transaction is intended to be run on.
     */
    constructor(sender: AccountAddress, sequence_number: Uint64, payload: TransactionPayload, max_gas_amount: Uint64, gas_unit_price: Uint64, expiration_timestamp_secs: Uint64, chain_id: ChainId);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransaction;
}
declare class Script {
    readonly code: Bytes;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<TransactionArgument>;
    /**
     * Scripts contain the Move bytecodes payload that can be submitted to Aptos chain for execution.
     * @param code Move bytecode
     * @param ty_args Type arguments that bytecode requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to bytecode function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(code: Bytes, ty_args: Seq<TypeTag>, args: Seq<TransactionArgument>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Script;
}
declare class EntryFunction {
    readonly module_name: ModuleId;
    readonly function_name: Identifier;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<Bytes>;
    /**
     * Contains the payload to run a function within a module.
     * @param module_name Fully qualified module name. ModuleId consists of account address and module name.
     * @param function_name The function to run.
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(module_name: ModuleId, function_name: Identifier, ty_args: Seq<TypeTag>, args: Seq<Bytes>);
    /**
     *
     * @param module Fully qualified module name in format "AccountAddress::module_name" e.g. "0x1::coin"
     * @param func Function name
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @returns
     */
    static natural(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    /**
     * `natual` is deprecated, please use `natural`
     *
     * @deprecated.
     */
    static natual(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): EntryFunction;
}
declare class Module {
    readonly code: Bytes;
    /**
     * Contains the bytecode of a Move module that can be published to the Aptos chain.
     * @param code Move bytecode of a module.
     */
    constructor(code: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Module;
}
declare class ModuleId {
    readonly address: AccountAddress;
    readonly name: Identifier;
    /**
     * Full name of a module.
     * @param address The account address.
     * @param name The name of the module under the account at "address".
     */
    constructor(address: AccountAddress, name: Identifier);
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "AccountAddress::module_name",
     *   e.g. "0x1::coin"
     * @returns
     */
    static fromStr(moduleId: string): ModuleId;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ModuleId;
}
declare class ChangeSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChangeSet;
}
declare class WriteSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): WriteSet;
}
declare class SignedTransaction {
    readonly raw_txn: RawTransaction;
    readonly authenticator: TransactionAuthenticator;
    /**
     * A SignedTransaction consists of a raw transaction and an authenticator. The authenticator
     * contains a client's public key and the signature of the raw transaction.
     *
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     *
     * @param raw_txn
     * @param authenticator Contains a client's public key and the signature of the raw transaction.
     *   Authenticator has 3 flavors: single signature, multi-signature and multi-agent.
     *   @see authenticator.ts for details.
     */
    constructor(raw_txn: RawTransaction, authenticator: TransactionAuthenticator);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): SignedTransaction;
}
declare abstract class RawTransactionWithData {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransactionWithData;
}
declare class MultiAgentRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): MultiAgentRawTransaction;
}
declare abstract class TransactionPayload {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionPayload;
}
declare class TransactionPayloadScript extends TransactionPayload {
    readonly value: Script;
    constructor(value: Script);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadScript;
}
declare class TransactionPayloadEntryFunction extends TransactionPayload {
    readonly value: EntryFunction;
    constructor(value: EntryFunction);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadEntryFunction;
}
declare class ChainId {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChainId;
}
declare abstract class TransactionArgument {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionArgument;
}
declare class TransactionArgumentU8 extends TransactionArgument {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8;
}
declare class TransactionArgumentU16 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU16;
}
declare class TransactionArgumentU32 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU32;
}
declare class TransactionArgumentU64 extends TransactionArgument {
    readonly value: Uint64;
    constructor(value: Uint64);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU64;
}
declare class TransactionArgumentU128 extends TransactionArgument {
    readonly value: Uint128;
    constructor(value: Uint128);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU128;
}
declare class TransactionArgumentU256 extends TransactionArgument {
    readonly value: Uint256;
    constructor(value: Uint256);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU256;
}
declare class TransactionArgumentAddress extends TransactionArgument {
    readonly value: AccountAddress;
    constructor(value: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentAddress;
}
declare class TransactionArgumentU8Vector extends TransactionArgument {
    readonly value: Bytes;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8Vector;
}
declare class TransactionArgumentBool extends TransactionArgument {
    readonly value: boolean;
    constructor(value: boolean);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentBool;
}
declare abstract class Transaction {
    abstract serialize(serializer: Serializer): void;
    abstract hash(): Bytes;
    getHashSalt(): Bytes;
    static deserialize(deserializer: Deserializer): Transaction;
}
declare class UserTransaction extends Transaction {
    readonly value: SignedTransaction;
    constructor(value: SignedTransaction);
    hash(): Bytes;
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): UserTransaction;
}

declare class TypeArgumentABI {
    readonly name: string;
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeArgumentABI;
}
declare class ArgumentABI {
    readonly name: string;
    readonly type_tag: TypeTag;
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name: string, type_tag: TypeTag);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ArgumentABI;
}
declare abstract class ScriptABI {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ScriptABI;
}
declare class TransactionScriptABI extends ScriptABI {
    readonly name: string;
    readonly doc: string;
    readonly code: Bytes;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name: string, doc: string, code: Bytes, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionScriptABI;
}
declare class EntryFunctionABI extends ScriptABI {
    readonly name: string;
    readonly module_name: ModuleId;
    readonly doc: string;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name: string, module_name: ModuleId, doc: string, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): EntryFunctionABI;
}

/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link * https://aptos.dev/concepts/accounts | Account Basics}
 *
 * Account addresses can be derived from AuthenticationKey
 */
declare class AuthenticationKey {
    static readonly LENGTH: number;
    static readonly MULTI_ED25519_SCHEME: number;
    static readonly ED25519_SCHEME: number;
    static readonly DERIVE_RESOURCE_ACCOUNT_SCHEME: number;
    readonly bytes: Bytes;
    constructor(bytes: Bytes);
    /**
     * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
     * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
     * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
     */
    static fromMultiEd25519PublicKey(publicKey: MultiEd25519PublicKey): AuthenticationKey;
    static fromEd25519PublicKey(publicKey: Ed25519PublicKey): AuthenticationKey;
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    derivedAddress(): HexString;
}

declare class RotationProofChallenge {
    readonly accountAddress: AccountAddress;
    readonly moduleName: string;
    readonly structName: string;
    readonly sequenceNumber: number | bigint;
    readonly originator: AccountAddress;
    readonly currentAuthKey: AccountAddress;
    readonly newPublicKey: Uint8Array;
    constructor(accountAddress: AccountAddress, moduleName: string, structName: string, sequenceNumber: number | bigint, originator: AccountAddress, currentAuthKey: AccountAddress, newPublicKey: Uint8Array);
    serialize(serializer: Serializer): void;
}

declare type SigningMessage = Uint8Array;

type index_SigningMessage = SigningMessage;
type index_TypeArgumentABI = TypeArgumentABI;
declare const index_TypeArgumentABI: typeof TypeArgumentABI;
type index_ArgumentABI = ArgumentABI;
declare const index_ArgumentABI: typeof ArgumentABI;
type index_ScriptABI = ScriptABI;
declare const index_ScriptABI: typeof ScriptABI;
type index_TransactionScriptABI = TransactionScriptABI;
declare const index_TransactionScriptABI: typeof TransactionScriptABI;
type index_EntryFunctionABI = EntryFunctionABI;
declare const index_EntryFunctionABI: typeof EntryFunctionABI;
type index_AccountAddress = AccountAddress;
declare const index_AccountAddress: typeof AccountAddress;
type index_TransactionAuthenticator = TransactionAuthenticator;
declare const index_TransactionAuthenticator: typeof TransactionAuthenticator;
type index_TransactionAuthenticatorEd25519 = TransactionAuthenticatorEd25519;
declare const index_TransactionAuthenticatorEd25519: typeof TransactionAuthenticatorEd25519;
type index_TransactionAuthenticatorMultiEd25519 = TransactionAuthenticatorMultiEd25519;
declare const index_TransactionAuthenticatorMultiEd25519: typeof TransactionAuthenticatorMultiEd25519;
type index_TransactionAuthenticatorMultiAgent = TransactionAuthenticatorMultiAgent;
declare const index_TransactionAuthenticatorMultiAgent: typeof TransactionAuthenticatorMultiAgent;
type index_AccountAuthenticator = AccountAuthenticator;
declare const index_AccountAuthenticator: typeof AccountAuthenticator;
type index_AccountAuthenticatorEd25519 = AccountAuthenticatorEd25519;
declare const index_AccountAuthenticatorEd25519: typeof AccountAuthenticatorEd25519;
type index_AccountAuthenticatorMultiEd25519 = AccountAuthenticatorMultiEd25519;
declare const index_AccountAuthenticatorMultiEd25519: typeof AccountAuthenticatorMultiEd25519;
type index_RawTransaction = RawTransaction;
declare const index_RawTransaction: typeof RawTransaction;
type index_Script = Script;
declare const index_Script: typeof Script;
type index_EntryFunction = EntryFunction;
declare const index_EntryFunction: typeof EntryFunction;
type index_Module = Module;
declare const index_Module: typeof Module;
type index_ModuleId = ModuleId;
declare const index_ModuleId: typeof ModuleId;
type index_ChangeSet = ChangeSet;
declare const index_ChangeSet: typeof ChangeSet;
type index_WriteSet = WriteSet;
declare const index_WriteSet: typeof WriteSet;
type index_SignedTransaction = SignedTransaction;
declare const index_SignedTransaction: typeof SignedTransaction;
type index_RawTransactionWithData = RawTransactionWithData;
declare const index_RawTransactionWithData: typeof RawTransactionWithData;
type index_MultiAgentRawTransaction = MultiAgentRawTransaction;
declare const index_MultiAgentRawTransaction: typeof MultiAgentRawTransaction;
type index_TransactionPayload = TransactionPayload;
declare const index_TransactionPayload: typeof TransactionPayload;
type index_TransactionPayloadScript = TransactionPayloadScript;
declare const index_TransactionPayloadScript: typeof TransactionPayloadScript;
type index_TransactionPayloadEntryFunction = TransactionPayloadEntryFunction;
declare const index_TransactionPayloadEntryFunction: typeof TransactionPayloadEntryFunction;
type index_ChainId = ChainId;
declare const index_ChainId: typeof ChainId;
type index_TransactionArgument = TransactionArgument;
declare const index_TransactionArgument: typeof TransactionArgument;
type index_TransactionArgumentU8 = TransactionArgumentU8;
declare const index_TransactionArgumentU8: typeof TransactionArgumentU8;
type index_TransactionArgumentU16 = TransactionArgumentU16;
declare const index_TransactionArgumentU16: typeof TransactionArgumentU16;
type index_TransactionArgumentU32 = TransactionArgumentU32;
declare const index_TransactionArgumentU32: typeof TransactionArgumentU32;
type index_TransactionArgumentU64 = TransactionArgumentU64;
declare const index_TransactionArgumentU64: typeof TransactionArgumentU64;
type index_TransactionArgumentU128 = TransactionArgumentU128;
declare const index_TransactionArgumentU128: typeof TransactionArgumentU128;
type index_TransactionArgumentU256 = TransactionArgumentU256;
declare const index_TransactionArgumentU256: typeof TransactionArgumentU256;
type index_TransactionArgumentAddress = TransactionArgumentAddress;
declare const index_TransactionArgumentAddress: typeof TransactionArgumentAddress;
type index_TransactionArgumentU8Vector = TransactionArgumentU8Vector;
declare const index_TransactionArgumentU8Vector: typeof TransactionArgumentU8Vector;
type index_TransactionArgumentBool = TransactionArgumentBool;
declare const index_TransactionArgumentBool: typeof TransactionArgumentBool;
type index_Transaction = Transaction;
declare const index_Transaction: typeof Transaction;
type index_UserTransaction = UserTransaction;
declare const index_UserTransaction: typeof UserTransaction;
type index_TypeTag = TypeTag;
declare const index_TypeTag: typeof TypeTag;
type index_TypeTagBool = TypeTagBool;
declare const index_TypeTagBool: typeof TypeTagBool;
type index_TypeTagU8 = TypeTagU8;
declare const index_TypeTagU8: typeof TypeTagU8;
type index_TypeTagU16 = TypeTagU16;
declare const index_TypeTagU16: typeof TypeTagU16;
type index_TypeTagU32 = TypeTagU32;
declare const index_TypeTagU32: typeof TypeTagU32;
type index_TypeTagU64 = TypeTagU64;
declare const index_TypeTagU64: typeof TypeTagU64;
type index_TypeTagU128 = TypeTagU128;
declare const index_TypeTagU128: typeof TypeTagU128;
type index_TypeTagU256 = TypeTagU256;
declare const index_TypeTagU256: typeof TypeTagU256;
type index_TypeTagAddress = TypeTagAddress;
declare const index_TypeTagAddress: typeof TypeTagAddress;
type index_TypeTagSigner = TypeTagSigner;
declare const index_TypeTagSigner: typeof TypeTagSigner;
type index_TypeTagVector = TypeTagVector;
declare const index_TypeTagVector: typeof TypeTagVector;
type index_TypeTagStruct = TypeTagStruct;
declare const index_TypeTagStruct: typeof TypeTagStruct;
type index_StructTag = StructTag;
declare const index_StructTag: typeof StructTag;
type index_Identifier = Identifier;
declare const index_Identifier: typeof Identifier;
type index_Ed25519PublicKey = Ed25519PublicKey;
declare const index_Ed25519PublicKey: typeof Ed25519PublicKey;
type index_Ed25519Signature = Ed25519Signature;
declare const index_Ed25519Signature: typeof Ed25519Signature;
type index_MultiEd25519PublicKey = MultiEd25519PublicKey;
declare const index_MultiEd25519PublicKey: typeof MultiEd25519PublicKey;
type index_MultiEd25519Signature = MultiEd25519Signature;
declare const index_MultiEd25519Signature: typeof MultiEd25519Signature;
type index_AuthenticationKey = AuthenticationKey;
declare const index_AuthenticationKey: typeof AuthenticationKey;
type index_RotationProofChallenge = RotationProofChallenge;
declare const index_RotationProofChallenge: typeof RotationProofChallenge;
declare namespace index {
  export {
    index_SigningMessage as SigningMessage,
    index_TypeArgumentABI as TypeArgumentABI,
    index_ArgumentABI as ArgumentABI,
    index_ScriptABI as ScriptABI,
    index_TransactionScriptABI as TransactionScriptABI,
    index_EntryFunctionABI as EntryFunctionABI,
    index_AccountAddress as AccountAddress,
    index_TransactionAuthenticator as TransactionAuthenticator,
    index_TransactionAuthenticatorEd25519 as TransactionAuthenticatorEd25519,
    index_TransactionAuthenticatorMultiEd25519 as TransactionAuthenticatorMultiEd25519,
    index_TransactionAuthenticatorMultiAgent as TransactionAuthenticatorMultiAgent,
    index_AccountAuthenticator as AccountAuthenticator,
    index_AccountAuthenticatorEd25519 as AccountAuthenticatorEd25519,
    index_AccountAuthenticatorMultiEd25519 as AccountAuthenticatorMultiEd25519,
    index_RawTransaction as RawTransaction,
    index_Script as Script,
    index_EntryFunction as EntryFunction,
    index_Module as Module,
    index_ModuleId as ModuleId,
    index_ChangeSet as ChangeSet,
    index_WriteSet as WriteSet,
    index_SignedTransaction as SignedTransaction,
    index_RawTransactionWithData as RawTransactionWithData,
    index_MultiAgentRawTransaction as MultiAgentRawTransaction,
    index_TransactionPayload as TransactionPayload,
    index_TransactionPayloadScript as TransactionPayloadScript,
    index_TransactionPayloadEntryFunction as TransactionPayloadEntryFunction,
    index_ChainId as ChainId,
    index_TransactionArgument as TransactionArgument,
    index_TransactionArgumentU8 as TransactionArgumentU8,
    index_TransactionArgumentU16 as TransactionArgumentU16,
    index_TransactionArgumentU32 as TransactionArgumentU32,
    index_TransactionArgumentU64 as TransactionArgumentU64,
    index_TransactionArgumentU128 as TransactionArgumentU128,
    index_TransactionArgumentU256 as TransactionArgumentU256,
    index_TransactionArgumentAddress as TransactionArgumentAddress,
    index_TransactionArgumentU8Vector as TransactionArgumentU8Vector,
    index_TransactionArgumentBool as TransactionArgumentBool,
    index_Transaction as Transaction,
    index_UserTransaction as UserTransaction,
    index_TypeTag as TypeTag,
    index_TypeTagBool as TypeTagBool,
    index_TypeTagU8 as TypeTagU8,
    index_TypeTagU16 as TypeTagU16,
    index_TypeTagU32 as TypeTagU32,
    index_TypeTagU64 as TypeTagU64,
    index_TypeTagU128 as TypeTagU128,
    index_TypeTagU256 as TypeTagU256,
    index_TypeTagAddress as TypeTagAddress,
    index_TypeTagSigner as TypeTagSigner,
    index_TypeTagVector as TypeTagVector,
    index_TypeTagStruct as TypeTagStruct,
    index_StructTag as StructTag,
    index_Identifier as Identifier,
    index_Ed25519PublicKey as Ed25519PublicKey,
    index_Ed25519Signature as Ed25519Signature,
    index_MultiEd25519PublicKey as MultiEd25519PublicKey,
    index_MultiEd25519Signature as MultiEd25519Signature,
    index_AuthenticationKey as AuthenticationKey,
    index_RotationProofChallenge as RotationProofChallenge,
  };
}

/**
 * Parser to parse a type tag string
 */
declare class TypeTagParser {
    private readonly tokens;
    constructor(tagStr: string);
    private consume;
    private parseCommaList;
    parseTypeTag(): TypeTag;
}

declare type AnyRawTransaction = RawTransaction | MultiAgentRawTransaction;
/**
 * Function that takes in a Signing Message (serialized raw transaction)
 *  and returns a signature
 */
declare type SigningFn = (txn: SigningMessage) => Ed25519Signature | MultiEd25519Signature;
declare class TransactionBuilder<F extends SigningFn> {
    readonly rawTxnBuilder?: TransactionBuilderABI | undefined;
    protected readonly signingFunction: F;
    constructor(signingFunction: F, rawTxnBuilder?: TransactionBuilderABI | undefined);
    /**
     * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
     * @param func
     * @param ty_tags
     * @param args
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn: AnyRawTransaction): SigningMessage;
}
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
declare class TransactionBuilderEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: Uint8Array, rawTxnBuilder?: TransactionBuilderABI);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
declare class TransactionBuilderMultiEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: MultiEd25519PublicKey);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Config for creating raw transactions.
 */
interface ABIBuilderConfig {
    sender: MaybeHexString | AccountAddress;
    sequenceNumber: Uint64 | string;
    gasUnitPrice: Uint64 | string;
    maxGasAmount?: Uint64 | string;
    expSecFromNow?: number | string;
    chainId: Uint8 | string;
}
/**
 * Builds raw transactions based on ABI
 */
declare class TransactionBuilderABI {
    private readonly abiMap;
    private readonly builderConfig;
    /**
     * Constructs a TransactionBuilderABI instance
     * @param abis List of binary ABIs.
     * @param builderConfig Configs for creating a raw transaction.
     */
    constructor(abis: Bytes[], builderConfig?: ABIBuilderConfig);
    private static toBCSArgs;
    private static toTransactionArguments;
    setSequenceNumber(seqNumber: Uint64 | string): void;
    /**
     * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
     * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
     * and pass the payload to the wallet for signing and sending.
     * @param func Fully qualified func names, e.g. 0x1::Coin::transfer
     * @param ty_tags TypeTag strings
     * @param args Function arguments
     * @returns TransactionPayload
     */
    buildTransactionPayload(func: string, ty_tags: string[], args: any[]): TransactionPayload;
    /**
     * Builds a RawTransaction
     * @param func Fully qualified func names, e.g. 0x1::Coin::transfer
     * @param ty_tags TypeTag strings.
     * @example Below are valid value examples
     * ```
     * // Structs are in format `AccountAddress::ModuleName::StructName`
     * 0x1::aptos_coin::AptosCoin
     * // Vectors are in format `vector<other_tag_string>`
     * vector<0x1::aptos_coin::AptosCoin>
     * bool
     * u8
     * u16
     * u32
     * u64
     * u128
     * u256
     * address
     * ```
     * @param args Function arguments
     * @returns RawTransaction
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
}
declare type RemoteABIBuilderConfig = Partial<Omit<ABIBuilderConfig, "sender">> & {
    sender: MaybeHexString | AccountAddress;
};
interface AptosClientInterface {
    getAccountModules: (accountAddress: MaybeHexString) => Promise<MoveModuleBytecode[]>;
    getAccount: (accountAddress: MaybeHexString) => Promise<AccountData>;
    getChainId: () => Promise<number>;
    estimateGasPrice: () => Promise<GasEstimation>;
}
/**
 * This transaction builder downloads JSON ABIs from the fullnodes.
 * It then translates the JSON ABIs to the format that is accepted by TransactionBuilderABI
 */
declare class TransactionBuilderRemoteABI {
    private readonly aptosClient;
    private readonly builderConfig;
    constructor(aptosClient: AptosClientInterface, builderConfig: RemoteABIBuilderConfig);
    fetchABI(addr: string): Promise<Map<string, MoveFunction & {
        fullName: string;
    }>>;
    /**
     * Builds a raw transaction. Only support script function a.k.a entry function payloads
     *
     * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coins::transfer
     * @param ty_tags
     * @param args
     * @returns RawTransaction
     */
    build(func: EntryFunctionId, ty_tags: MoveType[], args: any[]): Promise<RawTransaction>;
}

interface OptionalTransactionArgs {
    maxGasAmount?: Uint64;
    gasUnitPrice?: Uint64;
    expireTimestamp?: Uint64;
}
interface PaginationArgs {
    start?: AnyNumber;
    limit?: number;
}
/**
 * Provides methods for retrieving data from Aptos node.
 * For more detailed API specification see {@link https://fullnode.devnet.aptoslabs.com/v1/spec}
 */
declare class AptosClient {
    client: AptosGeneratedClient;
    readonly nodeUrl: string;
    /**
     * Build a client configured to connect to an Aptos node at the given URL.
     *
     * Note: If you forget to append `/v1` to the URL, the client constructor
     * will automatically append it. If you don't want this URL processing to
     * take place, set doNotFixNodeUrl to true.
     *
     * @param nodeUrl URL of the Aptos Node API endpoint.
     * @param config Additional configuration options for the generated Axios client.
     */
    constructor(nodeUrl: string, config?: Partial<OpenAPIConfig>, doNotFixNodeUrl?: boolean);
    /**
     * Queries an Aptos account by address
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @returns Core account resource, used for identifying account and transaction execution
     * @example An example of the returned account
     * ```
     * {
     *    sequence_number: "1",
     *    authentication_key: "0x5307b5f4bc67829097a8ba9b43dba3b88261eeccd1f709d9bde240fc100fbb69"
     * }
     * ```
     */
    getAccount(accountAddress: MaybeHexString): Promise<AccountData>;
    /**
     * Queries transactions sent by given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query Optional pagination object
     * @param query.start The sequence number of the start transaction of the page. Default is 0.
     * @param query.limit The max number of transactions should be returned for the page. Default is 25.
     * @returns An array of on-chain transactions, sent by account
     */
    getAccountTransactions(accountAddress: MaybeHexString, query?: PaginationArgs): Promise<Transaction$1[]>;
    /**
     * Queries modules associated with given account
     *
     * Note: In order to get all account modules, this function may call the API
     * multiple times as it paginates.
     *
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account modules array for a specific ledger version.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which is JSON representation of a module
     */
    getAccountModules(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveModuleBytecode[]>;
    /**
     * Queries module associated with given account by module name
     *
     * Note: In order to get all account resources, this function may call the API
     * multiple times as it paginates.
     *
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param moduleName The name of the module
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Specified module.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which JSON representation of a module
     */
    getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveModuleBytecode>;
    /**
     * Queries all resources associated with given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resources for a specific ledger version
     */
    getAccountResources(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveResource[]>;
    /**
     * Queries resource associated with given account by resource type
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param resourceType String representation of an on-chain Move struct type
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resource of specified type and ledger version
     * @example An example of an account resource
     * ```
     * {
     *    type: "0x1::aptos_coin::AptosCoin",
     *    data: { value: 6 }
     * }
     * ```
     */
    getAccountResource(accountAddress: MaybeHexString, resourceType: MoveStructTag, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveResource>;
    /** Generates a signed transaction that can be submitted to the chain for execution. */
    static generateBCSTransaction(accountFrom: AptosAccount, rawTxn: RawTransaction): Uint8Array;
    /**
     * Note: Unless you have a specific reason for using this, it'll probably be simpler
     * to use `simulateTransaction`.
     *
     * Generates a BCS transaction that can be submitted to the chain for simulation.
     *
     * @param accountFrom The account that will be used to send the transaction
     * for simulation.
     * @param rawTxn The raw transaction to be simulated, likely created by calling
     * the `generateTransaction` function.
     * @returns The BCS encoded signed transaction, which you should then pass into
     * the `submitBCSSimulation` function.
     */
    static generateBCSSimulation(accountFrom: AptosAccount, rawTxn: RawTransaction): Uint8Array;
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain
     * @param sender Hex-encoded 32 byte Aptos account address of transaction sender
     * @param payload Transaction payload. It depends on transaction type you want to send
     * @param options Options allow to overwrite default transaction options.
     * @returns A transaction object
     */
    generateTransaction(sender: MaybeHexString, payload: EntryFunctionPayload, options?: Partial<SubmitTransactionRequest>): Promise<RawTransaction>;
    /** Converts a transaction request produced by `generateTransaction` into a properly
     * signed transaction, which can then be submitted to the blockchain
     * @param accountFrom AptosAccount of transaction sender
     * @param rawTransaction A raw transaction generated by `generateTransaction` method
     * @returns A transaction, signed with sender account
     */
    signTransaction(accountFrom: AptosAccount, rawTransaction: RawTransaction): Promise<Uint8Array>;
    /**
     * Event types are globally identifiable by an account `address` and
     * monotonically increasing `creation_number`, one per event type emitted
     * to the given account. This API returns events corresponding to that
     * that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param creationNumber Creation number corresponding to the event type.
     * @returns Array of events assotiated with the given account and creation number.
     */
    getEventsByCreationNumber(address: MaybeHexString, creationNumber: AnyNumber | string, query?: PaginationArgs): Promise<Event[]>;
    /**
     * This API uses the given account `address`, `eventHandle`, and `fieldName`
     * to build a key that can globally identify an event types. It then uses this
     * key to return events emitted to the given account matching that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param eventHandleStruct String representation of an on-chain Move struct type.
     * (e.g. `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`)
     * @param fieldName The field name of the EventHandle in the struct
     * @param query Optional query object
     * @param query.start The start sequence number in the EVENT STREAM, defaulting to the latest event.
     * The events are returned in the reverse order of sequence number
     * @param query.limit The number of events to be returned. The default is 25.
     * @returns Array of events
     */
    getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: MoveStructTag, fieldName: string, query?: PaginationArgs): Promise<Event[]>;
    /**
     * Submits a signed transaction to the transaction endpoint.
     * @param signedTxn A transaction, signed by `signTransaction` method
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitTransaction(signedTxn: Uint8Array): Promise<PendingTransaction>;
    /**
     * Generates and submits a transaction to the transaction simulation
     * endpoint. For this we generate a transaction with a fake signature.
     *
     * @param accountOrPubkey The sender or sender's public key. When private key is available, `AptosAccount` instance
     * can be used to send the transaction for simulation. If private key is not available, sender's public key can be
     * used to send the transaction for simulation.
     * @param rawTransaction The raw transaction to be simulated, likely created
     * by calling the `generateTransaction` function.
     * @param query.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @param query.estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the
     * original estimate.
     * @returns The BCS encoded signed transaction, which you should then provide
     *
     */
    simulateTransaction(accountOrPubkey: AptosAccount | Ed25519PublicKey | MultiEd25519PublicKey, rawTransaction: RawTransaction, query?: {
        estimateGasUnitPrice?: boolean;
        estimateMaxGasAmount?: boolean;
        estimatePrioritizedGasUnitPrice: boolean;
    }): Promise<UserTransaction$1[]>;
    /**
     * Submits a signed transaction to the endpoint that takes BCS payload
     *
     * @param signedTxn A BCS transaction representation
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<PendingTransaction>;
    /**
     * Submits the BCS serialization of a signed transaction to the simulation endpoint.
     *
     * @param bcsBody The output of `generateBCSSimulation`.
     * @param query?.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query?.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @param query?.estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the
     * original estimate.
     * @returns Simulation result in the form of UserTransaction.
     */
    submitBCSSimulation(bcsBody: Uint8Array, query?: {
        estimateGasUnitPrice?: boolean;
        estimateMaxGasAmount?: boolean;
        estimatePrioritizedGasUnitPrice?: boolean;
    }): Promise<UserTransaction$1[]>;
    /**
     * Queries on-chain transactions. This function will not return pending
     * transactions. For that, use `getTransactionsByHash`.
     *
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25
     * @returns Array of on-chain transactions
     */
    getTransactions(query?: PaginationArgs): Promise<Transaction$1[]>;
    /**
     * @param txnHash - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * @returns Transaction from mempool (pending) or on-chain (committed) transaction
     */
    getTransactionByHash(txnHash: string): Promise<Transaction$1>;
    /**
     * @param txnVersion - Transaction version is an uint64 number.
     * @returns On-chain transaction. Only on-chain transactions have versions, so this
     * function cannot be used to query pending transactions.
     */
    getTransactionByVersion(txnVersion: AnyNumber): Promise<Transaction$1>;
    /**
     * Defines if specified transaction is currently in pending state
     * @param txnHash A hash of transaction
     *
     * To create a transaction hash:
     *
     * 1. Create hash message bytes: "Aptos::Transaction" bytes + BCS bytes of Transaction.
     * 2. Apply hash algorithm SHA3-256 to the hash message bytes.
     * 3. Hex-encode the hash bytes with 0x prefix.
     *
     * @returns `true` if transaction is in pending state and `false` otherwise
     */
    transactionPending(txnHash: string): Promise<boolean>;
    /**
     * Wait for a transaction to move past pending state.
     *
     * There are 4 possible outcomes:
     * 1. Transaction is processed and successfully committed to the blockchain.
     * 2. Transaction is rejected for some reason, and is therefore not committed
     *    to the blockchain.
     * 3. Transaction is committed but execution failed, meaning no changes were
     *    written to the blockchain state.
     * 4. Transaction is not processed within the specified timeout.
     *
     * In case 1, this function resolves with the transaction response returned
     * by the API.
     *
     * In case 2, the function will throw an ApiError, likely with an HTTP status
     * code indicating some problem with the request (e.g. 400).
     *
     * In case 3, if `checkSuccess` is false (the default), this function returns
     * the transaction response just like in case 1, in which the `success` field
     * will be false. If `checkSuccess` is true, it will instead throw a
     * FailedTransactionError.
     *
     * In case 4, this function throws a WaitForTransactionError.
     *
     * @param txnHash The hash of a transaction previously submitted to the blockchain.
     * @param extraArgs.timeoutSecs Timeout in seconds. Defaults to 20 seconds.
     * @param extraArgs.checkSuccess See above. Defaults to false.
     * @returns See above.
     *
     * @example
     * ```
     * const rawTransaction = await this.generateRawTransaction(sender.address(), payload, extraArgs);
     * const bcsTxn = AptosClient.generateBCSTransaction(sender, rawTransaction);
     * const pendingTransaction = await this.submitSignedBCSTransaction(bcsTxn);
     * const transasction = await this.aptosClient.waitForTransactionWithResult(pendingTransaction.hash);
     * ```
     */
    waitForTransactionWithResult(txnHash: string, extraArgs?: {
        timeoutSecs?: number;
        checkSuccess?: boolean;
    }): Promise<Transaction$1>;
    /**
     * This function works the same as `waitForTransactionWithResult` except it
     * doesn't return the transaction in those cases, it returns nothing. For
     * more information, see the documentation for `waitForTransactionWithResult`.
     */
    waitForTransaction(txnHash: string, extraArgs?: {
        timeoutSecs?: number;
        checkSuccess?: boolean;
    }): Promise<void>;
    /**
     * Queries the latest ledger information
     * @returns Latest ledger information
     * @example Example of returned data
     * ```
     * {
     *   chain_id: 15,
     *   epoch: 6,
     *   ledgerVersion: "2235883",
     *   ledger_timestamp:"1654580922321826"
     * }
     * ```
     */
    getLedgerInfo(): Promise<IndexResponse>;
    /**
     * @returns Current chain id
     */
    getChainId(): Promise<number>;
    /**
     * Gets a table item for a table identified by the handle and the key for the item.
     * Key and value types need to be passed in to help with key serialization and value deserialization.
     * @param handle A pointer to where that table is stored
     * @param data Object, that describes table item
     * @param data.key_type Move type of table key (e.g. `vector<u8>`)
     * @param data.value_type Move type of table value (e.g. `u64`)
     * @param data.key Value of table key
     * @returns Table item value rendered in JSON
     */
    getTableItem(handle: string, data: TableItemRequest, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<any>;
    /**
     * Generates a raw transaction out of a transaction payload
     * @param accountFrom
     * @param payload
     * @param extraArgs
     * @returns
     */
    generateRawTransaction(accountFrom: HexString, payload: TransactionPayload, extraArgs?: OptionalTransactionArgs): Promise<RawTransaction>;
    /**
     * Helper for generating, signing, and submitting a transaction.
     *
     * @param sender AptosAccount of transaction sender.
     * @param payload Transaction payload.
     * @param extraArgs Extra args for building the transaction payload.
     * @returns The transaction response from the API.
     */
    generateSignSubmitTransaction(sender: AptosAccount, payload: TransactionPayload, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Publishes a move package. `packageMetadata` and `modules` can be generated with command
     * `aptos move compile --save-metadata [ --included-artifacts=<...> ]`.
     * @param sender
     * @param packageMetadata package metadata bytes
     * @param modules bytecodes of modules
     * @param extraArgs
     * @returns Transaction hash
     */
    publishPackage(sender: AptosAccount, packageMetadata: Bytes, modules: Seq<Module>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Helper for generating, submitting, and waiting for a transaction, and then
     * checking whether it was committed successfully. Under the hood this is just
     * `generateSignSubmitTransaction` and then `waitForTransactionWithResult`, see
     * those for information about the return / error semantics of this function.
     */
    generateSignSubmitWaitForTransaction(sender: AptosAccount, payload: TransactionPayload, extraArgs?: OptionalTransactionArgs & {
        checkSuccess?: boolean;
        timeoutSecs?: number;
    }): Promise<Transaction$1>;
    estimateGasPrice(): Promise<GasEstimation>;
    estimateMaxGasAmount(forAccount: MaybeHexString): Promise<Uint64>;
    /**
     * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
     * the account.
     * WARNING: You must create a new instance of AptosAccount after using this function.
     * @param forAccount Account of which the auth key will be rotated
     * @param toPrivateKeyBytes New private key
     * @param extraArgs Extra args for building the transaction payload.
     * @returns PendingTransaction
     */
    rotateAuthKeyEd25519(forAccount: AptosAccount, toPrivateKeyBytes: Uint8Array, extraArgs?: OptionalTransactionArgs): Promise<PendingTransaction>;
    /**
     * Lookup the original address by the current derived address
     * @param addressOrAuthKey
     * @returns original address
     */
    lookupOriginalAddress(addressOrAuthKey: MaybeHexString): Promise<HexString>;
    /**
     * Get block by height
     *
     * @param blockHeight Block height to lookup.  Starts at 0
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    getBlockByHeight(blockHeight: number, withTransactions?: boolean): Promise<Block>;
    /**
     * Get block by block transaction version
     *
     * @param version Ledger version to lookup block information for
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    getBlockByVersion(version: number, withTransactions?: boolean): Promise<Block>;
    clearCache(tags: string[]): void;
}
declare class ApiError extends Error {
    readonly status: number;
    readonly message: string;
    readonly errorCode?: string | undefined;
    readonly vmErrorCode?: string | undefined;
    constructor(status: number, message: string, errorCode?: string | undefined, vmErrorCode?: string | undefined);
}
/**
 * This error is used by `waitForTransactionWithResult` when waiting for a
 * transaction times out.
 */
declare class WaitForTransactionError extends Error {
    readonly lastSubmittedTransaction: Transaction$1 | undefined;
    constructor(message: string, lastSubmittedTransaction: Transaction$1 | undefined);
}
/**
 * This error is used by `waitForTransactionWithResult` if `checkSuccess` is true.
 * See that function for more information.
 */
declare class FailedTransactionError extends Error {
    readonly transaction: Transaction$1;
    constructor(message: string, transaction: Transaction$1);
}

/**
 * Class for working with the coin module, such as transferring coins and
 * checking balances.
 */
declare class CoinClient {
    aptosClient: AptosClient;
    transactionBuilder: TransactionBuilderABI;
    /**
     * Creates new CoinClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Generate, sign, and submit a transaction to the Aptos blockchain API to
     * transfer coins from one account to another. By default it transfers
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type
     * with the `coinType` argument.
     *
     * You may set `createReceiverIfMissing` to true if you want to create the
     * receiver account if it does not exist on chain yet. If you do not set
     * this to true, the transaction will fail if the receiver account does not
     * exist on-chain.
     *
     * @param from Account sending the coins
     * @param to Account to receive the coins
     * @param amount Number of coins to transfer
     * @param extraArgs Extra args for building the transaction or configuring how
     * the client should submit and wait for the transaction
     * @returns The hash of the transaction submitted to the API
     */
    transfer(from: AptosAccount, to: AptosAccount | MaybeHexString, amount: number | bigint, extraArgs?: OptionalTransactionArgs & {
        coinType?: string;
        createReceiverIfMissing?: boolean;
    }): Promise<string>;
    /**
     * Get the balance of the account. By default it checks the balance of
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type.
     *
     * @param account Account that you want to get the balance of.
     * @param extraArgs Extra args for checking the balance.
     * @returns Promise that resolves to the balance as a bigint.
     */
    checkBalance(account: AptosAccount | MaybeHexString, extraArgs?: {
        coinType?: string;
    }): Promise<bigint>;
}

declare class AxiosHttpRequest extends BaseHttpRequest {
    constructor(config: OpenAPIConfig);
    /**
     * Request method
     * @param options The request options from the service
     * @returns CancelablePromise<T>
     * @throws ApiError
     */
    request<T>(options: ApiRequestOptions): CancelablePromise<T>;
}

/** Faucet creates and funds accounts. This is a thin wrapper around that. */

/**
 * Class for requsting tokens from faucet
 */
declare class FaucetClient extends AptosClient {
    faucetRequester: AxiosHttpRequest;
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param faucetUrl A faucet url
     * @param config An optional config for inner axios instance
     * Detailed config description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl: string, faucetUrl: string, config?: Partial<OpenAPIConfig>);
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @param timeoutSecs
     * @returns Hashes of submitted transactions
     */
    fundAccount(address: MaybeHexString, amount: number, timeoutSecs?: number): Promise<string[]>;
}

declare class PropertyValue {
    type: string;
    value: any;
    constructor(type: string, value: string);
}
declare class PropertyMap {
    data: {
        [key: string]: PropertyValue;
    };
    constructor();
    setProperty(key: string, value: PropertyValue): void;
}
declare function getPropertyValueRaw(values: Array<string>, types: Array<string>): Array<Bytes>;
declare function deserializePropertyMap(rawPropertyMap: any): PropertyMap;
declare function deserializeValueBasedOnTypeTag(tag: TypeTag, val: string): string;

declare class TokenData {
    /** Unique name within this creator's account for this Token's collection */
    collection: string;
    /** Description of Token */
    description: string;
    /** Name of Token */
    name: string;
    /** Optional maximum number of this Token */
    maximum?: number;
    /** Total number of this type of Token */
    supply: number;
    /** URL for additional information / media */
    uri: string;
    /** default properties of token data */
    default_properties: PropertyMap;
    /** mutability config of tokendata fields */
    mutability_config: boolean[];
    constructor(collection: string, description: string, name: string, maximum: number, supply: number, uri: string, default_properties: any, mutability_config: boolean[]);
}
interface TokenDataId {
    /** Token creator address */
    creator: string;
    /** Unique name within this creator's account for this Token's collection */
    collection: string;
    /** Name of Token */
    name: string;
}
interface TokenId {
    token_data_id: TokenDataId;
    /** version number of the property map */
    property_version: string;
}
/** server will return string for u64 */
declare type U64 = string;
declare class Token {
    id: TokenId;
    /** server will return string for u64 */
    amount: U64;
    /** the property map of the token */
    token_properties: PropertyMap;
    constructor(id: TokenId, amount: U64, token_properties: any);
}

type token_types_PropertyMap = PropertyMap;
declare const token_types_PropertyMap: typeof PropertyMap;
type token_types_PropertyValue = PropertyValue;
declare const token_types_PropertyValue: typeof PropertyValue;
type token_types_TokenData = TokenData;
declare const token_types_TokenData: typeof TokenData;
type token_types_TokenDataId = TokenDataId;
type token_types_TokenId = TokenId;
type token_types_Token = Token;
declare const token_types_Token: typeof Token;
declare namespace token_types {
  export {
    token_types_PropertyMap as PropertyMap,
    token_types_PropertyValue as PropertyValue,
    token_types_TokenData as TokenData,
    token_types_TokenDataId as TokenDataId,
    token_types_TokenId as TokenId,
    token_types_Token as Token,
  };
}

/**
 * Class for creating, minting and managing minting NFT collections and tokens
 */
declare class TokenClient {
    aptosClient: AptosClient;
    transactionBuilder: TransactionBuilderABI;
    /**
     * Creates new TokenClient instance
     *
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
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
    createCollection(account: AptosAccount, name: string, description: string, uri: string, maxAmount?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
     * @returns The hash of the transaction submitted to the API
     */
    createToken(account: AptosAccount, collectionName: string, name: string, description: string, supply: number, uri: string, max?: AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: number, royalty_points_numerator?: number, property_keys?: Array<string>, property_values?: Array<string>, property_types?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
    createTokenWithMutabilityConfig(account: AptosAccount, collectionName: string, name: string, description: string, supply: AnyNumber, uri: string, max?: AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: AnyNumber, royalty_points_numerator?: AnyNumber, property_keys?: Array<string>, property_values?: Array<Bytes>, property_types?: Array<string>, mutability_config?: Array<boolean>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Transfers specified amount of tokens from account to receiver
     *
     * @param account AptosAccount where token from which tokens will be transfered
     * @param receiver  Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    offerToken(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Claims a token on specified account
     *
     * @param account AptosAccount which will claim token
     * @param sender Hex-encoded 32 byte Aptos account address which holds a token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    claimToken(account: AptosAccount, sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Removes a token from pending claims list
     *
     * @param account AptosAccount which will remove token from pending list
     * @param receiver Hex-encoded 32 byte Aptos account address which had to claim token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is strored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    cancelTokenOffer(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Directly transfer the specified amount of tokens from account to receiver
     * using a single multi signature transaction.
     *
     * @param sender AptosAccount where token from which tokens will be transfered
     * @param receiver Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    directTransferToken(sender: AptosAccount, receiver: AptosAccount, creator: MaybeHexString, collectionName: string, name: string, amount: AnyNumber, propertyVersion?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * User opt-in or out direct transfer through a boolean flag
     *
     * @param sender AptosAccount where the token will be transferred
     * @param optIn boolean value indicates user want to opt-in or out of direct transfer
     * @returns The hash of the transaction submitted to the API
     */
    optInTokenTransfer(sender: AptosAccount, optIn: boolean, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Directly transfer token to a receiver. The receiver should have opted in to direct transfer
     *
     * @param sender AptosAccount where the token will be transferred
     * @param creator  address of the token creator
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param property_version the version of token PropertyMap
     * @param amount Amount of tokens which will be transfered
     * @returns The hash of the transaction submitted to the API
     */
    transferWithOptIn(sender: AptosAccount, creator: MaybeHexString, collectionName: string, tokenName: string, propertyVersion: AnyNumber, receiver: MaybeHexString, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * BurnToken by Creator
     *
     * @param creator creator of the token
     * @param ownerAddress address of the token owner
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap
     * @returns The hash of the transaction submitted to the API
     */
    burnByCreator(creator: AptosAccount, ownerAddress: MaybeHexString, collection: String, name: String, PropertyVersion: AnyNumber, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * BurnToken by Owner
     *
     * @param owner creator of the token
     * @param creatorAddress address of the token creator
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap
     * @returns The hash of the transaction submitted to the API
     */
    burnByOwner(owner: AptosAccount, creatorAddress: MaybeHexString, collection: String, name: String, PropertyVersion: AnyNumber, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
    mutateTokenProperties(account: AptosAccount, tokenOwner: HexString, creator: HexString, collection_name: string, tokenName: string, propertyVersion: AnyNumber, amount: AnyNumber, keys: Array<string>, values: Array<Bytes>, types: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Queries collection data
     * @param creator Hex-encoded 32 byte Aptos account address which created a collection
     * @param collectionName Collection name
     * @returns Collection data in below format
     * ```
     *  Collection {
     *    // Describes the collection
     *    description: string,
     *    // Unique name within this creators account for this collection
     *    name: string,
     *    // URL for additional information/media
     *    uri: string,
     *    // Total number of distinct Tokens tracked by the collection
     *    count: number,
     *    // Optional maximum number of tokens allowed within this collections
     *    maximum: number
     *  }
     * ```
     */
    getCollectionData(creator: MaybeHexString, collectionName: string): Promise<any>;
    /**
     * Queries token data from collection
     *
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection, which holds a token
     * @param tokenName Token name
     * @returns Token data in below format
     * ```
     * TokenData {
     *     // Unique name within this creators account for this Token's collection
     *     collection: string;
     *     // Describes this Token
     *     description: string;
     *     // The name of this Token
     *     name: string;
     *     // Optional maximum number of this type of Token.
     *     maximum: number;
     *     // Total number of this type of Token
     *     supply: number;
     *     /// URL for additional information / media
     *     uri: string;
     *   }
     * ```
     */
    getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<TokenData>;
    /**
     * Queries token balance for the token creator
     */
    getToken(creator: MaybeHexString, collectionName: string, tokenName: string, property_version?: string): Promise<Token>;
    /**
     * Queries token balance for a token account
     * @param account Hex-encoded 32 byte Aptos account address which created a token
     * @param tokenId token id
     *
     * TODO: Update this:
     * @example
     * ```
     * {
     *   creator: '0x1',
     *   collection: 'Some collection',
     *   name: 'Awesome token'
     * }
     * ```
     * @returns Token object in below format
     * ```
     * Token {
     *   id: TokenId;
     *   value: number;
     * }
     * ```
     */
    getTokenForAccount(account: MaybeHexString, tokenId: TokenId): Promise<Token>;
}

declare type Hex = string;
declare type Path = string;
declare type Keys = {
    key: Uint8Array;
    chainCode: Uint8Array;
};
declare const derivePath: (path: Path, seed: Hex, offset?: number) => Keys;

export { ApiError, AptosAccount, AptosAccountObject, AptosClient, index$1 as BCS, CoinClient, FailedTransactionError, FaucetClient, HexString, MaybeHexString, OptionalTransactionArgs, RemoteABIBuilderConfig, SigningFn, TokenClient, token_types as TokenTypes, TransactionBuilder, TransactionBuilderABI, TransactionBuilderEd25519, TransactionBuilderMultiEd25519, TransactionBuilderRemoteABI, index as TxnBuilderTypes, TypeTagParser, index$2 as Types, WaitForTransactionError, derivePath, deserializePropertyMap, deserializeValueBasedOnTypeTag, getAddressFromAccountOrAddress, getPropertyValueRaw };
