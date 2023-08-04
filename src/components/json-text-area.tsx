import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';


const JsonTextArea = (props: {onUpdateJson: (json: string) => void;}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedValue, setParsedValue] = useState(null);

  const handleJsonInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJsonInput(event.target.value);
  };

  const handleParseJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setParsedValue(parsedJson);
      props.onUpdateJson(jsonInput);
      setJsonInput(JSON.stringify(parsedJson, null, 2))
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setParsedValue(null);
    }
  };

  return (
    <Box>
      <TextField
        label="JSON Input"
        multiline
        rows={10}
        variant="outlined"
        value={jsonInput}
        onChange={handleJsonInputChange}
        fullWidth
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleParseJson}>
          Parse JSON
        </Button>
      </Box>
      {parsedValue && (
        <Box mt={2}>
          <Typography variant="h6">Parsed Value:</Typography>
          {/* <pre>{JSON.stringify(parsedValue, null, 2)}</pre> */}
        </Box>
      )}
    </Box>
  );
};

export default JsonTextArea;
