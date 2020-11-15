import React from 'react';
import { DataGrid } from 'DataGrid';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import type { Column } from 'DataGrid/models';
import { validateEmptyString, validateDateFormat, validatePhoneNumber } from 'utils';

interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    position: string;
    phoneNumber: string;
}

const columns: Column[] = [
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
        mask: '+999 99 999 99 99',
    },
];

const originData = [
    {
        id: 1,
        firstName: 'Alex',
        lastName: 'Smith',
        birthDate: '1992.02.12',
        position: 'Accountant',
        phoneNumber: '+994552221233',
    },
    {
        id: 2,
        firstName: 'Jason',
        lastName: 'White',
        birthDate: '1984.05.06',
        position: 'Director',
        phoneNumber: '+994702254411',
    },
    {
        id: 3,
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1997.03.11',
        position: 'Manager',
        phoneNumber: '+994504265511',
    },
    {
        id: 4,
        firstName: 'Eve',
        lastName: 'Scott',
        birthDate: '1992.01.06',
        position: 'HR',
        phoneNumber: '+994707707070',
    },
    {
        id: 5,
        firstName: 'Melissa',
        lastName: 'Anthony',
        birthDate: '1995.05.05',
        position: 'Manager',
        phoneNumber: '+994502223311',
    },
    {
        id: 6,
        firstName: 'Carrillo',
        lastName: 'Flores',
        birthDate: '1994.09.29',
        position: 'Designer',
        phoneNumber: '+994557657989',
    },
];

export const App: React.FC = () => {
    const [employeeList] = React.useState<IEmployee[]>(originData);

    const [updatedEmployeeList, setUpdatedEmployeeList] = React.useState<IEmployee[]>([]);
    const [deletedEmployeeList, setDeletedEmployeeList] = React.useState<IEmployee[]>([]);

    const handleSubmit = (updatedEmployeeList: IEmployee[], deletedEmployeeList: IEmployee[]) => {
        setUpdatedEmployeeList(updatedEmployeeList);
        setDeletedEmployeeList(deletedEmployeeList);
    };

    return (
        <Box p="8px">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Employees</Typography>
                </Toolbar>
            </AppBar>
            <Box mt="36px">
                <DataGrid columns={columns} rows={employeeList} onSubmit={handleSubmit} />
            </Box>
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
};
