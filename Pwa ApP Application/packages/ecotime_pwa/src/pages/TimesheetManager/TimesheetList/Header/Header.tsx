import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ListContext } from '../List/List';
import styles from './Header.module.scss';

export default function Header() {
  const [t] = useTranslation();
  const {

    setChecked,
    checked,
  } = useContext(ListContext);

  const handleChanged = () => {
    setChecked(!checked);
  };

  return (

    <Grid
      container
      className={styles.mainContainer}
    >
      <Grid
        item
        xs={1.5}
        md={1.5}
        lg={1.5}
        className={styles.checkBoxContainer}
      >
        <Checkbox
          checked={checked}
          onChange={handleChanged}
          sx={{
            padding: '0 !important',
            '&.Mui-checked .MuiSvgIcon-root': {
              fill: 'white',
            },
            color: 'white !important',
          }}
        />

      </Grid>
      <Grid
        item
        xs={10.5}
        md={10.5}
        lg={10.5}
        className={styles.label}
      >
        {t('timesheetList')}

      </Grid>
      <Grid />
    </Grid>

  );
}
