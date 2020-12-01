import React from 'react';
import { IColumn, RowsById } from './types';

interface IDataGridContext {
    initialRowsById: RowsById;
    columns: IColumn[];
}

export const DataGridContext = React.createContext<IDataGridContext>({
    initialRowsById: null,
    columns: null,
});

export const DataGridProvier: React.FC<{ ctx: IDataGridContext }> = ({ ctx, children }) => {
    return <DataGridContext.Provider value={ctx}>{children}</DataGridContext.Provider>;
};

export function useDataGridContext() {
    return React.useContext(DataGridContext);
}
