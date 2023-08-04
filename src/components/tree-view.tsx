import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { DiagnosticNode } from '../api/Diagnostics';
import { TableCell, TableRow, Typography, colors } from '@mui/material';

// Example complex object to show in each tree node
const complexObject = {
  name: 'Node 1',
  description: 'This is a complex object to show in the tree node',
  status: 'Active',
  // Add other properties as needed
};

const useStyles = {
  customTreeItem: {
    height: '10px', // Adjust the height as per your requirement
  },
};

const TreeViewComponent = (props: {node?: DiagnosticNode, map: Map<string, DiagnosticNode>, onSelectItem: (item: DiagnosticNode) => void;}) => {
  console.log(`rendering tree`, props.node);
  const renderTree = (node: DiagnosticNode) => (
    <TreeItem key={node.id} nodeId={node.id} label={customNode(node)}>
      {node.children.length !== 0
        ? node.children.map((x) => renderTree(x))
        : null}
    </TreeItem>
  );

  const customNode = (node: DiagnosticNode) => {
    const color = node.data?.failure ? 'red' : 'green';
    return (
        <TableRow style={{background: color}}>
            {/* Replace these with your table header column names */}
            <TableCell style={{ width: 200, padding: 0}}>{node.nodeType}</TableCell>
            <TableCell style={{ width: 200, padding: 0}}>{new Date(node.startTimeUTCInMs) .toDateString()}</TableCell>
            <TableCell style={{ width: 100, padding: 0}}>{node.durationInMs} ms</TableCell>
            {/* Add more TableCell elements for other columns */}
        </TableRow>
    );
  }
    
  const handleChange = async (event: any, node: any) => {
    const selected = props.map.get(node)
    if(selected) props.onSelectItem(selected);
    console.log('nodeId: ', node)
  }

  return (
    props.node ? 
    <TreeView
      defaultCollapseIcon={<span>-</span>}
      defaultExpandIcon={<span>+</span>}
      defaultEndIcon={<span>•</span>}
      onNodeSelect={handleChange}
    >
      {renderTree(props.node)}
      {/* Add other TreeItems as needed */}
    </TreeView>
    : <Typography>No Results</Typography>
  );
};

export default TreeViewComponent;
