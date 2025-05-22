import React from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import { StyledButton } from 'components';
import styles from '../AddNotes.module.scss';

interface DialogActionProps {
    disableSaveButton: boolean;
    closeDialog: () => void;
    saveNotes: () => void;
}

export default function DialogAction(props: DialogActionProps) {
  const { disableSaveButton, closeDialog, saveNotes } = props;
  const [t] = useTranslation();
  return (
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
        disabled={disableSaveButton}
        onClick={saveNotes}
        className={styles.saveButton}
        variant="contained"
      >
        {t('save')}
      </StyledButton>
    </Container>
  );
}
