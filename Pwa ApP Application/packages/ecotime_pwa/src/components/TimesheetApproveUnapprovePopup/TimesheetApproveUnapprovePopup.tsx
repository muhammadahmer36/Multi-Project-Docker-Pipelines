import React from 'react';
import {
  ButtonBase, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { primaryBorderColor, primaryColor, white } from 'appConstants/colors';

interface Props {
  // eslint-disable-next-line no-unused-vars
  t: (key: string) => string;
  headerTitle: string,
  visible: boolean;
  handleClose: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  approvedTimesheetContent: string;
  actionButtonTitle: string;
}

function ApprovedUnapproveDialog({
  t,
  actionButtonTitle,
  headerTitle,
  visible,
  handleClose,
  handleOk,
  handleCancel,
  approvedTimesheetContent,
}: Props) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={visible}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${primaryBorderColor}`,
          paddingRight: '0px',
          height: '25px',
        }}
      >
        <DialogContentText
          sx={{
            color: primaryColor,
            fontWeight: '700',
            fontSize: '18px',
          }}
        >
          {headerTitle}
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: primaryColor,
            fontWeight: '500',
            fontSize: '16px',
            paddingTop: '10px',
          }}
        >
          {approvedTimesheetContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          pb: 2.5,
          pl: 2.5,
          pr: 2.5,
        }}
      >
        <ButtonBase
          sx={{
            height: '46px',
            width: '166px',
            borderRadius: '7px',
            border: `solid 2px ${primaryColor}`,
            color: primaryColor,
            fontSize: '18px',
            textTransform: 'none',
            fontFamily: 'inherit',
          }}
          onClick={handleCancel}
        >
          {t('cancel')}
        </ButtonBase>
        <ButtonBase
          sx={{
            height: '46px',
            width: '166px',
            borderRadius: '7px',
            border: `solid 2px ${primaryColor}`,
            backgroundColor: primaryColor,
            fontSize: '18px',
            color: white,
            textTransform: 'none',
            fontFamily: 'inherit',
          }}
          onClick={handleOk}
        >
          {actionButtonTitle}
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
}

export default ApprovedUnapproveDialog;
