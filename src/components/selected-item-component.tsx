import React from 'react';
import { Paper, Typography } from '@mui/material';
import { DiagnosticNode } from '../api/Diagnostics';


interface SelectedItemComponentProps {
  selectedItem: DiagnosticNode | null;
}

const SelectedItemComponent: React.FC<SelectedItemComponentProps> = ({ selectedItem }) => {
    console.log(`inside selected`, selectedItem);
    let item = {...selectedItem};
    item.children = undefined
  return (
    <div>
      <Typography variant="h6">Selected Item</Typography>
      {selectedItem ? (
        <div>
          {/* Implement your selected item display logic here */}
          <Typography>{selectedItem.nodeType}</Typography>
          <Paper style={{ padding: 16, whiteSpace: 'pre-wrap', textAlign: 'left', }}>
            <Typography variant="body1">{JSON.stringify(item, null, 2)}</Typography>
        </Paper>
        </div>
      ) : (
        <Typography>No item selected</Typography>
      )}
    </div>
  );
};

export default SelectedItemComponent;
