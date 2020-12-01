import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import React from 'react';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ValidationErrorDialog: React.FC<IProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="validation-error-dialog"
            aria-describedby="validation-error-description"
        >
            <DialogTitle id="validation-error-description">Validation errors</DialogTitle>
            <DialogContent>
                <DialogContentText id="alidation-error-description">
                    Before submitting your changes, please, fix validations errors.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
