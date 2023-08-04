import React, { ReactNode, useState } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, Box, Paper, Grid, SelectChangeEvent } from '@mui/material';
import { DiagnosticDataValue, DiagnosticNode, DiagnosticNodeType } from '../api/Diagnostics';
import { DataType, FilterCriteria } from './diagnostic-app';
import FilterData from './filter-data';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FilterComponent: React.FC<{ allOptions: Array<{ path: string; type: DataType; enumValues?: string[] }>, onAddFilter: (criteria: FilterCriteria) => void }> = ({
    allOptions,
        onAddFilter,
})  => {
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
    const [nodeTypeCriteria, setNodeTypeCritera] = useState<FilterCriteria>();

    const handleFilterSubmit = () => {
        // Call the onFilter prop with the filter criteria to trigger filtering
        if(nodeTypeCriteria) {
            onAddFilter(nodeTypeCriteria);
        }
    };

    const handleTypeChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        setNodeTypeCritera({     
            path: 'nodeType',
            type: 'enum',
            operator: 'eq',
            value: event.target.value
        });
    };
    const handleStartingTimeChange = (event: SelectChangeEvent<number>, child: ReactNode) => {
        setFilterCriteria((prevCriteria) => ({ ...prevCriteria, type: event.target.value as number }));
    };

    const dataProperties = Object.keys({} as DiagnosticDataValue);
    console.log("dataProperties", dataProperties);
    return (
        <Paper style={{ padding: 16 }}>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Select
                        name="type"
                        label="Type"
                        variant="outlined"
                        fullWidth
                        value={`${nodeTypeCriteria?.value}` || ''}
                        onChange={handleTypeChange}
                    >
                        {Object.values(DiagnosticNodeType).map((type) => (
                            <MenuItem key={`${type}`} value={`${type}`}>{`${type}`}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid xs={2}>
                <Box mt={2}>
                    <Fab color="primary" size="small" aria-label="add">
                        <AddIcon onClick={handleFilterSubmit} />
                    </Fab>
                </Box>
                </Grid>
                <FilterData allOptions={allOptions} onAddFilter={onAddFilter}/>
                {/* <Grid item xs={12} sm={6}>
                    <TextField
                        name="startTimeUTCInMs"
                        type="number"
                        label="Start Time (UTC in ms)"
                        variant="outlined"
                        fullWidth
                        value={filterCriteria.startTimeUTCInMs}
                        onChange={handleStartingTimeChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="durationInMs"
                        type="number"
                        label="Duration (in ms)"
                        variant="outlined"
                        fullWidth
                        value={filterCriteria.durationInMs}
                        onChange={handleFilterChange}
                    />
                </Grid> */}
            </Grid>
        </Paper>
    );
};

export default FilterComponent;