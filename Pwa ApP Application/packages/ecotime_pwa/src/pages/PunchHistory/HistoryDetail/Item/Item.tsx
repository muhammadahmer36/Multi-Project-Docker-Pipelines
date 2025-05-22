import { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getPunchHistory } from 'pages/PunchHistory/selectors';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { ListContext } from 'components/ReactWindowList/ReactWindowList';
import { PunchHistoryDetails } from 'pages/PunchHistory/types';
import Fade from '@mui/material/Fade';
import { setPunchHistory } from 'pages/PunchHistory/slice';
import styles from './Item.module.scss';

interface Props {
  item: PunchHistoryDetails;
  lastRow: boolean;
  index: number;
}

export default function Item(props: Props) {
  const {
    item,
    lastRow,
    index,
  } = props;
  const {
    date,
    type,
    status,
    time,
    day,
    location,
    source,
    isExpanded,
  } = item;
  const [t] = useTranslation();

  const { setSize, expandedItems } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const historyList = useSelector(getPunchHistory);

  useEffect(() => {
    if (root && root.current) {
      setSize(index, root.current.getBoundingClientRect().height);
    }
  }, [index, expandedItems[index]]);

  const onExpandToggle = () => {
    const updatedPunchHistories = historyList.map((item, i) => {
      if (i === index) {
        return { ...item, isExpanded: !item.isExpanded };
      }
      return item;
    });
    dispatch(setPunchHistory(updatedPunchHistories));
  };

  const className = lastRow ? `${styles.container} ${styles.lastRow}` : styles.container;

  return (
    <div
      className={className}
      ref={root}
    >
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          xs={3.5}
          md={3.5}
          lg={3.5}
          className={styles.label}

        >
          {date}
        </Grid>
        <Grid
          item
          xs={3.5}
          md={3.5}
          lg={3.5}
          className={styles.label}

        >
          {time}
        </Grid>
        <Grid
          item
          xs={3.5}
          md={3.5}
          lg={3.5}
          className={styles.label}

        >
          {type}
        </Grid>
        <Grid
          item
          xs={1.5}
          md={1.5}
          lg={1.5}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          className={styles.item}
        >
          <IconButton onClick={onExpandToggle}>
            {isExpanded
              ? <ExpandLessIcon className={styles.expandMoreExpandLessIconColor} />
              : <ExpandMoreIcon className={styles.expandMoreExpandLessIconColor} />}
          </IconButton>
        </Grid>

      </Grid>

      {isExpanded && (
        <Fade in={isExpanded} timeout={800}>
          <Grid
            container
            className={`${styles.detailContainer} ${styles.expandedItemSeprator}`}
          >
            <Grid
              item
              xs={3.5}
              md={3.5}
              lg={3.5}
              className={styles.label}
            >
              {t('day')}
            </Grid>
            <Grid
              item
              xs={8.1}
              md={8.1}
              lg={8.1}
              className={styles.value}
            >
              {day}
            </Grid>
            <Grid
              item
              xs={3.5}
              md={3.5}
              lg={3.5}
              className={styles.label}
            >
              {t('status')}
            </Grid>
            <Grid
              item
              xs={8.1}
              md={8.1}
              lg={8.1}
              className={styles.value}
            >
              {status}
            </Grid>
            <Grid
              item
              xs={3.5}
              md={3.5}
              lg={3.5}
              className={styles.label}
            >
              {t('source')}
            </Grid>
            <Grid
              item
              xs={8.1}
              md={8.1}
              lg={8.1}
              pt={2}
              pb={2}
              className={styles.value}
            >
              <Typography
                noWrap
              >
                {source}
              </Typography>
            </Grid>
            <Grid
              item
              xs={3.5}
              md={3.5}
              lg={3.5}
              className={styles.label}
            >
              {t('location')}
            </Grid>
            <Grid
              item
              xs={8.1}
              md={8.1}
              lg={8.1}
              pt={2}
              pb={2}
              className={styles.value}
            >
              <Typography
                noWrap
              >
                {location}
              </Typography>
            </Grid>
          </Grid>
        </Fade>
      )}
    </div>
  );
}
