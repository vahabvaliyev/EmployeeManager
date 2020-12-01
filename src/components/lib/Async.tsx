import { Backdrop, Box, CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React from 'react';
import { QueryResult } from 'react-query';

interface IProps<T> {
    query: QueryResult<T>;
    children: (data: T) => React.ReactNode | React.ReactNode[];
}

export function Async<T>({ query, children }: IProps<T>) {
    if (query.isLoading || query.isIdle) {
        return (
            <Box display="flex" m="24px" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (query.isError) {
        return (
            <Box display="flex" m="24px" alignItems="center" justifyContent="center">
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {/* Should get translation messages from nls file by error code in production. */}
                    {/* for ex. t(`Exceptions:Code.${query.error.code}`) */}
                    {query.error &&
                        process.env.INFRA_ENV === 'development' &&
                        JSON.stringify(query.error)}
                </Alert>
            </Box>
        );
    }

    if (query.isSuccess && query.isFetching) {
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        );
    }

    return <>{children(query.data)}</>;
}
