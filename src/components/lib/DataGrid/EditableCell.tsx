import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { TableCell } from '@material-ui/core';

interface IProps {
    disabled: boolean;
    value: string;
    onChange: (value: string) => void;
    formatter?: (value: string) => string;
    mask?: string;
    error: string;
}

export const EditableCell: React.FC<IProps> = ({
    disabled,
    value,
    onChange,
    mask,
    formatter,
    error,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatter?.(e.target.value) || e.target.value;
        onChange(formattedValue);
    };

    return (
        <Cell scope="row">
            <Input
                mask={mask}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                hasError={Boolean(error)}
            />
            {error && !disabled && <ValidationMessage>{error}</ValidationMessage>}
        </Cell>
    );
};

const Cell = styled(TableCell)`
    position: relative;
`;

const Input = styled(InputMask).withConfig<{
    hasError: boolean;
    disabled: boolean;
}>({ shouldForwardProp: (prop) => prop !== 'hasError' })`
    padding: 8px;
    font-size: 14px;
    border: none;
    outline-color: #3f51b5;
    outline-width: 1px;
    background-color: transparent;
    border-radius: 4px;

    ${({ hasError, disabled }) => hasError && !disabled && 'border: 1px solid #f44336;'}
`;

const ValidationMessage = styled.span`
    color: #f44336;
    font-size: 12px;
    position: absolute;
    bottom: 3px;
    width: 100%;
    left: 16px;
`;
