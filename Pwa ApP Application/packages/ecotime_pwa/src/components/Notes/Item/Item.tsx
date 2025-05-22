import { useContext, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { ListContext } from 'components/ReactWindowList/ReactWindowList';
import NotesAvatar from 'components/Notes/Avatar';
import { TimeOffRequestsNotes } from 'pages/TimeOffCalendar/types';
import styles from './Item.module.scss';

interface Props {
  item: TimeOffRequestsNotes;
  index: number;
}

export default function Item(props: Props) {
  const {
    item,
    index,
  } = props;
  /* eslint-disable camelcase */
  const {
    enteredByName,
    enteredOn,
    note,
  } = item;
  const { setSize, setExpandedItems, expandedItems } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (root && root.current) {
      setSize(index, root.current.getBoundingClientRect().height);
    }
  }, [index, expandedItems[index]]);

  const onExpandToggle = () => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = [...prevExpandedItems];
      newExpandedItems[index] = !newExpandedItems[index] || false;
      return newExpandedItems;
    });
  };

  const setAvatarBackGroundColor = () => {
    const colorClass = index % 2 === 0 ? styles.avatarColorForEvenRow : styles.avatarColorForOddRow;
    return colorClass;
  };

  const girdBottomBorder = expandedItems[index] === true ? styles.noneBorder : styles.expandedItemSeprator;
  const wrapNoteText = !expandedItems[index];
  const notesDescription = `${enteredByName} - ${enteredOn}`;

  const avatarBackGroundColor = setAvatarBackGroundColor();

  return (
    <div
      className={styles.timeOfRequestNotes}
      ref={root}
    >
      <Grid
        container
        className={`${styles.mainContainer} ${girdBottomBorder} `}
      >
        <Grid
          item
          xs={11}
          md={11}
          lg={11}
          className={styles.avatar}
        >
          <NotesAvatar
            avatarBackGroundColor={avatarBackGroundColor}
            notesEnteredBy={enteredByName}
          />
          <Typography
            noWrap={wrapNoteText}
            sx={{
              wordBreak: 'break-word',
              marginTop: '4px',
            }}
          >
            {note}
          </Typography>
        </Grid>
        <Grid
          xs={1}
          md={1}
          lg={1}
          className={styles.lastGridItem}
          item
        >
          <IconButton onClick={onExpandToggle}>
            {expandedItems[index]
              ? <ExpandLessIcon className={styles.expandMoreExpandLessIconColor} />
              : <ExpandMoreIcon className={styles.expandMoreExpandLessIconColor} />}
          </IconButton>
        </Grid>
      </Grid>
      {expandedItems[index] && (
        <Grid
          container
          className={styles.expandedItemSeprator}
        >
          <Grid
            container
          >
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              pt={1}
            >
              <Typography
                className={styles.typographyValue}
              >
                {notesDescription}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
