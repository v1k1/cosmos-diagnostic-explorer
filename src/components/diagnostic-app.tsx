import React, { useState } from 'react';
// import FilterComponent from './FilterComponent';
// import SelectedItemComponent from './SelectedItemComponent';
import { Grid, Paper } from '@mui/material';
import TreeViewComponent from './tree-view';
import { DiagnosticNode, DiagnosticNodeType, MetadataLookUpType, OperationType, ResourceType } from '../api/Diagnostics';
import SelectedItemComponent from './selected-item-component';
import FilterCriteriaList from './filterCriteriaList';
import JsonTextArea from './json-text-area';

type MakePropertiesMandatory<T> = {
  [K in keyof T]-?: T[K] extends object ? MakePropertiesMandatory<T[K]> : T[K];
};

const childNode2: DiagnosticNode = {
  id: '3',
  nodeType: DiagnosticNodeType.HTTP_REQUEST,
  children: [],
  data: {},
  startTimeUTCInMs: 0,
  durationInMs: 0
}

const childNode1: DiagnosticNode = {
  id: '2',
  nodeType: DiagnosticNodeType.REQUEST_ATTEMPTS,
  children: [childNode2],
  data: { failure: true },
  startTimeUTCInMs: 0,
  durationInMs: 0
}

const root: DiagnosticNode = {
  id: '1',
  nodeType: DiagnosticNodeType.REQUEST_ATTEMPTS,
  children: [childNode1],
  data: { failure: true },
  startTimeUTCInMs: 0,
  durationInMs: 0
}

const node: MakePropertiesMandatory<DiagnosticNode> = {
  id: '1',
  nodeType: DiagnosticNodeType.CLIENT_REQUEST_NODE,
  children: [],
  data: {
    selectedLocation: "",
    activityId: "",
    requestAttempNumber: 1,
    requestPayloadLengthInBytes: 1,
    responsePayloadLengthInBytes: 1,
    responseStatus: 1,
    readFromCache: false,
    operationType: OperationType.Delete,
    metadatOperationType: MetadataLookUpType.DatabaseAccountLookUp,
    resourceType: ResourceType.conflicts,
    failedAttempty: false,
    successfulRetryPolicy: "",
    partitionKeyRangeId: "",
    stateful: false,
    queryRecordsRead: 1,
    queryMethodIdentifier: "",
    log: [""],
    failure: false,
    requestData: {
      requestPayloadLengthInBytes: 1,
      operationType: OperationType.Batch,
      resourceType: ResourceType.conflicts,
      headers: {},
      body: {},
      url: "",
    },
    responseData: {
      responsePayloadLengthInBytes: 1,
      headers: {},
      responseStatus: 2,
      body: {}
    }
  },
  startTimeUTCInMs: 0,
  durationInMs: 0
}

type EnumTypes = {
  [key: string]: { [key: string]: number | string };
};

export type DataType = 'string' | 'number' | 'boolean' | 'object' | 'enum';

function getPropertyPathsAndTypes<T>(
  obj: T,
  enumTypes: EnumTypes,
  currentPath = '',
  properties: Array<{ path: string; type: DataType; enumValues?: string[] }> = []
): Array<{ path: string; type: DataType; enumValues?: string[] }> {
  for (const key in obj) {
    const path = currentPath ? `${currentPath}.${key}` : key;
    if (enumTypes[key]) {
      properties.push({ path, type: 'enum', enumValues: Object.values(enumTypes[key]).map((enumValue: any) => enumValue.toString()) });
    } else {
      const value = obj[key];

      let dataType: DataType;
      let enumValues: string[] | undefined;

      if (typeof value === 'string') {
        dataType = 'string';
      } else if (typeof value === 'number') {
        dataType = 'number';
      } else if (typeof value === 'boolean') {
        dataType = 'boolean';
      } else if (typeof value === 'object' && value !== null && Array.isArray(value)) {
        dataType = 'object';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
        dataType = 'object';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if the property is an enum
        const enumType = enumTypes[key];
        if (enumType && Object.values(enumType).includes(value as any)) {
          dataType = 'enum';
          enumValues = Object.values(enumType).map((enumValue) => enumValue.toString());
        } else {
          dataType = 'object';
        }
      } else {
        dataType = 'object';
      }

      properties.push({ path, type: dataType, enumValues });

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        getPropertyPathsAndTypes(value, enumTypes, path, properties);
      }
    }
  }
  return properties;
}


function parse(node: DiagnosticNode): Map<string, DiagnosticNode> {
  const map = new Map();
  dfs(map, node);
  return map;
}



function dfs(map: Map<string, DiagnosticNode>, node: DiagnosticNode) {
  map.set(node.id, node);
  if (node.children) node.children.forEach(x => dfs(map, x));
}

const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const areNestedPropertiesMatched = (node: DiagnosticNode, filterCriteria: Partial<DiagnosticNode>): boolean => {
  return Object.entries(filterCriteria).every(([key, value]) => {
    if (isObject(value)) {
      if (!isObject(node[key as keyof DiagnosticNode])) {
        return false;
      }
      return areNestedPropertiesMatched(node[key as keyof DiagnosticNode] as DiagnosticNode, value as Partial<DiagnosticNode>);
    } else {
      return node[key as keyof DiagnosticNode] === value;
    }
  });
};

export type FilterCriteria = {
    path: string,
    type: DataType;
    operator: 'eq' | 'gt' | 'lt';
    value: string | number | boolean;

};



// function filterTree(tree: DiagnosticNode[], filterCriteria: FilterCriteria): DiagnosticNode[] {
//   return tree.filter((node) => {
//     const data = node.data as DiagnosticDataValue;

//     // Check if all the filter criteria match for the current node's data
//     for (const key in filterCriteria) {
//       const filter = filterCriteria[key];
//       const propertyValue = getPropertyByPath(data, key);

//       if (propertyValue === undefined) {
//         // Property not found, return false for the current node
//         return false;
//       }

//       switch (filter.operator) {
//         case 'eq':
//           if (propertyValue !== filter.value) {
//             return false;
//           }
//           break;
//         case 'gt':
//           if (typeof propertyValue !== 'number' || propertyValue <= filter.value) {
//             return false;
//           }
//           break;
//         case 'lt':
//           if (typeof propertyValue !== 'number' || propertyValue >= filter.value) {
//             return false;
//           }
//           break;
//       }
//     }

//     // If all filter criteria passed, check the children nodes recursively
//     node.children = filterTree(node.children, filterCriteria);
//     return true;
//   });
// }


function satisfiesCriteria(data: DiagnosticNode, criteria: FilterCriteria): boolean {
  const { path, type, operator, value } = criteria;
  const pathSegments = path.split('.');
  let currentValue: any = data;

  for (const segment of pathSegments) {
    if (!currentValue.hasOwnProperty(segment)) {
      return false; // Property not present in the data, filter not applicable
    }
    currentValue = currentValue[segment];
  }

  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      switch (operator) {
        case 'eq':
          return currentValue === value;
        case 'gt':
          return currentValue > value;
        case 'lt':
          return currentValue < value;
        default:
          return false;
      }
    case 'enum':
      switch (operator) {
        case 'eq':
          return currentValue.toString() === value.toString();
        default:
          return false;
      }
    default:
      return false;
  }
}

function filterGraph(filterCriteria: FilterCriteria, node?: DiagnosticNode): DiagnosticNode | undefined {
  if(!node || !filterCriteria) return undefined;
  console.log(`applying filter criteria`, filterCriteria);
  const copy: DiagnosticNode = {
    nodeType: DiagnosticNodeType.CLIENT_REQUEST_NODE,
    startTimeUTCInMs: 0,
    durationInMs: 0,
    children: [],
    id: 'copy',
    data: {}
  }
  return filterDfs(node, filterCriteria);
}

function filterDfs(node: DiagnosticNode, filterCriteria: FilterCriteria): DiagnosticNode | undefined {
  let childMatch: DiagnosticNode[] = [];
  if (node.children) {
    node.children.forEach(child => {
      let matched = filterDfs(child, filterCriteria);
      if (matched) {
        childMatch.push(matched);
      }
    })
  }
  if (childMatch.length > 0) {
    const { ["children"]: deletedProperty, ...clonedObject } = node;
    console.log(`node matched: ${node.id}`);
    return {
      ...clonedObject,
      children: childMatch
    }
  }
  if (satisfiesCriteria(node, filterCriteria)) {
    const { ["children"]: deletedProperty, ...clonedObject } = node;
    console.log(`node matched: ${node.id}`);
    return {
      ...clonedObject,
      children: childMatch
    }
  }
  console.log(`node not matched: ${node.id}`);
  return undefined;
}

const parsed = parse(root);
console.log(parsed);

const enumTypes: EnumTypes = {
  operationType: OperationType,
  resourceType: ResourceType,
  metadatOperationType: MetadataLookUpType,
  nodeType: DiagnosticNodeType
};

const propertiesPathAndTypes = getPropertyPathsAndTypes(node, enumTypes);
console.log("getPropertyPathsAndTypes", getPropertyPathsAndTypes(node, enumTypes))

const DiagnosticApp = () => {
  // State to store the selected item from the tree view
  const [selectedItem, setSelectedItem] = useState<DiagnosticNode | null>(null);
  const [originalGraph, setOriginalGraph] = useState<DiagnosticNode | undefined>(undefined);
  const [graph, setGraph] = useState<DiagnosticNode | undefined>(root);
  const [map, setMap] = useState<Map<string, DiagnosticNode>>(new Map());
  console.log(`selected`, selectedItem);
  // Sample tree data (you can replace this with your actual tree data)


  function onUpdateJson(json: string) {
    let parsed = JSON.parse(json);
    console.log('parsed', parsed);
    setOriginalGraph(parsed);
    setGraph(parsed);
    setMap(parse(parsed));
  }

  function onFilter(filterCriteria: FilterCriteria): void {
    setGraph(filterGraph(filterCriteria, originalGraph))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Paper style={{ height: '100%', overflow: 'auto' }}>
          {/* Tree View Component */}
          <JsonTextArea onUpdateJson={onUpdateJson}/>
          <TreeViewComponent node={graph} map={map} onSelectItem={setSelectedItem} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              {/* Filter Component */}
              <FilterCriteriaList allOptions={propertiesPathAndTypes} onAddFilter={onFilter}/>
              {/* <FilterCriteriaList allOptions={propertiesPathAndTypes} onAddFilter={onFilter} /> */}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ flex: 1 }}>
              {/* Selected Item Component */}
              <SelectedItemComponent selectedItem={selectedItem} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DiagnosticApp;
