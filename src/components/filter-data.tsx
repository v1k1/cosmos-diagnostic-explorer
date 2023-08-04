import React, { ReactNode, useState } from 'react';
import { TextField, Select, MenuItem, Button, Paper, Grid, SelectChangeEvent, Box, Switch, Typography } from '@mui/material';
import { DiagnosticNode } from '../api/Diagnostics';
import { DataType, FilterCriteria } from './diagnostic-app';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface FilterComponentProps {
    onFilter: (filterCriteria: Partial<DiagnosticNode>) => void;
}

const FilterData: React.FC<{ allOptions: Array<{ path: string; type: DataType; enumValues?: string[] }>, onAddFilter: (criteria: FilterCriteria) => void }> = ({
    allOptions,
    onAddFilter,
}) => {
    const [selectedPath, setSelectedPath] = useState('');
    const [selectionOption, setSelectionOption] = useState<{ path: string; type: DataType; enumValues?: string[] }>();
    const [selectedDataType, setSelectedDataType] = useState<DataType>('string');
    const [operator, setOperator] = useState<'eq' | 'gt' | 'lt'>('eq');
    const [value, setValue] = useState<string | number | boolean>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const filterCriteria: FilterCriteria = {
            path: selectedPath,
            type: selectedDataType,
            operator,
            value:
                selectedDataType === 'number'
                    ? parseFloat(value as string)
                    : selectedDataType === 'boolean'
                        ? Boolean(value)
                        : value,
        };
        console.log(`submitting form`)
        onAddFilter(filterCriteria);
        setSelectedPath('');
        setSelectedDataType('string');
        setValue('');
    };

    const handleChangePath = (event: SelectChangeEvent<string>, child: ReactNode) => {
        setSelectedPath(event.target.value as string);
        const selected = allOptions.filter(z => z.path === event.target.value);
        setSelectionOption(selected[0])
        console.log(`selected`, selected[0])
        setSelectedDataType(selected[0].type); // Reset data type when changing path
        setValue(''); // Reset value when changing path
    };

    const handleChangeDataType = (event: SelectChangeEvent<"string" | "number" | "boolean" | "object" | "enum">, child: ReactNode) => {
        setSelectedDataType(event.target.value as DataType);
        setValue(''); // Reset value when changing data type
    };

    const isValueEnabled = selectedPath;

    return (
        //   <form onSubmit={handleSubmit}>
        // <Paper style={{ padding: 16 }}>
            <>
                <Grid item xs={5}>
                    <Select
                        name="type"
                        label="Path"
                        variant="outlined"
                        fullWidth
                        value={selectedPath}
                        onChange={handleChangePath}
                    >
                        {allOptions.map((option) => (
                            <MenuItem key={option.path} value={option.path}>
                                {option.path}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={5}>
                    {(
                        selectionOption?.type === 'boolean'
                            ? <Box mt={2} display="flex" alignItems="center">
                                <Switch
                                    checked={value === true}
                                    onChange={(e) => setValue(e.target.checked)}
                                    color="primary"
                                />
                                <Typography>{value ? 'True' : 'False'}</Typography>
                            </Box>
                            : selectionOption?.type === 'enum' ?
                                <Select
                                    name="type"
                                    label="Path"
                                    variant="outlined"
                                    fullWidth
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                >
                                    {selectionOption?.enumValues?.map((option: any) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                : <TextField
                                    fullWidth
                                    label="Value"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    variant="outlined"
                                    type={selectedDataType === 'number' ? 'number' : 'text'}
                                />
                    )}
                </Grid>
                <Grid xs={2}>
                <Box mt={2}>
                    <Fab color="primary" size="small" aria-label="add">
                        <AddIcon onClick={handleSubmit} />
                    </Fab>
                </Box>
                </Grid>
            </>
        // </Paper>
    );
};

export default FilterData;