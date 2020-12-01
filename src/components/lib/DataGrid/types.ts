type GetElementType<T extends Array<any>> = T extends (infer U)[] ? U : never;

export interface IDataGridProps {
    columns: IColumn[];
    dataSource: DataSource;
    onSubmit: (data: { updated: DataSource, deleted: DataSource }) => void;
};

export type DataSource = Array<{ id: number }>;

export interface IColumn {
    key: string;
    title: string;
    width?: string;
    validator?: (value: string) => string;
    formatter?: (value: string) => string;
    mask?: string;
    disabled?: boolean;
};

export type RowStatus = 'initial' | 'deleted' | 'updated';

export interface IRow {
    cells: GetElementType<DataSource>;
    status: RowStatus;
    validationErrors?: { [k: string]: string }
}

export type RowsById = {
    [k: string]: IRow;
}
