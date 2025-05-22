import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.scss';

interface Props {
  onExpand: () => void;
  onCollapse: () => void;
  expandedItems: boolean[];
}

export default function Header(props: Props) {
  const { onExpand, onCollapse, expandedItems } = props;
  const [t] = useTranslation();
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const hasExpandedItems = expandedItems.length > 0;
    const allCollapsed = hasExpandedItems && expandedItems.every((item) => !item);
    const allExpanded = hasExpandedItems && expandedItems.every((item) => item);

    if (allCollapsed && expand) {
      setExpand(false);
    } else if (allExpanded && !expand) {
      setExpand(true);
    }
  }, [expandedItems]);

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
    <div className={styles.container}>
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          xs={5.5}
          md={5.5}
          lg={5.5}
          className={styles.dateLabel}

        >
          {t('date')}
        </Grid>
        <Grid
          item
          xs={6.5}
          md={6.5}
          lg={6.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"

        >
          {t('hours')}
          <IconButton onClick={onToggleExpand}>
            {expand
              ? <ExpandLessIcon className={styles.icon} />
              : <ExpandMoreIcon className={styles.icon} />}
          </IconButton>
        </Grid>

      </Grid>
    </div>
  );
}
