export interface CosmosHeaders {
    [key: string]: any;
  }

export enum OperationType {
    Create = "create",
    Replace = "replace",
    Upsert = "upsert",
    Delete = "delete",
    Read = "read",
    Query = "query",
    Execute = "execute",
    Batch = "batch",
    Patch = "patch",
  }

  export enum MetadataLookUpType {
    PartitionKeyRangeLookUp = "PARTITION_KEY_RANGE_LOOK_UP",
    ServiceEndpointResolution = "SERVICE_ENDPOINT_RESOLUTION",
    DatabaseAccountLookUp = "DATABASE_ACCOUNT_LOOK_UP",
    QueryDataCall = "QUERY_DATA_CALL",
  }

  export enum ResourceType {
    none = "",
    database = "dbs",
    offer = "offers",
    user = "users",
    permission = "permissions",
    container = "colls",
    conflicts = "conflicts",
    sproc = "sprocs",
    udf = "udfs",
    trigger = "triggers",
    item = "docs",
    pkranges = "pkranges",
    partitionkey = "partitionKey",
  }

export type DiagnosticDataValue = {
    selectedLocation: string;
    activityId: string;
    requestAttempNumber: number;
    requestPayloadLengthInBytes: number;
    responsePayloadLengthInBytes: number;
    responseStatus: number;
    readFromCache: boolean;
    operationType: OperationType;
    metadatOperationType: MetadataLookUpType;
    resourceType: ResourceType;
    failedAttempty: boolean;
    successfulRetryPolicy: string;
    partitionKeyRangeId: string;
    stateful: boolean;
    queryRecordsRead: number;
    queryMethodIdentifier: string;
    log: string[];
    failure: boolean;
    requestData: Partial<{
      requestPayloadLengthInBytes: number,
      operationType: OperationType;
      resourceType: ResourceType;
      headers: CosmosHeaders
      body: any,
      url: string
    }>,
    responseData: Partial<{
      responsePayloadLengthInBytes: number,
      headers: CosmosHeaders,
      responseStatus: number;
      body: any
    }>
  };
  
  export interface DiagnosticNode {
    id: string,
    nodeType: DiagnosticNodeType;
    children: DiagnosticNode[];
    data: Partial<DiagnosticDataValue>;
    startTimeUTCInMs: number;
    durationInMs: number;
  }
  
  export enum DiagnosticNodeType {
    CLIENT_REQUEST_NODE = "CLIENT_REQUEST_NODE", //Top most node representing client operations.
    METADATA_REQUEST_NODE = "METADATA_REQUEST_NODE", //Node representing a metadata request.
    HTTP_REQUEST = "HTTP_REQUEST",
    BATCH_REQUEST = "BATCH_REQUEST",
    PARALLEL_QUERY_NODE = "PARALLEL_QUERY_NODE",
    DEFAULT_QUERY_NODE = "DEFAULT_QUERY_NODE",
    QUERY_REPAIR_NODE = "QUERY_REPAIR_NODE",
    BACKGROUND_REFRESH_THREAD = "BACKGROUND_REFRESH_THREAD",
    REQUEST_ATTEMPTS = "REQUEST_ATTEMPTS",
  }