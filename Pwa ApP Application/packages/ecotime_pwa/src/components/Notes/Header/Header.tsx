import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import styles from './Header.module.scss';

interface Props {
    onExpand: () => void;
    onCollapse: () => void;
    expandedItems: boolean[];
  }

export default function DetailHeader(props:Props) {
  const {
    onExpand, onCollapse, expandedItems,
  } = props;
  const [t] = useTranslation();

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const allCollapsed = expandedItems.every((item) => item === false);
    if (allCollapsed && expand) {
      setExpand(false);
    }
  }, [JSON.stringify(expandedItems)]);

  useEffect(() => {
    if (expand) {
      onExpand();
    } else {
      onCollapse();
    }
  }, [expand]);

  const onToggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Grid
      container
      className={styles.mainContainer}
    >
      <Grid
        item
        xs={11}
        md={11}
        lg={11}
        className={styles.dateLabel}
      >
        {t('notes')}
      </Grid>
      <Grid
        item
        xs={1}
        md={1}
        lg={1}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <IconButton onClick={onToggleExpand}>
          {expand
            ? <ExpandLessIcon className={styles.icon} />
            : <ExpandMoreIcon className={styles.icon} />}
        </IconButton>
      </Grid>
    </Grid>
  );
}
