import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPayPeriod } from 'pages/Timesheet/selectors';
import IconButton from '@mui/material/IconButton';
import { getTimesheetNotes } from 'pages/TimesheetNotes/slice';
import notes from 'assets/img/notes.svg';
import styles from './Notes.module.scss';

export default function Notes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payPeriod = useSelector(getPayPeriod);

  const notesAgainstPayPeriod = () => {
    const { code } = payPeriod;
    const getNotesPayload = {
      navigate,
      code,
    };
    dispatch(getTimesheetNotes(getNotesPayload));
  };

  return (
    <IconButton onClick={notesAgainstPayPeriod}>
      <img
        src={notes}
        alt="view notes"
        className={styles.image}
      />
    </IconButton>
  );
}
