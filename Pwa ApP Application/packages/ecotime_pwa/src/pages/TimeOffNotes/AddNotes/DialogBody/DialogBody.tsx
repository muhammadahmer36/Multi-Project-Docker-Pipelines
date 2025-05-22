import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogContentText from '@mui/material/DialogContentText';
import { StyledTextField } from 'components';
import Divider from '@mui/material/Divider';
import styles from '../AddNotes.module.scss';

interface Props {
  notes: string;
  noteValidation: string;
  /* eslint-disable no-unused-vars */
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DialogBody(props: Props) {
  const [t] = useTranslation();
  const { handleOnChange, notes, noteValidation } = props;
  const showErrorOnNote = !!noteValidation;
  return (
    <div className={styles.dialogBodyContainer}>
      <Divider />
      <DialogContentText
        pt={1.8}
        pl={2}
        pr={2}
        pb={1}
        className={styles.dialogBodyText}
      >
        <StyledTextField
          label={t('notes')}
          multiline
          rows={4}
          fullWidth
          error={showErrorOnNote}
          helperText={noteValidation}
          value={notes}
          onChange={handleOnChange}
        />
      </DialogContentText>
    </div>
  );
}
