import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { primaryColor } from 'appConstants/colors';
import { CertifyItem } from 'pages/TimesheetCertifyUncertify/types';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import { ListContext } from '../List/List';
import styles from './Item.module.scss';

interface Props {
  item: CertifyItem;
  index: number;
}
export default function Item(props: Props) {
  const {
    item,
    index,
  } = props;
  const {
    payperiod_title: payPeriod,
    reported_duration: reportedDuration,
    calculated_duration: calculatedDuration,

  } = item;
  const [t] = useTranslation();
  const {
    setSize, setExpandedItems, expandedItems,
  } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);
  const isRowExpanded = expandedItems[index];
  const borderStyle = { borderBottom: `1px solid ${primaryColor}` };
  const mainContainerStyles = isRowExpanded ? { } : borderStyle;

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

  return (
    <div
      ref={root}
    >
      {index === 0
          && (
          <Header />
          )}
      <Grid
        container
        className={styles.mainContainer}
        sx={{ ...mainContainerStyles }}
      >
        <Grid
          xs={10.5}
          md={10.5}
          lg={10.5}
          container
          item
          className={styles.payPeriod}
        >
          {payPeriod}
        </Grid>
        <Grid
          item
          xs={1.5}
          md={1.5}
          lg={1.5}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <IconButton onClick={onExpandToggle}>
            {expandedItems[index]
              ? <ExpandLessIcon className={styles.expandMoreExpandLessIconColor} />
              : <ExpandMoreIcon className={styles.expandMoreExpandLessIconColor} />}
          </IconButton>
        </Grid>
        { isRowExpanded
        && (
        <div className={styles.border} />
        )}
      </Grid>

      {isRowExpanded && (
      <Grid
        container
        className={styles.expandedContainer}
        sx={{ ...borderStyle }}
      >
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          className={styles.label}
        >
          {t('reportedHour')}

        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          className={styles.value}
        >
          {reportedDuration}

        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          className={styles.label}
        >
          {t('calculatedHour')}

        </Grid>
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          className={styles.value}
        >
          {calculatedDuration}

        </Grid>
      </Grid>
      )}
    </div>
  );
}
