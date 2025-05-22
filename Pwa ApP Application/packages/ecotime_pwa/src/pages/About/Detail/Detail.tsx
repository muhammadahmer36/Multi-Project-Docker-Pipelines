import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from '../About.module.scss';

interface DetailProps {
  details: { key: string; value: string }[];
}

function Detail({ details }: DetailProps): JSX.Element {
  const [t] = useTranslation();

  return (
    <Grid container spacing={2} mt={2} ml={1}>
      {details.map(({ key, value }) => (
        <React.Fragment key={key}>
          <Grid item xs={6} md={6} lg={6}>
            <Typography className={styles.headingText}>
              {t(key)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography className={styles.headingValueText}>
              {value}
            </Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
}

export default Detail;
