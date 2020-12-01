import { Box } from '@material-ui/core';
import { cloneDeep } from 'lodash';
import React from 'react';
import { useQuery } from 'react-query';
import { useServices } from 'services';
import { IEmployee } from 'services/EmployeeService';
import {
    formatPhoneNumber,
    validateDateFormat,
    validateEmptyString,
    validatePhoneNumber,
} from 'utils';
import { Async } from './lib/Async';
import { DataGrid } from './lib/DataGrid';
import { IColumn } from './lib/DataGrid/types';

const columns: IColumn[] = [
    { key: 'id', title: 'ID', disabled: true },
    {
        key: 'firstName',
        title: 'First name',
        validator: validateEmptyString,
    },
    {
        key: 'lastName',
        title: 'Last name',
        validator: validateEmptyString,
    },
    {
        key: 'birthDate',
        title: 'Date of birth (YYYY/MM/DD)',
        validator: validateDateFormat,
        mask: '9999.99.99',
    },
    {
        key: 'position',
        title: 'Position',
        validator: validateEmptyString,
    },
    {
        key: 'phoneNumber',
        title: 'Phone number',
        validator: validatePhoneNumber,
        mask: '+\\9\\94 99 999 99 99',
        formatter: formatPhoneNumber,
    },
];

export const EmployeeListForm: React.FC = () => {
    const { employeeService } = useServices();
    const employeeQuery = useQuery('employeeService.getList', employeeService.getList, {
        refetchOnWindowFocus: false,
    });

    const [updatedEmployeeList, setUpdatedEmployeeList] = React.useState<IEmployee[]>([]);
    const [deletedEmployeeList, setDeletedEmployeeList] = React.useState<IEmployee[]>([]);

    const handleSubmit = (data: { updated: IEmployee[]; deleted: IEmployee[] }) => {
        setDeletedEmployeeList(cloneDeep(data.deleted));
        setUpdatedEmployeeList(cloneDeep(data.updated));
    };

    return (
        <Async query={employeeQuery}>
            {(employeeList) => {
                return (
                    <Box mt="36px">
                        <DataGrid
                            onSubmit={handleSubmit}
                            columns={columns}
                            dataSource={employeeList}
                        />
                        <Box display="flex" justifyContent="space-around">
                            {deletedEmployeeList.length > 0 && (
                                <pre>
                                    <h4>Deleted employees</h4>
                                    {JSON.stringify(deletedEmployeeList, null, 4)}
                                </pre>
                            )}
                            {updatedEmployeeList.length > 0 && (
                                <pre>
                                    <h4>Updated employees</h4>
                                    {JSON.stringify(updatedEmployeeList, null, 4)}
                                </pre>
                            )}
                        </Box>
                    </Box>
                );
            }}
        </Async>
    );
};
