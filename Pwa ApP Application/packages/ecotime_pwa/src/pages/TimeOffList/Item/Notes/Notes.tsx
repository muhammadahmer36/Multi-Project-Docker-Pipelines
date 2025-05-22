import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  getTimeOffNotes, saveDatesForNotes, saveNotesDetailOfTimeOffRequest, saveTimeOffRequestId, setEmployeeNameForMangerNoteView,
} from 'pages/TimeOffCalendar/slice';
import styles from './Notes.module.scss';

interface NotesProps {
  requestId: number;
  employeeName?: string;
  noteTitle: string;
}

export default function Notes(props: NotesProps) {
  const { requestId, employeeName, noteTitle } = props;
  const dispatch = useDispatch();

  const handleOnClick = () => {
    const getNotesPayload = {
      requestId: requestId.toString(),
      fetcNotesAfterAddingNotes: false,
    };
    dispatch(saveDatesForNotes(noteTitle));
    dispatch(saveNotesDetailOfTimeOffRequest([]));
    dispatch(saveTimeOffRequestId(requestId));
    dispatch(setEmployeeNameForMangerNoteView(employeeName));
    dispatch(getTimeOffNotes(getNotesPayload));
  };

  return (
    <Grid
      container
      className={`${styles.marginAtLastGrid} ${styles.marginBetweenGrids} ${styles.mainContainer}`}
    >
      <Grid
        item
        xs={5}
        md={5}
        lg={5}
      />
      <Grid
        item
        xs={7}
        md={7}
        lg={7}
        className={styles.noteIconItem}
      >
        <IconButton
          onClick={handleOnClick}
        >
          <div
            className={styles.noteIconBackGround}
          >
            <DescriptionOutlinedIcon
              className={styles.noteIcon}
            />
          </div>
        </IconButton>
      </Grid>
    </Grid>
  );
}
