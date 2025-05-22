import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { getPayPeriod } from 'pages/Timesheet/selectors';
import DialogAction from './DialogAction';
import DialogBody from './DialogBody';
import DialogHeader from './DialogHeader';
import { addTimesheetNotes, saveNoteValidationMessage } from '../slice';
import { getNoteValidation } from '../selector';
import styles from './AddNotes.module.scss';

export interface Props {
  openDialogBox: boolean;
  closeDialog: () => void;
  /* eslint-disable no-unused-vars */
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  notes: string;
}

export default function AddNotes(props: Props) {
  const {
    openDialogBox, closeDialog, handleOnChange, notes,
  } = props;
  const payPeriod = useSelector(getPayPeriod);
  const noteValidation = useSelector(getNoteValidation);
  const dispatch = useDispatch();

  const saveNotes = () => {
    const { code } = payPeriod;
    const notesPayload = {
      note: notes,
      periodIdentity: code,
    };
    dispatch(saveNoteValidationMessage(''));
    dispatch(addTimesheetNotes(notesPayload));
  };

  const disableSaveButton = !(notes.length >= 1);

  return (
    <Dialog
      PaperProps={{ className: styles.dialogBody }}
      open={openDialogBox}
      onClose={closeDialog}
    >
      <DialogTitle>
        <DialogHeader />
      </DialogTitle>
      <DialogBody
        notes={notes}
        noteValidation={noteValidation}
        handleOnChange={handleOnChange}
      />
      <DialogActions>
        <DialogAction
          disableSaveButton={disableSaveButton}
          saveNotes={saveNotes}
          closeDialog={closeDialog}
        />
      </DialogActions>
    </Dialog>
  );
}
