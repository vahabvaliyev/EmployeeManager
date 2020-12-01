import { IconButton, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { EditableCell } from './EditableCell';
import { IRow, RowStatus } from './types';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreIcon from '@material-ui/icons/Restore';
import { useDataGridContext } from './DataGridContext';
import { cloneDeep, isEqual } from 'lodash';

interface IProps {
    row: IRow;
    onBlur: (row: IRow) => void;
}

export const Row: React.FC<IProps> = ({ row, onBlur }) => {
    const [cells, setCells] = React.useState({ ...row.cells });
    const [status, setStatus] = React.useState(row.status);
    const [validationErrors, setValidationErrors] = React.useState({ ...row.validationErrors });
    const { initialRowsById, columns } = useDataGridContext();

    React.useEffect(() => {
        setCells({ ...row.cells });
        setStatus(row.status);
        setValidationErrors({ ...row.validationErrors });
    }, [row]);

    const handleCellEdit = (key: string, value: string) => {
        setCells((prevState) => ({
            ...prevState,
            [key]: value,
        }));

        if (initialRowsById[cells.id].cells[key] !== value) {
            setStatus('updated');
        } else {
            setStatus('initial');
        }

        const { validator } = columns.find((x) => x.key === key);

        const error = validator?.(value);

        if (error) {
            setValidationErrors((prevState) => ({ ...prevState, [key]: error }));
        } else {
            setValidationErrors((prevState) => {
                const nextState = cloneDeep(prevState);

                delete nextState[key];

                return nextState;
            });
        }
    };

    const handleRestoreDeletion = () => {
        if (isEqual(initialRowsById[cells.id].cells, cells)) {
            setStatus('initial');
        } else {
            setStatus('updated');
        }
    };

    const handleBlur = () => {
        onBlur({ cells, status, validationErrors });
    };

    return (
        <TableRow
            onBlur={handleBlur}
            style={{
                backgroundColor: getColorByStatus(status),
            }}
        >
            {/* Display cells by using columns to prevent displaying unexpected data. */}
            {columns.map(({ key, disabled, mask, formatter }) => {
                return (
                    <EditableCell
                        key={key}
                        disabled={status === 'deleted' || disabled}
                        value={(cells[key] as unknown) as any}
                        onChange={(x) => handleCellEdit(key, x)}
                        mask={mask}
                        formatter={formatter}
                        error={validationErrors[key]}
                    />
                );
            })}
            <TableCell>
                {status === 'deleted' ? (
                    <IconButton onClick={handleRestoreDeletion} aria-label="restore">
                        <RestoreIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={() => setStatus('deleted')} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
};

const getColorByStatus = (status: RowStatus) => {
    if (status === 'deleted') {
        return '#ffcdd2';
    }

    if (status === 'updated') {
        return '#fff3e0';
    }

    if (status === 'initial') {
        return '#fff';
    }
};
