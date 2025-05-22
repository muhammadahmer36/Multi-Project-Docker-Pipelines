import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SortableTypes, SortOrderRows } from 'pages/PunchHistory/types';
import { getPunchHistory } from 'pages/PunchHistory/selectors';
import { setPunchHistory } from 'pages/PunchHistory/slice';
import SortableIconButton from './SortableIconButton';
import styles from './Header.module.scss';

interface Props {
  /* eslint-disable no-unused-vars */
  onSorted: (param: SortableTypes) => void;
  rowData: SortOrderRows
}

export default function Header(props: Props) {
  const {
    onSorted, rowData,
  } = props;
  const [t] = useTranslation();
  const historyList = useSelector(getPunchHistory);
  const dispatch = useDispatch();

  function checkAreAllExpanded() {
    return historyList.every((item) => item.isExpanded === true);
  }

  const toggleAllIsExpanded = () => {
    const allExpanded = checkAreAllExpanded();
    const updatedPunchHistory = historyList.map((item) => ({
      ...item,
      isExpanded: !allExpanded,
    }));
    dispatch(setPunchHistory(updatedPunchHistory));
  };

  const allExpanded = checkAreAllExpanded();

  return (
    <div className={styles.container}>
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          xs={3.5}
          md={3.5}
          lg={3.5}
          className={styles.dateLabel}
        >
          <SortableIconButton
            label={t('date')}
            onSorted={onSorted}
            type={SortableTypes.Date}
            isSorted={rowData.rowOneDescending}
          />
        </Grid>
        <Grid
          item
          xs={3.5}
          md={3.5}
          lg={3.5}
          className={styles.dateLabel}
        >
          <SortableIconButton
            label={t('time')}
            onSorted={onSorted}
            type={SortableTypes.Time}
            isSorted={rowData.rowTwoDescending}
          />
        </Grid>
        <Grid
          item
          xs={3.5}
          md={3.5}
          lg={3.5}
          className={styles.dateLabel}
        >
          <SortableIconButton
            label={t('type')}
            onSorted={onSorted}
            type={SortableTypes.Type}
            isSorted={rowData.rowThreeDescending}
          />
        </Grid>
        <Grid
          item
          xs={1.5}
          md={1.5}
          lg={1.5}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton onClick={toggleAllIsExpanded}>
            {allExpanded
              ? <ExpandLessIcon className={styles.icon} />
              : <ExpandMoreIcon className={styles.icon} />}
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}
