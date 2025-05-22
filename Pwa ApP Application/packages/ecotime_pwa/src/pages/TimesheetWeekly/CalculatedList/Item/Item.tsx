import React from 'react';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { useContext, useEffect, useRef } from 'react';
import {
  Calculated,
  TimesheetCalculatedData,
} from 'pages/Timesheet/types';
import { primaryColor } from 'appConstants/colors';
import { useTranslation } from 'react-i18next';
import styles from './Item.module.scss';
import { ListContext } from '../List/List';
import Header from '../Header';

interface Props {
  item: Calculated;
  index: number;
}
export default function Item(props: Props) {
  const {
    item,
    index,
  } = props;
  const {
    duration,
    groupTitle,
    payCodeNameList,
  } = item;
  const [t] = useTranslation();
  const { setSize, setExpandedItems, expandedItems } = useContext(ListContext);
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

  const payCodeName = payCodeNameList.map(({
    payCodeName,
    duration,
    tsDate,
  }: TimesheetCalculatedData, index: number) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={`${payCodeName}-${index}`}>

      <Grid
        key={tsDate}
        item
        xs={8.5}
        md={8.5}
        lg={8.5}
        className={styles.label}
      >
        {payCodeName}

      </Grid>
      <Grid
        item
        xs={3.5}
        md={3.5}
        lg={3.5}
        className={styles.value}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {duration}

      </Grid>
    </React.Fragment>
  ));

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
          item
          container
        >
          <Grid
            item
            xs={8.5}
            md={8.5}
            lg={8.5}
            className={styles.label}
          >
            {groupTitle}
          </Grid>
          <Grid
            item
            xs={3.5}
            md={3.5}
            lg={3.5}
            className={styles.item}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
          >
            {duration}
          </Grid>
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
        {isRowExpanded
          && (
          <div className={styles.border} />
          )}
      </Grid>
      {isRowExpanded && payCodeNameList.length === 0 && (
      <Grid
        container
        sx={{ ...borderStyle }}
      >
        <div className={styles.noDataFound}>
          {t('noDataFound')}
        </div>
      </Grid>
      )}
      {isRowExpanded && payCodeNameList.length > 0 && (
      <Grid
        container
        sx={{ ...borderStyle }}

      >
        <Grid
          xs={10.5}
          md={10.5}
          lg={10.5}
          item
          container
        >
          {payCodeName}
        </Grid>
        <Grid
          md={1.5}
          lg={1.5}
          xs={1.5}
          item
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        />
      </Grid>
      )}
    </div>
  );
}
