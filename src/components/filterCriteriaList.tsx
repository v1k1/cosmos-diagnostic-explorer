import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  Paper,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { DataType, FilterCriteria } from './diagnostic-app';
import FilterData from './filter-data';
import FilterComponent from './filter-form';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Fab } from '@mui/material';


const FilterCriteriaList: React.FC<{ allOptions: Array<{ path: string; type: DataType; enumValues?: string[] }>, onAddFilter: (criteria: FilterCriteria) => void }> = ({
  allOptions,
  onAddFilter,
}) => {
  const [filterCriteriaList, setFilterCriteriaList] = useState<FilterCriteria[]>([]);

  const handleAddFilter = (filterCriteria: FilterCriteria) => {
    setFilterCriteriaList([...filterCriteriaList, filterCriteria]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilterCriteriaList(filterCriteriaList.filter((_, i) => i !== index));
  };

  console.log('filterCriteriaList', filterCriteriaList);
  return (
    <Grid spacing={2} item xs={12}>
      <Typography variant="h5">Filter Criteria</Typography>
      <FilterComponent allOptions={allOptions} onAddFilter={handleAddFilter} />
      <Grid container xs={12}>
        {/* <Grid item xs={8}>
          {filterCriteriaList.map((criteria, index) => (
            <Box key={index} display="flex" alignItems="center">
              <Typography>
                {criteria.path} {criteria.operator} {criteria.value}
              </Typography>
              <Box mt={2}>
                <Fab color="primary" size="small" aria-label="add">
                  <RemoveIcon onClick={() => handleRemoveFilter(index)} />
                </Fab>
              </Box>
            </Box>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" onClick={e => onAddFilter(filterCriteriaList[0])}>
            Apply Filter
          </Button>
        </Grid> */}
        <Grid item xs={12} style={{ height: '200px' }}>

                  <Typography variant="h5">Generated Criteria</Typography>
          <Paper style={{ height: '100%', display: 'flex' }}>
            {/* Left side (80% width) */}
            <Grid item xs={8} style={{ padding: '16px' }}>
              {filterCriteriaList.map((criteria, index) => (
                <Box key={index} display="flex" justifyContent="space-between" width="100%">
                  <Typography variant="body1">
                    {criteria.path} {criteria.operator} {criteria.value}
                  </Typography>
                    <Fab color="primary" size="small" aria-label="add">
                      <RemoveOutlinedIcon onClick={() => handleRemoveFilter(index)} />
                    </Fab>
                </Box>
              ))}
            </Grid>
            {/* Right side (20% width) */}
            <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
              <Button variant="contained" onClick={e => onAddFilter(filterCriteriaList[0])} color="primary">
                Apply Filter
              </Button>
            </Grid>
          </Paper>
        </Grid>

      </Grid>

    </Grid>
  );
};

export default FilterCriteriaList;





