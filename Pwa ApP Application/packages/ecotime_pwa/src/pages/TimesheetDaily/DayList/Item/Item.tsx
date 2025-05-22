import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useContext, useEffect, useRef } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DailyDetail } from 'pages/TimesheetDaily/types';
import React from 'react';
import styles from './Item.module.scss';
import { ListContext } from '../List/List';
import Header from '../Header';

interface Props {
  item: DailyDetail;
  index: number;
}
export default function Item(props: Props) {
  const {
    item,
    index,
  } = props;
  const {
    additionalInfo,
    timeIn_Display: timeIn,
    timeOut_Display: timeOut,
    errorsCount,
    errorDescription,
    inOut,
    duration,
  } = item;
  const [t] = useTranslation();
  const {
    setSize,
  } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const additionalInfoList = additionalInfo.split('<br>');

  useEffect(() => {
    if (root && root.current) {
      setSize(index, root.current.getBoundingClientRect().height);
    }
  }, [index]);

  const onShowErrorToast = (message: string) => () => {
    dispatch(openPopup({
      message,
      severity: Severity.WARNING,
    }));
  };
  const payCodeName = additionalInfoList.map((item: string, index: number) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={`${item}-${index}`}>
      <Grid
        item
        xs={6}
        md={6}
        lg={6}
        className={styles.additionalInfoLabel}
      >
        {index === 0 ? t('payCode') : t('task')}
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        lg={6}
        className={styles.additionalInfoLabel}
      >
        {item}
      </Grid>
    </React.Fragment>
  ));

  const sxHeight = inOut ? { height: '38px' } : { height: 'fit-content' };

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
      >

        <Grid
          container
          className={styles.timeInfoContainer}
          item
          xs={8}
          md={8}
          lg={8}
        >

          {inOut
          && (
          <>
            <Grid
              item
              xs={6}
              md={6}
              lg={6}
              className={styles.timeInfo}
            >
              <Grid
                item
              >
                {t('timeIn')}

              </Grid>
              <Grid
                item
              >
                {timeIn}

              </Grid>
            </Grid>
            <Grid
              item
              xs={6}
              md={6}
              lg={6}
              className={styles.timeInfo}
            >
              <Grid
                item
              >
                {t('timeOut')}

              </Grid>
              <Grid
                item
              >
                {timeOut}
              </Grid>
            </Grid>
          </>
          )}
          {payCodeName}

        </Grid>
        <Grid
          item
          xs={2}
          md={2}
          lg={2}
          className={styles.duration}
          sx={{ ...sxHeight, justifyContent: 'flex-end' }}
        >

          {duration && duration.toFixed(2)}
        </Grid>
        <Grid
          item
          xs={1.5}
          md={1.5}
          lg={1.5}
          className={styles.duration}
          sx={{ ...sxHeight, justifyContent: 'center' }}
        >

          {errorsCount > 0
              && (
                <IconButton
                  onClick={onShowErrorToast(errorDescription)}
                  className={styles.iconButton}

                >
                  <WarningAmberIcon
                    fontSize="small"
                    className={styles.warningAmberIcon}
                  />
                </IconButton>
              )}

        </Grid>
        <Grid container className={styles.borderContainer}>
          <div className={styles.border} />
        </Grid>
      </Grid>

    </div>

  );
}
