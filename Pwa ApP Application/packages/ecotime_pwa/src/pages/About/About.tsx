import React from 'react';
import { useTranslation } from 'react-i18next';
import { ENVIROMENT_NAME, APP_VERSION } from 'enviroments';
import BottomBar from 'layout/bottomBar/bottomBar';
import aboutImage from 'assets/img/aboutImage.png';
import Header from 'layout/header/header';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Detail from './Detail';
import styles from './About.module.scss';

export default function About() {
  const [t] = useTranslation();

  const details = [
    { key: t('applicationVersion'), value: APP_VERSION },
    { key: t('environmentName'), value: ENVIROMENT_NAME },
  ];

  return (
    <>
      <Header formLabel={t('about')} />
      <Box className={styles.aboutUs}>
        <Box
          className={styles.imageContainer}
        >
          <img
            alt="ecotimeImage"
            className={styles.image}
            src={aboutImage}
          />
        </Box>
        <Box
          className={styles.contentContainer}
        >
          <Detail details={details} />
          <Box
            mt={4}
            className={styles.copyRightsContainer}
          >
            <Typography
              className={styles.copyRightText}
            >
              {t('copyRightsByHbs')}
            </Typography>
          </Box>
        </Box>
      </Box>
      <BottomBar />
    </>
  );
}
