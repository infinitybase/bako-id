import type { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  contract_type: { input: string; output: string; }
  entity_type: { input: string; output: string; }
  jsonb: { input: string; output: string; }
  network: { input: string; output: string; }
  numeric: { input: string; output: string; }
  timestamp: { input: string; output: string; }
  timestamptz: { input: string; output: string; }
};

/** columns and relationships of "AddressResolver" */
export type GQLAddressResolver = {
  __typename: 'AddressResolver';
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** An object relationship */
  record?: Maybe<GQLRecords>;
  record_id: Scalars['String']['output'];
  resolver: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "AddressResolver". All fields are combined with a logical 'AND'. */
export type GQLAddressResolver_Bool_Exp = {
  _and?: InputMaybe<Array<GQLAddressResolver_Bool_Exp>>;
  _not?: InputMaybe<GQLAddressResolver_Bool_Exp>;
  _or?: InputMaybe<Array<GQLAddressResolver_Bool_Exp>>;
  db_write_timestamp?: InputMaybe<GQLTimestamp_Comparison_Exp>;
  id?: InputMaybe<GQLString_Comparison_Exp>;
  name?: InputMaybe<GQLString_Comparison_Exp>;
  record?: InputMaybe<GQLRecords_Bool_Exp>;
  record_id?: InputMaybe<GQLString_Comparison_Exp>;
  resolver?: InputMaybe<GQLString_Comparison_Exp>;
};

/** Ordering options when selecting data from "AddressResolver". */
export type GQLAddressResolver_Order_By = {
  db_write_timestamp?: InputMaybe<GQLOrder_By>;
  id?: InputMaybe<GQLOrder_By>;
  name?: InputMaybe<GQLOrder_By>;
  record?: InputMaybe<GQLRecords_Order_By>;
  record_id?: InputMaybe<GQLOrder_By>;
  resolver?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "AddressResolver" */
export enum GQLAddressResolver_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RecordId = 'record_id',
  /** column name */
  Resolver = 'resolver'
}

/** Streaming cursor of the table "AddressResolver" */
export type GQLAddressResolver_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLAddressResolver_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLAddressResolver_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  record_id?: InputMaybe<Scalars['String']['input']>;
  resolver?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type GQLBoolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type GQLInt_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** columns and relationships of "Records" */
export type GQLRecords = {
  __typename: 'Records';
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  name_hash: Scalars['String']['output'];
  network: Scalars['network']['output'];
  owner: Scalars['String']['output'];
  period: Scalars['Int']['output'];
  resolver: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "Records". All fields are combined with a logical 'AND'. */
export type GQLRecords_Bool_Exp = {
  _and?: InputMaybe<Array<GQLRecords_Bool_Exp>>;
  _not?: InputMaybe<GQLRecords_Bool_Exp>;
  _or?: InputMaybe<Array<GQLRecords_Bool_Exp>>;
  db_write_timestamp?: InputMaybe<GQLTimestamp_Comparison_Exp>;
  id?: InputMaybe<GQLString_Comparison_Exp>;
  name?: InputMaybe<GQLString_Comparison_Exp>;
  name_hash?: InputMaybe<GQLString_Comparison_Exp>;
  network?: InputMaybe<GQLNetwork_Comparison_Exp>;
  owner?: InputMaybe<GQLString_Comparison_Exp>;
  period?: InputMaybe<GQLInt_Comparison_Exp>;
  resolver?: InputMaybe<GQLString_Comparison_Exp>;
  timestamp?: InputMaybe<GQLString_Comparison_Exp>;
};

/** Ordering options when selecting data from "Records". */
export type GQLRecords_Order_By = {
  db_write_timestamp?: InputMaybe<GQLOrder_By>;
  id?: InputMaybe<GQLOrder_By>;
  name?: InputMaybe<GQLOrder_By>;
  name_hash?: InputMaybe<GQLOrder_By>;
  network?: InputMaybe<GQLOrder_By>;
  owner?: InputMaybe<GQLOrder_By>;
  period?: InputMaybe<GQLOrder_By>;
  resolver?: InputMaybe<GQLOrder_By>;
  timestamp?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "Records" */
export enum GQLRecords_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  NameHash = 'name_hash',
  /** column name */
  Network = 'network',
  /** column name */
  Owner = 'owner',
  /** column name */
  Period = 'period',
  /** column name */
  Resolver = 'resolver',
  /** column name */
  Timestamp = 'timestamp'
}

/** Streaming cursor of the table "Records" */
export type GQLRecords_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLRecords_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLRecords_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_hash?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['network']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type GQLString_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "chain_metadata" */
export type GQLChain_Metadata = {
  __typename: 'chain_metadata';
  block_height: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  end_block?: Maybe<Scalars['Int']['output']>;
  first_event_block_number?: Maybe<Scalars['Int']['output']>;
  is_hyper_sync: Scalars['Boolean']['output'];
  latest_fetched_block_number: Scalars['Int']['output'];
  latest_processed_block?: Maybe<Scalars['Int']['output']>;
  num_batches_fetched: Scalars['Int']['output'];
  num_events_processed?: Maybe<Scalars['Int']['output']>;
  start_block: Scalars['Int']['output'];
  timestamp_caught_up_to_head_or_endblock?: Maybe<Scalars['timestamptz']['output']>;
};

/** Boolean expression to filter rows from the table "chain_metadata". All fields are combined with a logical 'AND'. */
export type GQLChain_Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<GQLChain_Metadata_Bool_Exp>>;
  _not?: InputMaybe<GQLChain_Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<GQLChain_Metadata_Bool_Exp>>;
  block_height?: InputMaybe<GQLInt_Comparison_Exp>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  end_block?: InputMaybe<GQLInt_Comparison_Exp>;
  first_event_block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  is_hyper_sync?: InputMaybe<GQLBoolean_Comparison_Exp>;
  latest_fetched_block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  latest_processed_block?: InputMaybe<GQLInt_Comparison_Exp>;
  num_batches_fetched?: InputMaybe<GQLInt_Comparison_Exp>;
  num_events_processed?: InputMaybe<GQLInt_Comparison_Exp>;
  start_block?: InputMaybe<GQLInt_Comparison_Exp>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<GQLTimestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "chain_metadata". */
export type GQLChain_Metadata_Order_By = {
  block_height?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  end_block?: InputMaybe<GQLOrder_By>;
  first_event_block_number?: InputMaybe<GQLOrder_By>;
  is_hyper_sync?: InputMaybe<GQLOrder_By>;
  latest_fetched_block_number?: InputMaybe<GQLOrder_By>;
  latest_processed_block?: InputMaybe<GQLOrder_By>;
  num_batches_fetched?: InputMaybe<GQLOrder_By>;
  num_events_processed?: InputMaybe<GQLOrder_By>;
  start_block?: InputMaybe<GQLOrder_By>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "chain_metadata" */
export enum GQLChain_Metadata_Select_Column {
  /** column name */
  BlockHeight = 'block_height',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EndBlock = 'end_block',
  /** column name */
  FirstEventBlockNumber = 'first_event_block_number',
  /** column name */
  IsHyperSync = 'is_hyper_sync',
  /** column name */
  LatestFetchedBlockNumber = 'latest_fetched_block_number',
  /** column name */
  LatestProcessedBlock = 'latest_processed_block',
  /** column name */
  NumBatchesFetched = 'num_batches_fetched',
  /** column name */
  NumEventsProcessed = 'num_events_processed',
  /** column name */
  StartBlock = 'start_block',
  /** column name */
  TimestampCaughtUpToHeadOrEndblock = 'timestamp_caught_up_to_head_or_endblock'
}

/** Streaming cursor of the table "chain_metadata" */
export type GQLChain_Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLChain_Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLChain_Metadata_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  end_block?: InputMaybe<Scalars['Int']['input']>;
  first_event_block_number?: InputMaybe<Scalars['Int']['input']>;
  is_hyper_sync?: InputMaybe<Scalars['Boolean']['input']>;
  latest_fetched_block_number?: InputMaybe<Scalars['Int']['input']>;
  latest_processed_block?: InputMaybe<Scalars['Int']['input']>;
  num_batches_fetched?: InputMaybe<Scalars['Int']['input']>;
  num_events_processed?: InputMaybe<Scalars['Int']['input']>;
  start_block?: InputMaybe<Scalars['Int']['input']>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Boolean expression to compare columns of type "contract_type". All fields are combined with logical 'AND'. */
export type GQLContract_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['contract_type']['input']>;
  _gt?: InputMaybe<Scalars['contract_type']['input']>;
  _gte?: InputMaybe<Scalars['contract_type']['input']>;
  _in?: InputMaybe<Array<Scalars['contract_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['contract_type']['input']>;
  _lte?: InputMaybe<Scalars['contract_type']['input']>;
  _neq?: InputMaybe<Scalars['contract_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['contract_type']['input']>>;
};

/** ordering argument of a cursor */
export enum GQLCursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "dynamic_contract_registry" */
export type GQLDynamic_Contract_Registry = {
  __typename: 'dynamic_contract_registry';
  chain_id: Scalars['Int']['output'];
  contract_address: Scalars['String']['output'];
  contract_type: Scalars['contract_type']['output'];
  registering_event_block_number: Scalars['Int']['output'];
  registering_event_block_timestamp: Scalars['Int']['output'];
  registering_event_contract_name: Scalars['String']['output'];
  registering_event_log_index: Scalars['Int']['output'];
  registering_event_name: Scalars['String']['output'];
  registering_event_src_address: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "dynamic_contract_registry". All fields are combined with a logical 'AND'. */
export type GQLDynamic_Contract_Registry_Bool_Exp = {
  _and?: InputMaybe<Array<GQLDynamic_Contract_Registry_Bool_Exp>>;
  _not?: InputMaybe<GQLDynamic_Contract_Registry_Bool_Exp>;
  _or?: InputMaybe<Array<GQLDynamic_Contract_Registry_Bool_Exp>>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  contract_address?: InputMaybe<GQLString_Comparison_Exp>;
  contract_type?: InputMaybe<GQLContract_Type_Comparison_Exp>;
  registering_event_block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  registering_event_block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  registering_event_contract_name?: InputMaybe<GQLString_Comparison_Exp>;
  registering_event_log_index?: InputMaybe<GQLInt_Comparison_Exp>;
  registering_event_name?: InputMaybe<GQLString_Comparison_Exp>;
  registering_event_src_address?: InputMaybe<GQLString_Comparison_Exp>;
};

/** Ordering options when selecting data from "dynamic_contract_registry". */
export type GQLDynamic_Contract_Registry_Order_By = {
  chain_id?: InputMaybe<GQLOrder_By>;
  contract_address?: InputMaybe<GQLOrder_By>;
  contract_type?: InputMaybe<GQLOrder_By>;
  registering_event_block_number?: InputMaybe<GQLOrder_By>;
  registering_event_block_timestamp?: InputMaybe<GQLOrder_By>;
  registering_event_contract_name?: InputMaybe<GQLOrder_By>;
  registering_event_log_index?: InputMaybe<GQLOrder_By>;
  registering_event_name?: InputMaybe<GQLOrder_By>;
  registering_event_src_address?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "dynamic_contract_registry" */
export enum GQLDynamic_Contract_Registry_Select_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractType = 'contract_type',
  /** column name */
  RegisteringEventBlockNumber = 'registering_event_block_number',
  /** column name */
  RegisteringEventBlockTimestamp = 'registering_event_block_timestamp',
  /** column name */
  RegisteringEventContractName = 'registering_event_contract_name',
  /** column name */
  RegisteringEventLogIndex = 'registering_event_log_index',
  /** column name */
  RegisteringEventName = 'registering_event_name',
  /** column name */
  RegisteringEventSrcAddress = 'registering_event_src_address'
}

/** Streaming cursor of the table "dynamic_contract_registry" */
export type GQLDynamic_Contract_Registry_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLDynamic_Contract_Registry_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLDynamic_Contract_Registry_Stream_Cursor_Value_Input = {
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_type?: InputMaybe<Scalars['contract_type']['input']>;
  registering_event_block_number?: InputMaybe<Scalars['Int']['input']>;
  registering_event_block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  registering_event_contract_name?: InputMaybe<Scalars['String']['input']>;
  registering_event_log_index?: InputMaybe<Scalars['Int']['input']>;
  registering_event_name?: InputMaybe<Scalars['String']['input']>;
  registering_event_src_address?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "end_of_block_range_scanned_data" */
export type GQLEnd_Of_Block_Range_Scanned_Data = {
  __typename: 'end_of_block_range_scanned_data';
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
};

/** Boolean expression to filter rows from the table "end_of_block_range_scanned_data". All fields are combined with a logical 'AND'. */
export type GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp = {
  _and?: InputMaybe<Array<GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp>>;
  _not?: InputMaybe<GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp>;
  _or?: InputMaybe<Array<GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp>>;
  block_hash?: InputMaybe<GQLString_Comparison_Exp>;
  block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
};

/** Ordering options when selecting data from "end_of_block_range_scanned_data". */
export type GQLEnd_Of_Block_Range_Scanned_Data_Order_By = {
  block_hash?: InputMaybe<GQLOrder_By>;
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "end_of_block_range_scanned_data" */
export enum GQLEnd_Of_Block_Range_Scanned_Data_Select_Column {
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id'
}

/** Streaming cursor of the table "end_of_block_range_scanned_data" */
export type GQLEnd_Of_Block_Range_Scanned_Data_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLEnd_Of_Block_Range_Scanned_Data_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLEnd_Of_Block_Range_Scanned_Data_Stream_Cursor_Value_Input = {
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "entity_history" */
export type GQLEntity_History = {
  __typename: 'entity_history';
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  entity_id: Scalars['String']['output'];
  entity_type: Scalars['entity_type']['output'];
  /** An object relationship */
  event?: Maybe<GQLRaw_Events>;
  log_index: Scalars['Int']['output'];
  params?: Maybe<Scalars['jsonb']['output']>;
  previous_block_number?: Maybe<Scalars['Int']['output']>;
  previous_block_timestamp?: Maybe<Scalars['Int']['output']>;
  previous_chain_id?: Maybe<Scalars['Int']['output']>;
  previous_log_index?: Maybe<Scalars['Int']['output']>;
};


/** columns and relationships of "entity_history" */
export type GQLEntity_HistoryParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "entity_history" */
export type GQLEntity_History_Aggregate_Order_By = {
  avg?: InputMaybe<GQLEntity_History_Avg_Order_By>;
  count?: InputMaybe<GQLOrder_By>;
  max?: InputMaybe<GQLEntity_History_Max_Order_By>;
  min?: InputMaybe<GQLEntity_History_Min_Order_By>;
  stddev?: InputMaybe<GQLEntity_History_Stddev_Order_By>;
  stddev_pop?: InputMaybe<GQLEntity_History_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<GQLEntity_History_Stddev_Samp_Order_By>;
  sum?: InputMaybe<GQLEntity_History_Sum_Order_By>;
  var_pop?: InputMaybe<GQLEntity_History_Var_Pop_Order_By>;
  var_samp?: InputMaybe<GQLEntity_History_Var_Samp_Order_By>;
  variance?: InputMaybe<GQLEntity_History_Variance_Order_By>;
};

/** order by avg() on columns of table "entity_history" */
export type GQLEntity_History_Avg_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** Boolean expression to filter rows from the table "entity_history". All fields are combined with a logical 'AND'. */
export type GQLEntity_History_Bool_Exp = {
  _and?: InputMaybe<Array<GQLEntity_History_Bool_Exp>>;
  _not?: InputMaybe<GQLEntity_History_Bool_Exp>;
  _or?: InputMaybe<Array<GQLEntity_History_Bool_Exp>>;
  block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  entity_id?: InputMaybe<GQLString_Comparison_Exp>;
  entity_type?: InputMaybe<GQLEntity_Type_Comparison_Exp>;
  event?: InputMaybe<GQLRaw_Events_Bool_Exp>;
  log_index?: InputMaybe<GQLInt_Comparison_Exp>;
  params?: InputMaybe<GQLJsonb_Comparison_Exp>;
  previous_block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  previous_block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  previous_chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  previous_log_index?: InputMaybe<GQLInt_Comparison_Exp>;
};

/** columns and relationships of "entity_history_filter" */
export type GQLEntity_History_Filter = {
  __typename: 'entity_history_filter';
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  entity_id: Scalars['String']['output'];
  entity_type: Scalars['entity_type']['output'];
  /** An object relationship */
  event?: Maybe<GQLRaw_Events>;
  log_index: Scalars['Int']['output'];
  new_val?: Maybe<Scalars['jsonb']['output']>;
  old_val?: Maybe<Scalars['jsonb']['output']>;
  previous_block_number?: Maybe<Scalars['Int']['output']>;
  previous_log_index: Scalars['Int']['output'];
};


/** columns and relationships of "entity_history_filter" */
export type GQLEntity_History_FilterNew_ValArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "entity_history_filter" */
export type GQLEntity_History_FilterOld_ValArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "entity_history_filter". All fields are combined with a logical 'AND'. */
export type GQLEntity_History_Filter_Bool_Exp = {
  _and?: InputMaybe<Array<GQLEntity_History_Filter_Bool_Exp>>;
  _not?: InputMaybe<GQLEntity_History_Filter_Bool_Exp>;
  _or?: InputMaybe<Array<GQLEntity_History_Filter_Bool_Exp>>;
  block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  entity_id?: InputMaybe<GQLString_Comparison_Exp>;
  entity_type?: InputMaybe<GQLEntity_Type_Comparison_Exp>;
  event?: InputMaybe<GQLRaw_Events_Bool_Exp>;
  log_index?: InputMaybe<GQLInt_Comparison_Exp>;
  new_val?: InputMaybe<GQLJsonb_Comparison_Exp>;
  old_val?: InputMaybe<GQLJsonb_Comparison_Exp>;
  previous_block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  previous_log_index?: InputMaybe<GQLInt_Comparison_Exp>;
};

/** Ordering options when selecting data from "entity_history_filter". */
export type GQLEntity_History_Filter_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  entity_id?: InputMaybe<GQLOrder_By>;
  entity_type?: InputMaybe<GQLOrder_By>;
  event?: InputMaybe<GQLRaw_Events_Order_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  new_val?: InputMaybe<GQLOrder_By>;
  old_val?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "entity_history_filter" */
export enum GQLEntity_History_Filter_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  NewVal = 'new_val',
  /** column name */
  OldVal = 'old_val',
  /** column name */
  PreviousBlockNumber = 'previous_block_number',
  /** column name */
  PreviousLogIndex = 'previous_log_index'
}

/** Streaming cursor of the table "entity_history_filter" */
export type GQLEntity_History_Filter_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLEntity_History_Filter_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLEntity_History_Filter_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_type?: InputMaybe<Scalars['entity_type']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  new_val?: InputMaybe<Scalars['jsonb']['input']>;
  old_val?: InputMaybe<Scalars['jsonb']['input']>;
  previous_block_number?: InputMaybe<Scalars['Int']['input']>;
  previous_log_index?: InputMaybe<Scalars['Int']['input']>;
};

/** order by max() on columns of table "entity_history" */
export type GQLEntity_History_Max_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  entity_id?: InputMaybe<GQLOrder_By>;
  entity_type?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** order by min() on columns of table "entity_history" */
export type GQLEntity_History_Min_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  entity_id?: InputMaybe<GQLOrder_By>;
  entity_type?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** Ordering options when selecting data from "entity_history". */
export type GQLEntity_History_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  entity_id?: InputMaybe<GQLOrder_By>;
  entity_type?: InputMaybe<GQLOrder_By>;
  event?: InputMaybe<GQLRaw_Events_Order_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  params?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "entity_history" */
export enum GQLEntity_History_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  PreviousBlockNumber = 'previous_block_number',
  /** column name */
  PreviousBlockTimestamp = 'previous_block_timestamp',
  /** column name */
  PreviousChainId = 'previous_chain_id',
  /** column name */
  PreviousLogIndex = 'previous_log_index'
}

/** order by stddev() on columns of table "entity_history" */
export type GQLEntity_History_Stddev_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** order by stddev_pop() on columns of table "entity_history" */
export type GQLEntity_History_Stddev_Pop_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** order by stddev_samp() on columns of table "entity_history" */
export type GQLEntity_History_Stddev_Samp_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** Streaming cursor of the table "entity_history" */
export type GQLEntity_History_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLEntity_History_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLEntity_History_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_type?: InputMaybe<Scalars['entity_type']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  params?: InputMaybe<Scalars['jsonb']['input']>;
  previous_block_number?: InputMaybe<Scalars['Int']['input']>;
  previous_block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  previous_chain_id?: InputMaybe<Scalars['Int']['input']>;
  previous_log_index?: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "entity_history" */
export type GQLEntity_History_Sum_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** order by var_pop() on columns of table "entity_history" */
export type GQLEntity_History_Var_Pop_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** order by var_samp() on columns of table "entity_history" */
export type GQLEntity_History_Var_Samp_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** order by variance() on columns of table "entity_history" */
export type GQLEntity_History_Variance_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  previous_block_number?: InputMaybe<GQLOrder_By>;
  previous_block_timestamp?: InputMaybe<GQLOrder_By>;
  previous_chain_id?: InputMaybe<GQLOrder_By>;
  previous_log_index?: InputMaybe<GQLOrder_By>;
};

/** Boolean expression to compare columns of type "entity_type". All fields are combined with logical 'AND'. */
export type GQLEntity_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['entity_type']['input']>;
  _gt?: InputMaybe<Scalars['entity_type']['input']>;
  _gte?: InputMaybe<Scalars['entity_type']['input']>;
  _in?: InputMaybe<Array<Scalars['entity_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['entity_type']['input']>;
  _lte?: InputMaybe<Scalars['entity_type']['input']>;
  _neq?: InputMaybe<Scalars['entity_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['entity_type']['input']>>;
};

/** columns and relationships of "event_sync_state" */
export type GQLEvent_Sync_State = {
  __typename: 'event_sync_state';
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  is_pre_registering_dynamic_contracts: Scalars['Boolean']['output'];
  log_index: Scalars['Int']['output'];
};

/** Boolean expression to filter rows from the table "event_sync_state". All fields are combined with a logical 'AND'. */
export type GQLEvent_Sync_State_Bool_Exp = {
  _and?: InputMaybe<Array<GQLEvent_Sync_State_Bool_Exp>>;
  _not?: InputMaybe<GQLEvent_Sync_State_Bool_Exp>;
  _or?: InputMaybe<Array<GQLEvent_Sync_State_Bool_Exp>>;
  block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  is_pre_registering_dynamic_contracts?: InputMaybe<GQLBoolean_Comparison_Exp>;
  log_index?: InputMaybe<GQLInt_Comparison_Exp>;
};

/** Ordering options when selecting data from "event_sync_state". */
export type GQLEvent_Sync_State_Order_By = {
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  is_pre_registering_dynamic_contracts?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "event_sync_state" */
export enum GQLEvent_Sync_State_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  IsPreRegisteringDynamicContracts = 'is_pre_registering_dynamic_contracts',
  /** column name */
  LogIndex = 'log_index'
}

/** Streaming cursor of the table "event_sync_state" */
export type GQLEvent_Sync_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLEvent_Sync_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLEvent_Sync_State_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  is_pre_registering_dynamic_contracts?: InputMaybe<Scalars['Boolean']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
};

export type GQLGet_Entity_History_Filter_Args = {
  end_block?: InputMaybe<Scalars['Int']['input']>;
  end_chain_id?: InputMaybe<Scalars['Int']['input']>;
  end_log_index?: InputMaybe<Scalars['Int']['input']>;
  end_timestamp?: InputMaybe<Scalars['Int']['input']>;
  start_block?: InputMaybe<Scalars['Int']['input']>;
  start_chain_id?: InputMaybe<Scalars['Int']['input']>;
  start_log_index?: InputMaybe<Scalars['Int']['input']>;
  start_timestamp?: InputMaybe<Scalars['Int']['input']>;
};

export type GQLJsonb_Cast_Exp = {
  String?: InputMaybe<GQLString_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type GQLJsonb_Comparison_Exp = {
  _cast?: InputMaybe<GQLJsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** Boolean expression to compare columns of type "network". All fields are combined with logical 'AND'. */
export type GQLNetwork_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['network']['input']>;
  _gt?: InputMaybe<Scalars['network']['input']>;
  _gte?: InputMaybe<Scalars['network']['input']>;
  _in?: InputMaybe<Array<Scalars['network']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['network']['input']>;
  _lte?: InputMaybe<Scalars['network']['input']>;
  _neq?: InputMaybe<Scalars['network']['input']>;
  _nin?: InputMaybe<Array<Scalars['network']['input']>>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type GQLNumeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum GQLOrder_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "persisted_state" */
export type GQLPersisted_State = {
  __typename: 'persisted_state';
  abi_files_hash: Scalars['String']['output'];
  config_hash: Scalars['String']['output'];
  envio_version: Scalars['String']['output'];
  handler_files_hash: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  schema_hash: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "persisted_state". All fields are combined with a logical 'AND'. */
export type GQLPersisted_State_Bool_Exp = {
  _and?: InputMaybe<Array<GQLPersisted_State_Bool_Exp>>;
  _not?: InputMaybe<GQLPersisted_State_Bool_Exp>;
  _or?: InputMaybe<Array<GQLPersisted_State_Bool_Exp>>;
  abi_files_hash?: InputMaybe<GQLString_Comparison_Exp>;
  config_hash?: InputMaybe<GQLString_Comparison_Exp>;
  envio_version?: InputMaybe<GQLString_Comparison_Exp>;
  handler_files_hash?: InputMaybe<GQLString_Comparison_Exp>;
  id?: InputMaybe<GQLInt_Comparison_Exp>;
  schema_hash?: InputMaybe<GQLString_Comparison_Exp>;
};

/** Ordering options when selecting data from "persisted_state". */
export type GQLPersisted_State_Order_By = {
  abi_files_hash?: InputMaybe<GQLOrder_By>;
  config_hash?: InputMaybe<GQLOrder_By>;
  envio_version?: InputMaybe<GQLOrder_By>;
  handler_files_hash?: InputMaybe<GQLOrder_By>;
  id?: InputMaybe<GQLOrder_By>;
  schema_hash?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "persisted_state" */
export enum GQLPersisted_State_Select_Column {
  /** column name */
  AbiFilesHash = 'abi_files_hash',
  /** column name */
  ConfigHash = 'config_hash',
  /** column name */
  EnvioVersion = 'envio_version',
  /** column name */
  HandlerFilesHash = 'handler_files_hash',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaHash = 'schema_hash'
}

/** Streaming cursor of the table "persisted_state" */
export type GQLPersisted_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLPersisted_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLPersisted_State_Stream_Cursor_Value_Input = {
  abi_files_hash?: InputMaybe<Scalars['String']['input']>;
  config_hash?: InputMaybe<Scalars['String']['input']>;
  envio_version?: InputMaybe<Scalars['String']['input']>;
  handler_files_hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  schema_hash?: InputMaybe<Scalars['String']['input']>;
};

export type GQLQuery_Root = {
  __typename: 'query_root';
  /** fetch data from the table: "AddressResolver" */
  AddressResolver: Array<GQLAddressResolver>;
  /** fetch data from the table: "AddressResolver" using primary key columns */
  AddressResolver_by_pk?: Maybe<GQLAddressResolver>;
  /** fetch data from the table: "Records" */
  Records: Array<GQLRecords>;
  /** fetch data from the table: "Records" using primary key columns */
  Records_by_pk?: Maybe<GQLRecords>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<GQLChain_Metadata>;
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: Maybe<GQLChain_Metadata>;
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<GQLDynamic_Contract_Registry>;
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<GQLDynamic_Contract_Registry>;
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: Array<GQLEnd_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: Maybe<GQLEnd_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "entity_history" */
  entity_history: Array<GQLEntity_History>;
  /** fetch data from the table: "entity_history" using primary key columns */
  entity_history_by_pk?: Maybe<GQLEntity_History>;
  /** fetch data from the table: "entity_history_filter" */
  entity_history_filter: Array<GQLEntity_History_Filter>;
  /** fetch data from the table: "entity_history_filter" using primary key columns */
  entity_history_filter_by_pk?: Maybe<GQLEntity_History_Filter>;
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: Array<GQLEvent_Sync_State>;
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: Maybe<GQLEvent_Sync_State>;
  /** This function helps search for articles */
  get_entity_history_filter: Array<GQLEntity_History_Filter>;
  /** fetch data from the table: "persisted_state" */
  persisted_state: Array<GQLPersisted_State>;
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: Maybe<GQLPersisted_State>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<GQLRaw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<GQLRaw_Events>;
};


export type GQLQuery_RootAddressResolverArgs = {
  distinct_on?: InputMaybe<Array<GQLAddressResolver_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLAddressResolver_Order_By>>;
  where?: InputMaybe<GQLAddressResolver_Bool_Exp>;
};


export type GQLQuery_RootAddressResolver_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type GQLQuery_RootRecordsArgs = {
  distinct_on?: InputMaybe<Array<GQLRecords_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLRecords_Order_By>>;
  where?: InputMaybe<GQLRecords_Bool_Exp>;
};


export type GQLQuery_RootRecords_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type GQLQuery_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<GQLChain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLChain_Metadata_Order_By>>;
  where?: InputMaybe<GQLChain_Metadata_Bool_Exp>;
};


export type GQLQuery_RootChain_Metadata_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type GQLQuery_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<GQLDynamic_Contract_Registry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLDynamic_Contract_Registry_Order_By>>;
  where?: InputMaybe<GQLDynamic_Contract_Registry_Bool_Exp>;
};


export type GQLQuery_RootDynamic_Contract_Registry_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  contract_address: Scalars['String']['input'];
};


export type GQLQuery_RootEnd_Of_Block_Range_Scanned_DataArgs = {
  distinct_on?: InputMaybe<Array<GQLEnd_Of_Block_Range_Scanned_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEnd_Of_Block_Range_Scanned_Data_Order_By>>;
  where?: InputMaybe<GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp>;
};


export type GQLQuery_RootEnd_Of_Block_Range_Scanned_Data_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
};


export type GQLQuery_RootEntity_HistoryArgs = {
  distinct_on?: InputMaybe<Array<GQLEntity_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Bool_Exp>;
};


export type GQLQuery_RootEntity_History_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  block_timestamp: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
  entity_id: Scalars['String']['input'];
  entity_type: Scalars['entity_type']['input'];
  log_index: Scalars['Int']['input'];
};


export type GQLQuery_RootEntity_History_FilterArgs = {
  distinct_on?: InputMaybe<Array<GQLEntity_History_Filter_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Filter_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Filter_Bool_Exp>;
};


export type GQLQuery_RootEntity_History_Filter_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  block_timestamp: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
  entity_id: Scalars['String']['input'];
  entity_type: Scalars['entity_type']['input'];
  log_index: Scalars['Int']['input'];
  previous_log_index: Scalars['Int']['input'];
};


export type GQLQuery_RootEvent_Sync_StateArgs = {
  distinct_on?: InputMaybe<Array<GQLEvent_Sync_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEvent_Sync_State_Order_By>>;
  where?: InputMaybe<GQLEvent_Sync_State_Bool_Exp>;
};


export type GQLQuery_RootEvent_Sync_State_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type GQLQuery_RootGet_Entity_History_FilterArgs = {
  args: GQLGet_Entity_History_Filter_Args;
  distinct_on?: InputMaybe<Array<GQLEntity_History_Filter_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Filter_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Filter_Bool_Exp>;
};


export type GQLQuery_RootPersisted_StateArgs = {
  distinct_on?: InputMaybe<Array<GQLPersisted_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLPersisted_State_Order_By>>;
  where?: InputMaybe<GQLPersisted_State_Bool_Exp>;
};


export type GQLQuery_RootPersisted_State_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type GQLQuery_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<GQLRaw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLRaw_Events_Order_By>>;
  where?: InputMaybe<GQLRaw_Events_Bool_Exp>;
};


export type GQLQuery_RootRaw_Events_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  event_id: Scalars['numeric']['input'];
};

/** columns and relationships of "raw_events" */
export type GQLRaw_Events = {
  __typename: 'raw_events';
  block_fields: Scalars['jsonb']['output'];
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  contract_name: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  /** An array relationship */
  event_history: Array<GQLEntity_History>;
  event_id: Scalars['numeric']['output'];
  event_name: Scalars['String']['output'];
  log_index: Scalars['Int']['output'];
  params: Scalars['jsonb']['output'];
  src_address: Scalars['String']['output'];
  transaction_fields: Scalars['jsonb']['output'];
};


/** columns and relationships of "raw_events" */
export type GQLRaw_EventsBlock_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type GQLRaw_EventsEvent_HistoryArgs = {
  distinct_on?: InputMaybe<Array<GQLEntity_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Bool_Exp>;
};


/** columns and relationships of "raw_events" */
export type GQLRaw_EventsParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type GQLRaw_EventsTransaction_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export type GQLRaw_Events_Bool_Exp = {
  _and?: InputMaybe<Array<GQLRaw_Events_Bool_Exp>>;
  _not?: InputMaybe<GQLRaw_Events_Bool_Exp>;
  _or?: InputMaybe<Array<GQLRaw_Events_Bool_Exp>>;
  block_fields?: InputMaybe<GQLJsonb_Comparison_Exp>;
  block_hash?: InputMaybe<GQLString_Comparison_Exp>;
  block_number?: InputMaybe<GQLInt_Comparison_Exp>;
  block_timestamp?: InputMaybe<GQLInt_Comparison_Exp>;
  chain_id?: InputMaybe<GQLInt_Comparison_Exp>;
  contract_name?: InputMaybe<GQLString_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<GQLTimestamp_Comparison_Exp>;
  event_history?: InputMaybe<GQLEntity_History_Bool_Exp>;
  event_id?: InputMaybe<GQLNumeric_Comparison_Exp>;
  event_name?: InputMaybe<GQLString_Comparison_Exp>;
  log_index?: InputMaybe<GQLInt_Comparison_Exp>;
  params?: InputMaybe<GQLJsonb_Comparison_Exp>;
  src_address?: InputMaybe<GQLString_Comparison_Exp>;
  transaction_fields?: InputMaybe<GQLJsonb_Comparison_Exp>;
};

/** Ordering options when selecting data from "raw_events". */
export type GQLRaw_Events_Order_By = {
  block_fields?: InputMaybe<GQLOrder_By>;
  block_hash?: InputMaybe<GQLOrder_By>;
  block_number?: InputMaybe<GQLOrder_By>;
  block_timestamp?: InputMaybe<GQLOrder_By>;
  chain_id?: InputMaybe<GQLOrder_By>;
  contract_name?: InputMaybe<GQLOrder_By>;
  db_write_timestamp?: InputMaybe<GQLOrder_By>;
  event_history_aggregate?: InputMaybe<GQLEntity_History_Aggregate_Order_By>;
  event_id?: InputMaybe<GQLOrder_By>;
  event_name?: InputMaybe<GQLOrder_By>;
  log_index?: InputMaybe<GQLOrder_By>;
  params?: InputMaybe<GQLOrder_By>;
  src_address?: InputMaybe<GQLOrder_By>;
  transaction_fields?: InputMaybe<GQLOrder_By>;
};

/** select columns of table "raw_events" */
export enum GQLRaw_Events_Select_Column {
  /** column name */
  BlockFields = 'block_fields',
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractName = 'contract_name',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventId = 'event_id',
  /** column name */
  EventName = 'event_name',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  SrcAddress = 'src_address',
  /** column name */
  TransactionFields = 'transaction_fields'
}

/** Streaming cursor of the table "raw_events" */
export type GQLRaw_Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: GQLRaw_Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<GQLCursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type GQLRaw_Events_Stream_Cursor_Value_Input = {
  block_fields?: InputMaybe<Scalars['jsonb']['input']>;
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_name?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  event_name?: InputMaybe<Scalars['String']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  params?: InputMaybe<Scalars['jsonb']['input']>;
  src_address?: InputMaybe<Scalars['String']['input']>;
  transaction_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

export type GQLSubscription_Root = {
  __typename: 'subscription_root';
  /** fetch data from the table: "AddressResolver" */
  AddressResolver: Array<GQLAddressResolver>;
  /** fetch data from the table: "AddressResolver" using primary key columns */
  AddressResolver_by_pk?: Maybe<GQLAddressResolver>;
  /** fetch data from the table in a streaming manner: "AddressResolver" */
  AddressResolver_stream: Array<GQLAddressResolver>;
  /** fetch data from the table: "Records" */
  Records: Array<GQLRecords>;
  /** fetch data from the table: "Records" using primary key columns */
  Records_by_pk?: Maybe<GQLRecords>;
  /** fetch data from the table in a streaming manner: "Records" */
  Records_stream: Array<GQLRecords>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<GQLChain_Metadata>;
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: Maybe<GQLChain_Metadata>;
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream: Array<GQLChain_Metadata>;
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<GQLDynamic_Contract_Registry>;
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<GQLDynamic_Contract_Registry>;
  /** fetch data from the table in a streaming manner: "dynamic_contract_registry" */
  dynamic_contract_registry_stream: Array<GQLDynamic_Contract_Registry>;
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: Array<GQLEnd_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: Maybe<GQLEnd_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table in a streaming manner: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data_stream: Array<GQLEnd_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "entity_history" */
  entity_history: Array<GQLEntity_History>;
  /** fetch data from the table: "entity_history" using primary key columns */
  entity_history_by_pk?: Maybe<GQLEntity_History>;
  /** fetch data from the table: "entity_history_filter" */
  entity_history_filter: Array<GQLEntity_History_Filter>;
  /** fetch data from the table: "entity_history_filter" using primary key columns */
  entity_history_filter_by_pk?: Maybe<GQLEntity_History_Filter>;
  /** fetch data from the table in a streaming manner: "entity_history_filter" */
  entity_history_filter_stream: Array<GQLEntity_History_Filter>;
  /** fetch data from the table in a streaming manner: "entity_history" */
  entity_history_stream: Array<GQLEntity_History>;
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: Array<GQLEvent_Sync_State>;
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: Maybe<GQLEvent_Sync_State>;
  /** fetch data from the table in a streaming manner: "event_sync_state" */
  event_sync_state_stream: Array<GQLEvent_Sync_State>;
  /** This function helps search for articles */
  get_entity_history_filter: Array<GQLEntity_History_Filter>;
  /** fetch data from the table: "persisted_state" */
  persisted_state: Array<GQLPersisted_State>;
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: Maybe<GQLPersisted_State>;
  /** fetch data from the table in a streaming manner: "persisted_state" */
  persisted_state_stream: Array<GQLPersisted_State>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<GQLRaw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<GQLRaw_Events>;
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: Array<GQLRaw_Events>;
};


export type GQLSubscription_RootAddressResolverArgs = {
  distinct_on?: InputMaybe<Array<GQLAddressResolver_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLAddressResolver_Order_By>>;
  where?: InputMaybe<GQLAddressResolver_Bool_Exp>;
};


export type GQLSubscription_RootAddressResolver_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type GQLSubscription_RootAddressResolver_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLAddressResolver_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLAddressResolver_Bool_Exp>;
};


export type GQLSubscription_RootRecordsArgs = {
  distinct_on?: InputMaybe<Array<GQLRecords_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLRecords_Order_By>>;
  where?: InputMaybe<GQLRecords_Bool_Exp>;
};


export type GQLSubscription_RootRecords_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type GQLSubscription_RootRecords_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLRecords_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLRecords_Bool_Exp>;
};


export type GQLSubscription_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<GQLChain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLChain_Metadata_Order_By>>;
  where?: InputMaybe<GQLChain_Metadata_Bool_Exp>;
};


export type GQLSubscription_RootChain_Metadata_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type GQLSubscription_RootChain_Metadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLChain_Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLChain_Metadata_Bool_Exp>;
};


export type GQLSubscription_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<GQLDynamic_Contract_Registry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLDynamic_Contract_Registry_Order_By>>;
  where?: InputMaybe<GQLDynamic_Contract_Registry_Bool_Exp>;
};


export type GQLSubscription_RootDynamic_Contract_Registry_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  contract_address: Scalars['String']['input'];
};


export type GQLSubscription_RootDynamic_Contract_Registry_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLDynamic_Contract_Registry_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLDynamic_Contract_Registry_Bool_Exp>;
};


export type GQLSubscription_RootEnd_Of_Block_Range_Scanned_DataArgs = {
  distinct_on?: InputMaybe<Array<GQLEnd_Of_Block_Range_Scanned_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEnd_Of_Block_Range_Scanned_Data_Order_By>>;
  where?: InputMaybe<GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp>;
};


export type GQLSubscription_RootEnd_Of_Block_Range_Scanned_Data_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
};


export type GQLSubscription_RootEnd_Of_Block_Range_Scanned_Data_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLEnd_Of_Block_Range_Scanned_Data_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLEnd_Of_Block_Range_Scanned_Data_Bool_Exp>;
};


export type GQLSubscription_RootEntity_HistoryArgs = {
  distinct_on?: InputMaybe<Array<GQLEntity_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Bool_Exp>;
};


export type GQLSubscription_RootEntity_History_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  block_timestamp: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
  entity_id: Scalars['String']['input'];
  entity_type: Scalars['entity_type']['input'];
  log_index: Scalars['Int']['input'];
};


export type GQLSubscription_RootEntity_History_FilterArgs = {
  distinct_on?: InputMaybe<Array<GQLEntity_History_Filter_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Filter_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Filter_Bool_Exp>;
};


export type GQLSubscription_RootEntity_History_Filter_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  block_timestamp: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
  entity_id: Scalars['String']['input'];
  entity_type: Scalars['entity_type']['input'];
  log_index: Scalars['Int']['input'];
  previous_log_index: Scalars['Int']['input'];
};


export type GQLSubscription_RootEntity_History_Filter_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLEntity_History_Filter_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLEntity_History_Filter_Bool_Exp>;
};


export type GQLSubscription_RootEntity_History_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLEntity_History_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLEntity_History_Bool_Exp>;
};


export type GQLSubscription_RootEvent_Sync_StateArgs = {
  distinct_on?: InputMaybe<Array<GQLEvent_Sync_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEvent_Sync_State_Order_By>>;
  where?: InputMaybe<GQLEvent_Sync_State_Bool_Exp>;
};


export type GQLSubscription_RootEvent_Sync_State_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type GQLSubscription_RootEvent_Sync_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLEvent_Sync_State_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLEvent_Sync_State_Bool_Exp>;
};


export type GQLSubscription_RootGet_Entity_History_FilterArgs = {
  args: GQLGet_Entity_History_Filter_Args;
  distinct_on?: InputMaybe<Array<GQLEntity_History_Filter_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLEntity_History_Filter_Order_By>>;
  where?: InputMaybe<GQLEntity_History_Filter_Bool_Exp>;
};


export type GQLSubscription_RootPersisted_StateArgs = {
  distinct_on?: InputMaybe<Array<GQLPersisted_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLPersisted_State_Order_By>>;
  where?: InputMaybe<GQLPersisted_State_Bool_Exp>;
};


export type GQLSubscription_RootPersisted_State_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type GQLSubscription_RootPersisted_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLPersisted_State_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLPersisted_State_Bool_Exp>;
};


export type GQLSubscription_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<GQLRaw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GQLRaw_Events_Order_By>>;
  where?: InputMaybe<GQLRaw_Events_Bool_Exp>;
};


export type GQLSubscription_RootRaw_Events_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
  event_id: Scalars['numeric']['input'];
};


export type GQLSubscription_RootRaw_Events_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<GQLRaw_Events_Stream_Cursor_Input>>;
  where?: InputMaybe<GQLRaw_Events_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type GQLTimestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type GQLTimestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

export type GQLNameQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['network']['input']>;
}>;


export type GQLNameQuery = { __typename: 'query_root', Records: Array<{ __typename: 'Records', name: string }> };

export type GQLNamesQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  network?: InputMaybe<Scalars['network']['input']>;
}>;


export type GQLNamesQuery = { __typename: 'query_root', Records: Array<{ __typename: 'Records', name: string, resolver: string }> };

export type GQLOwnerQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['network']['input']>;
}>;


export type GQLOwnerQuery = { __typename: 'query_root', Records: Array<{ __typename: 'Records', owner: string }> };

export type GQLGet_Primary_HandleQueryVariables = Exact<{
  resolver: Scalars['String']['input'];
}>;


export type GQLGet_Primary_HandleQuery = { __typename: 'query_root', AddressResolver: Array<{ __typename: 'AddressResolver', name: string }> };

export type GQLRecordsQueryVariables = Exact<{
  owner?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['network']['input']>;
}>;


export type GQLRecordsQuery = { __typename: 'query_root', Records: Array<{ __typename: 'Records', id: string, name: string, owner: string, resolver: string, name_hash: string, timestamp: string, period: number }> };

export type GQLResolverQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['network']['input']>;
}>;


export type GQLResolverQuery = { __typename: 'query_root', Records: Array<{ __typename: 'Records', resolver: string }> };


export const NameDocument = gql`
    query name($address: String, $network: network) {
  Records(limit: 1, where: {resolver: {_eq: $address}, network: {_eq: $network}}) {
    name
  }
}
    `;
export const NamesDocument = gql`
    query names($addresses: [String!], $network: network) {
  Records(
    where: {network: {_eq: $network}, _and: {resolver: {_in: $addresses}}}
    distinct_on: [resolver]
  ) {
    name
    resolver
  }
}
    `;
export const OwnerDocument = gql`
    query owner($name: String, $network: network) {
  Records(limit: 1, where: {name: {_eq: $name}, network: {_eq: $network}}) {
    owner
  }
}
    `;
export const Get_Primary_HandleDocument = gql`
    query get_primary_handle($resolver: String!) {
  AddressResolver(where: {resolver: {_eq: $resolver}}) {
    name
  }
}
    `;
export const RecordsDocument = gql`
    query records($owner: String, $network: network) {
  Records(where: {owner: {_eq: $owner}, network: {_eq: $network}}) {
    id
    name
    owner
    resolver
    name_hash
    timestamp
    period
  }
}
    `;
export const ResolverDocument = gql`
    query resolver($name: String, $network: network) {
  Records(limit: 1, where: {name: {_eq: $name}, network: {_eq: $network}}) {
    resolver
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const NameDocumentString = print(NameDocument);
const NamesDocumentString = print(NamesDocument);
const OwnerDocumentString = print(OwnerDocument);
const Get_Primary_HandleDocumentString = print(Get_Primary_HandleDocument);
const RecordsDocumentString = print(RecordsDocument);
const ResolverDocumentString = print(ResolverDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    name(variables?: GQLNameQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLNameQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLNameQuery>(NameDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'name', 'query', variables);
    },
    names(variables?: GQLNamesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLNamesQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLNamesQuery>(NamesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'names', 'query', variables);
    },
    owner(variables?: GQLOwnerQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLOwnerQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLOwnerQuery>(OwnerDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'owner', 'query', variables);
    },
    get_primary_handle(variables: GQLGet_Primary_HandleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLGet_Primary_HandleQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLGet_Primary_HandleQuery>(Get_Primary_HandleDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'get_primary_handle', 'query', variables);
    },
    records(variables?: GQLRecordsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLRecordsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLRecordsQuery>(RecordsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'records', 'query', variables);
    },
    resolver(variables?: GQLResolverQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLResolverQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLResolverQuery>(ResolverDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'resolver', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;