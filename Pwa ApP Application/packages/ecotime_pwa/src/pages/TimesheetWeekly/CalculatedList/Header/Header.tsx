import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.scss';
import { ListContext } from '../List/List';

export default function Header() {
  const {
    onExpandAll,
    onCollapseAll,
    expand,
  } = useContext(ListContext);
  const [t] = useTranslation();

  const onToggleExpand = () => {
    onExpandAll();
  };

  const onToggleCollapse = () => {
    onCollapseAll();
  };

  return (
    <div className={styles.container}>
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          xs={7.5}
          md={7.5}
          lg={7.5}
          className={styles.dateLabel}

        >
          {t('date')}
        </Grid>
        <Grid
          item
          xs={3}
          md={3}
          lg={3}
          display="flex"
          justifyContent="center"
          alignItems="center"

        >
          {t('hours')}

        </Grid>
        <Grid
          item
          xs={1.5}
          md={1.5}
          lg={1.5}
          display="flex"
          alignItems="center"
          justifyContent="center"

        >
          {expand && (
            <IconButton onClick={onToggleCollapse}>
              <ExpandLessIcon className={styles.icon} />
            </IconButton>
          )}

          {!expand && (
            <IconButton onClick={onToggleExpand}>
              <ExpandMoreIcon className={styles.icon} />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
