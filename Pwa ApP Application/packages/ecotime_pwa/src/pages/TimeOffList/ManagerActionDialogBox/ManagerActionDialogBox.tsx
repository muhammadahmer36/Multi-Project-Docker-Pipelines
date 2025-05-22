import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyledButton, StyledText } from 'components';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Container from '@mui/material/Container';
import useGetContentForDialogBody from './hooks/useGetContentForDialogBody';
import styles from './ManagerActionDialogBox.module.scss';

interface DeleteDialogBoxProps {
  openDialogBox: boolean
  closeDialog: () => void;
  deleteTimeOfRequests: () => void;
}

export default function ManagerActionDialogBox(props: DeleteDialogBoxProps) {
  const { closeDialog, deleteTimeOfRequests, openDialogBox } = props;
  const [t] = useTranslation();

  const { headerTitle, buttonTitle, bodyContent } = useGetContentForDialogBody();

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
        className={styles.actionButton}
        variant="contained"
      >
        {buttonTitle}
      </StyledButton>
    </Container>
  );

  const dialogHeader = () => (
    <div className={styles.dialogHeaderContainer}>
      <StyledText
        className={styles.dialogHeadingClass}
      >
        {headerTitle}
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
        {bodyContent}
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
