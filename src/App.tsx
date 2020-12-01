import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { EmployeeListForm } from 'components/EmployeeListForm';
import { buildServices, ServicesProvider } from 'services';

export const App: React.FC = () => {
    const services = React.useMemo(() => buildServices(), []);

    return (
        <ServicesProvider services={services}>
            <Box p="8px">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6">Employees</Typography>
                    </Toolbar>
                </AppBar>
                <EmployeeListForm />
            </Box>
        </ServicesProvider>
    );
};
