import {
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Table,
    Paper,
    TablePagination,
    Box,
    TextField,
    Button,
} from '@material-ui/core';
import React from 'react';

import type { IDataGridProps, IRow, RowsById } from './types';
import { Row } from './Row';
import { DataGridProvier } from './DataGridContext';
import { cloneDeep, isEmpty } from 'lodash';
import { ValidationErrorDialog } from './ValidationErrorDialog';

export const DataGrid: React.FC<IDataGridProps> = ({ dataSource, columns, onSubmit }) => {
    // Transform data structure and memoize it to avoid performance problems.
    const __initialRowsById: RowsById = React.useMemo(
        () =>
            dataSource.reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur.id]: {
                        cells: { ...cur },
                        status: 'initial',
                        validationErrors: {},
                    },
                }),
                {},
            ),
        [dataSource],
    );
    const [rowsById, setRowsById] = React.useState<RowsById>(cloneDeep(__initialRowsById));

    React.useEffect(() => {
        setRowsById(__initialRowsById);
    }, [__initialRowsById]);

    const [searchTerm, setSearchTerm] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [isValidationDialogOpen, setIsValidationDialogOpen] = React.useState(false);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleSubmit = () => {
        let hasValidationError: boolean;
        let deleted = [];
        let updated = [];

        Object.values(rowsById).forEach((x) => {
            if (x.status === 'deleted') {
                deleted.push(x.cells);
            }

            if (x.status === 'updated') {
                updated.push(x.cells);

                if (!isEmpty(x.validationErrors)) {
                    hasValidationError = true;
                }
            }
        });

        if (!hasValidationError) {
            onSubmit({ deleted, updated });
        } else {
            setIsValidationDialogOpen(true);
        }
    };

    const handleReset = () => {
        console.log('reset');
        setRowsById(cloneDeep(__initialRowsById));
    };

    const filteredRows = React.useMemo(() => {
        const rows = Object.values(rowsById);
        return searchTerm?.trim()
            ? rows.filter((row) => {
                  return Object.values(row.cells).some((value: unknown) =>
                      String(value).toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
                  );
              })
            : rows;
    }, [searchTerm, rowsById]);

    const handleRowBlur = (row: IRow) => {
        setRowsById((prevState) => {
            const newState = cloneDeep(prevState);

            newState[row.cells.id] = cloneDeep(row);

            return newState;
        });
    };

    return (
        <DataGridProvier ctx={{ initialRowsById: __initialRowsById, columns }}>
            <Box p="12px">
                <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    id="standard-basic"
                    label="Search"
                />
            </Box>
            <Paper>
                <TableContainer>
                    <Table size="medium">
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell width={col.width} key={col.key}>
                                        {col.title}
                                    </TableCell>
                                ))}
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows
                                .slice(
                                    currentPage * rowsPerPage,
                                    currentPage * rowsPerPage + rowsPerPage,
                                )
                                .map((row) => (
                                    <Row onBlur={handleRowBlur} key={row.cells.id} row={row} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onChangePage={(_, page) => setCurrentPage(page)}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Box mt="24px" display="flex" justifyContent="flex-end">
                <Box mr="8px">
                    <Button onClick={handleReset} variant="contained">
                        Reset
                    </Button>
                </Box>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
            <ValidationErrorDialog
                isOpen={isValidationDialogOpen}
                onClose={() => setIsValidationDialogOpen(false)}
            />
        </DataGridProvier>
    );
};
