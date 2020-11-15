export type Column = {
    key: string;
    title: string;
    width?: string;
    validator?: (value: string) => string;
    mask?: string;
    disabled?: boolean;
};

export interface IRow extends Object { id: number };

export interface IDataGridProps {
    columns: Array<Column>;
    rows: Array<IRow>;
    onSubmit: (updatedRows: IRow[], deletedRows: IRow[]) => void;
};

export interface IValidationError {rowId: number, cellKey: string; error: string};
