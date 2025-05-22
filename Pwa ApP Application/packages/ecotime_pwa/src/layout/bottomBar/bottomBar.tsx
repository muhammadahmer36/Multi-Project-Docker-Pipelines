import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { dashboard } from 'appConstants';
import styles from './BottomBar.module.scss';

function BottomBar() {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const onClickIconButton = () => {
    navigate(dashboard);
  };
  return (
    <div className={styles.bottomNavigation}>
      <Paper
        className={styles.paper}
        elevation={3}
      >
        <BottomNavigation
          className={styles.justifyContentSpaceAround}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            className={styles.bottomNavLabel}
            label={t('Home')}
            icon={<HomeIcon />}
            onClick={onClickIconButton}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default BottomBar;
