import {
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Table,
    Paper,
    TablePagination,
    IconButton,
    Box,
    Button,
    ButtonGroup,
    TextField,
} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';

import DeleteIcon from '@material-ui/icons/Delete';
import RestoreIcon from '@material-ui/icons/Restore';
import { cloneDeep, isEqual } from 'lodash';
import type { IDataGridProps, IRow, IValidationError } from './models';

export const DataGrid: React.FC<IDataGridProps> = ({ columns, rows: initialRows, onSubmit }) => {
    const [rows, setRows] = React.useState<IRow[]>(initialRows);
    const [filteredRows, setFilteredRows] = React.useState<IRow[]>(null);
    const [search, setSearch] = React.useState<string>('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [deletedRows, setDeletedRows] = React.useState([]);
    const [validationErrors, setValidationErrors] = React.useState<IValidationError[]>([]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleEditCell = (rowId: number, cellKey: string, value: string) => {
        setRows((prevRows) => {
            const nextRows = cloneDeep(prevRows);

            nextRows.forEach((x) => {
                if (x.id === rowId) {
                    x[cellKey] = value;
                    return;
                }
            });

            return nextRows;
        });

        validateCell(rowId, cellKey, value);
    };

    const handleDeleteRow = (row: IRow) => {
        setDeletedRows((x) => [...x, row]);
    };

    const handleRestoreRow = (row: IRow) => {
        setDeletedRows((rows) => rows.filter((x) => x.id !== row.id));
    };

    const handleSubmit = () => {
        const updatedRows = [];

        rows.forEach((x, i) => {
            const isDeleted = deletedRows.find((y) => y.id === x.id);

            if (!isEqual(x, initialRows[i]) && !isDeleted) {
                updatedRows.push(x);
            }
        });

        onSubmit(updatedRows, deletedRows);
    };

    const handleReset = () => {
        setRows(initialRows);
        setDeletedRows([]);
        setCurrentPage(0);
        setRowsPerPage(5);
        handleSearchChange('');
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (value?.trim()) {
            const result = rows.filter((x) => {
                const rowValues = Object.values(x);

                const match = rowValues.some((y) =>
                    String(y).toLocaleLowerCase().includes(value.toLocaleLowerCase()),
                );

                return match;
            });

            setFilteredRows(result);
            setCurrentPage(0);
        } else {
            setFilteredRows(null);
        }
    };

    const validateCell = (rowId: number, cellKey: string, value: string) => {
        const { validator } = columns.find((x) => x.key === cellKey);

        const nextError = validator?.(value);

        if (nextError) {
            setCellError(rowId, cellKey, nextError);
        } else {
            removeCellError(rowId, cellKey);
        }
    };

    const setCellError = (rowId: number, cellKey: string, error: string) => {
        setValidationErrors((prevValidationErrors) => {
            const nextValidationErrors = cloneDeep(prevValidationErrors);

            const prevValidationError = nextValidationErrors.find(
                (x) => x.rowId === rowId && x.cellKey === cellKey,
            );

            if (prevValidationError) {
                prevValidationError.error = error;
            } else {
                nextValidationErrors.push({ rowId, cellKey, error });
            }

            return nextValidationErrors;
        });
    };

    const removeCellError = (rowId: number, cellKey: string) => {
        setValidationErrors((prevValidationErrors) =>
            prevValidationErrors.filter((x) => x.rowId !== rowId || x.cellKey !== cellKey),
        );
    };

    return (
        <>
            <Box mb="8px">
                <TextField
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
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
                            {(filteredRows || rows)
                                .slice(
                                    currentPage * rowsPerPage,
                                    currentPage * rowsPerPage + rowsPerPage,
                                )
                                .map((row, rowIndex) => {
                                    const cells = Object.entries(row);
                                    const isRowDeleted = deletedRows.some((x) => x.id === row.id);
                                    return (
                                        <TableRow
                                            key={rowIndex}
                                            style={{
                                                backgroundColor: isRowDeleted
                                                    ? 'rgba(244, 67, 54, 0.1)'
                                                    : '#fff',
                                            }}
                                        >
                                            {cells.map(([cellKey, cellValue]) => {
                                                const column = columns.find(
                                                    (x) => x.key === cellKey,
                                                );

                                                const cellError = validationErrors.find(
                                                    (x) =>
                                                        x.cellKey === cellKey && x.rowId === row.id,
                                                );

                                                return (
                                                    <TableCell key={cellKey} scope="row">
                                                        <StyledInput
                                                            mask={column.mask}
                                                            value={cellValue}
                                                            onChange={(e) => {
                                                                handleEditCell(
                                                                    row.id,
                                                                    cellKey,
                                                                    e.target.value,
                                                                );
                                                            }}
                                                            disabled={
                                                                isRowDeleted || column.disabled
                                                            }
                                                            data-has-error={Boolean(cellError)}
                                                        />
                                                        <span
                                                            style={{
                                                                color: '#f44336',
                                                                display: 'block',
                                                                fontSize: '12px',
                                                                position: 'absolute',
                                                            }}
                                                        >
                                                            {cellError?.error}
                                                        </span>
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                {isRowDeleted ? (
                                                    <IconButton
                                                        onClick={() => handleRestoreRow(row)}
                                                        aria-label="delete"
                                                    >
                                                        <RestoreIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        onClick={() => handleDeleteRow(row)}
                                                        aria-label="delete"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={(filteredRows || rows).length}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onChangePage={(_, page) => setCurrentPage(page)}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Box mt="24px" textAlign="right">
                <ButtonGroup>
                    <Button onClick={handleReset} variant="contained">
                        Reset
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </ButtonGroup>
            </Box>
        </>
    );
};

const StyledInput = styled(InputMask)`
    padding: 8px;
    font-size: 14px;
    border: none;
    outline-color: #3f51b5;
    outline-width: 1px;
    background-color: transparent;

    ${(props: { ['data-has-error']: boolean }) =>
        props['data-has-error'] && 'border: 1px solid #f44336; outline: none;'}
`;
