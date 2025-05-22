import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { addTimeOffNotes, saveNoteValidationMessage } from 'pages/TimeOffCalendar/slice';
import { getNoteValidation, getTimeOffRequestId } from 'pages/TimeOffCalendar/selectors';
import DialogAction from './DialogAction';
import styles from './AddNotes.module.scss';
import DialogBody from './DialogBody';
import DialogHeader from './DialogHeader';

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
  const timeOffRequestId = useSelector(getTimeOffRequestId);
  const noteValidation = useSelector(getNoteValidation);
  const dispatch = useDispatch();

  const saveNotes = () => {
    const notesPayload = {
      note: notes,
      timeOffRequestId,
    };
    dispatch(saveNoteValidationMessage(''));
    dispatch(addTimeOffNotes(notesPayload));
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
