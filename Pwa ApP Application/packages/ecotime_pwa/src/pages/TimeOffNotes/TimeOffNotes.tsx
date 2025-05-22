import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Notes, TimeOffHeader } from 'components';
import {
  getActionsTimeOffNotes,
  getCurrentMode, getDateForNoteScreen, getEmployeeNameForManagerNoteView,
  getNotesDetailOfTimeOffRequest, getNoteSuccess, getUserRole,
} from 'pages/TimeOffCalendar/selectors';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import BottomBar from 'layout/bottomBar/bottomBar';
import IconButton from '@mui/material/IconButton';
import { saveNoteValidationMessage, setNoteSuccess } from 'pages/TimeOffCalendar/slice';
import { UserRole } from 'common/types/types';
import { timeOffAction, timeOffActionsButtons } from 'pages/TimeOffCalendar/types';
import AddNotes from './AddNotes';
import ManagerInformation from './ManagerInformation';
import styles from './TimeOffNotes.module.scss';

export default function TimeOffNotes() {
  const [t] = useTranslation();
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch();
  const notesDetail = useSelector(getNotesDetailOfTimeOffRequest);
  const noteSuccesfullySave = useSelector(getNoteSuccess);
  const userRole = useSelector(getUserRole);
  const currentRole = useSelector(getCurrentMode);
  const employeeName = useSelector(getEmployeeNameForManagerNoteView);
  const date = useSelector(getDateForNoteScreen);
  const actionsTimeOffNotes = useSelector(getActionsTimeOffNotes) || [];
  const [openDialogBox, setOpenDialogBox] = useState(false);

  const { addNotes } = timeOffActionsButtons;

  const formLabel = userRole !== UserRole.Employee ? t('timeOff') : t('timeOffNotes');

  const hideRoleIcon = true;
  const closeDialog = () => {
    setOpenDialogBox(false);
  };

  const openDialog = () => {
    setOpenDialogBox(true);
    setNotes('');
    dispatch(saveNoteValidationMessage(''));
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  };

  const hasAddNotesAction = () => actionsTimeOffNotes.some((eachAction: timeOffAction) => eachAction.actionId === addNotes);

  useEffect(() => {
    if (noteSuccesfullySave) {
      closeDialog();
      dispatch(setNoteSuccess(false));
    }
  }, [noteSuccesfullySave]);

  return (
    <div className={styles.container}>
      <TimeOffHeader
        hideRoleIcon={hideRoleIcon}
        userRole={userRole}
        currentUserRole={currentRole}
        formLabel={formLabel}
      />
      {
        currentRole !== UserRole.Employee
        && (
          <ManagerInformation
            employeeName={employeeName}
            date={date}
          />
        )
      }
      <Notes
        currentRole={currentRole}
        notesDetail={notesDetail}
      />
      <AddNotes
        notes={notes}
        handleOnChange={handleOnChange}
        openDialogBox={openDialogBox}
        closeDialog={closeDialog}
      />
      {
        hasAddNotesAction()
        && (
        <IconButton
          sx={{
            position: 'fixed',
            bottom: '70px',
            right: '25px',
          }}
          onClick={openDialog}
        >
          <div
            className={styles.addNoteIconBackGround}
          >
            <NoteAddOutlinedIcon
              className={styles.addNoteIcon}
            />
          </div>
        </IconButton>
        )
      }
      <BottomBar />
    </div>
  );
}
