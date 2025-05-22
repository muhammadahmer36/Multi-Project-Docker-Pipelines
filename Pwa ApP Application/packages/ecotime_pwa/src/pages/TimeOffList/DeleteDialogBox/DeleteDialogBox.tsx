import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StyledButton, StyledText } from 'components';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { getSummaryInformation } from 'pages/TimeOffCalendar/selectors';
import { SummaryInformation } from 'pages/TimeOffCalendar/types';
import Container from '@mui/material/Container';
import styles from './DeleteDialogBox.module.scss';

interface DeleteDialogBoxProps {
  openDialogBox: boolean
  closeDialog: () => void;
  deleteTimeOfRequests: () => void;
}

export default function DeleteDialogBox(props: DeleteDialogBoxProps) {
  const { closeDialog, deleteTimeOfRequests, openDialogBox } = props;
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const [t] = useTranslation();

  const deletedItemsCount = allTimeOffRequest.filter((eachItem: SummaryInformation) => eachItem.isDeleted).length >= 2;

  const deleteConfirmMessage = deletedItemsCount === true ? t('deleteMultipleTimeOfRequests') : t('deleteTimeOfRequest');

  const dialogAction = () => (
    <Container
      className={styles.actionButtonContainer}
    >
      <StyledButton
        type="submit"
        fullWidth
        onClick={closeDialog}
        variant="outlined"
        className={styles.cancelButton}
      >
        {t('cancel')}
      </StyledButton>
      <StyledButton
        type="submit"
        fullWidth
        onClick={deleteTimeOfRequests}
        className={styles.deleteButton}
        variant="contained"
      >
        {t('delete')}
      </StyledButton>
    </Container>
  );

  const dialogHeader = () => (
    <div className={styles.dialogHeaderContainer}>
      <StyledText
        className={styles.dialogHeadingClass}
      >
        {t('confirmDelete')}
      </StyledText>
    </div>
  );

  const dialogBody = () => (
    <div className={styles.dialogBodyContainer}>
      <Divider />
      <DialogContentText
        pt={1}
        pb={4}
        className={styles.dialogBodyText}
      >
        {deleteConfirmMessage}
      </DialogContentText>
    </div>
  );

  return (
    <Dialog
      PaperProps={{ className: styles.dialogBody }}
      open={openDialogBox}
      onClose={closeDialog}
    >
      <DialogTitle>
        {dialogHeader()}
      </DialogTitle>
      {dialogBody()}
      <DialogActions>
        {dialogAction()}
      </DialogActions>
    </Dialog>
  );
}
