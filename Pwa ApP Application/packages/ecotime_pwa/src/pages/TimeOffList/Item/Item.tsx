import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StyledCheckBox } from 'components';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ListContext } from 'components/ReactWindowList/ReactWindowList';
import { setSummaryInformation } from 'pages/TimeOffCalendar/slice';
import {
  SummaryInformation, reviewStatus as reviewStatusEnum,
} from 'pages/TimeOffCalendar/types';
import { getCurrentMode, getSummaryInformation } from 'pages/TimeOffCalendar/selectors';
import { getDetailOfTimeOffRequests } from 'pages/TimeOffCalendar/slice';
import { durationConvertionInDeciamlForm, getUUID, splitTextByCommaAndBrTag } from 'utilities';
import { UserRole } from 'common/types/types';
import ProcessStatus from './ProcessStatus';
import ReviewStatus from './ReviewStatus';
import Notes from './Notes';
import styles from './Item.module.scss';

interface Props {
  item: SummaryInformation;
  lastRow: boolean;
  index: number;
}

export default function Item(props: Props) {
  const {
    item,
    lastRow,
    index,
  } = props;
  /* eslint-disable camelcase */
  const {
    totalDays,
    totalHours,
    summedHoursByType_DisplayValue,
    reviewStatus_DisplayTitle,
    reviewStatus_Code,
    processStatus_Title,
    processStatus_DisplayTitle,
    reviewStatus_Title,
    isDeleted,
    isSelectedForManagerAction,
    requestId,
    reviewStatus_Color,
    startEndDates_DisplayTitle,
    employeeName,
    notesExist,
  } = item;
  const [t] = useTranslation();
  const { setSize, expandedItems } = useContext(ListContext);
  const dispatch = useDispatch();
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const currentUserMode = useSelector(getCurrentMode);

  const { pending } = reviewStatusEnum;
  const root = useRef<HTMLDivElement>(null);
  const totalHoursDecimal = Number.isInteger(totalHours) ? durationConvertionInDeciamlForm(totalHours, 0) : totalHours;

  useEffect(() => {
    if (root && root.current) {
      setSize(index, root.current.getBoundingClientRect().height);
    }
  }, [index, expandedItems[index]]);

  const className = lastRow ? `${styles.container} ${styles.lastRow}` : styles.container;

  const onRowClick = () => {
    if (reviewStatus_Code === pending && currentUserMode !== UserRole.Manager) {
      const { requestId, endDate, startDate } = item;
      const detailPayload = {
        requestId,
        startDate,
        endDate,
        listOfPayCodes: '',
      };
      dispatch(getDetailOfTimeOffRequests(detailPayload));
    }
  };

  const showHourTypes = () => splitTextByCommaAndBrTag(summedHoursByType_DisplayValue).map((eachHourType) => (
    <Grid container onClick={onRowClick} className={styles.marginBetweenGrids} key={getUUID()}>
      <Grid item xs={5} md={5} lg={5} className={styles.payCode2Key}>
        <Typography className={styles.typographyHeading}>
          {t('hoursType')}
        </Typography>
      </Grid>
      <Grid item xs={7} md={7} lg={7} className={styles.itemColor}>
        <Typography className={styles.typographyValue}>
          {eachHourType}
        </Typography>
      </Grid>
    </Grid>
  ));

  const toggleDeleteStatus = () => {
    if (currentUserMode === UserRole.Manager) {
      const updatedTimeOfRequests = allTimeOffRequest
        .map((eachRequest: SummaryInformation) => (eachRequest.requestId === requestId
          ? { ...eachRequest, isSelectedForManagerAction: !eachRequest.isSelectedForManagerAction }
          : eachRequest));
      dispatch(setSummaryInformation(updatedTimeOfRequests));
    } else {
      const updatedTimeOfRequests = allTimeOffRequest
        .map((eachRequest: SummaryInformation) => (eachRequest.requestId === requestId
          ? { ...eachRequest, isDeleted: !eachRequest.isDeleted }
          : eachRequest));
      dispatch(setSummaryInformation(updatedTimeOfRequests));
    }
  };

  const filledCheckBox = () => (currentUserMode === UserRole.Manager ? isSelectedForManagerAction : isDeleted);

  const disabledCheckBox = currentUserMode === UserRole.Manager ? false : reviewStatus_Code !== pending;

  return (
    <div
      className={`${className} ${styles.timeOfRequestDetail}`}
      ref={root}
    >
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          xs={5.5}
          md={5.5}
          lg={5.5}
          className={styles.label}
        />
      </Grid>

      <Grid
        container
        className={`${styles.detailContainer} ${styles.expandedItemSeprator}`}
      >
        <Grid
          container
          className={styles.marginAtTopGrid}
        >
          <Grid
            item
            xs={5}
            md={5}
            lg={5}
            className={styles.dayKey}
          >
            <StyledCheckBox
              label={currentUserMode === UserRole.Manager ? t('nameWithColon') : t('dates')}
              disabled={disabledCheckBox}
              onChange={toggleDeleteStatus}
              labelStyle={styles.checkBoxLabel}
              checked={filledCheckBox()}
              className={styles.fillCheckBoxColor}
            />
          </Grid>
          <Grid
            item
            xs={7}
            md={7}
            lg={7}
            onClick={onRowClick}
            sx={{
              marginTop: '11px',
            }}
            className={styles.dayValue}
          >
            <Typography
              className={styles.typographyValue}
            >
              {currentUserMode === UserRole.Manager ? employeeName : startEndDates_DisplayTitle}
            </Typography>
          </Grid>
        </Grid>

        {
          currentUserMode === UserRole.Manager
          && (
            <Grid
              container
              onClick={onRowClick}
            >
              <Grid
                item
                xs={5}
                md={5}
                lg={5}
                className={styles.payCode1Key}
              >
                <Typography
                  className={styles.typographyHeading}
                >
                  {t('dates')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={7}
                md={7}
                lg={7}
                className={styles.payCode1Value}
              >
                <Typography
                  className={styles.typographyValue}
                >
                  {startEndDates_DisplayTitle}
                </Typography>
              </Grid>
            </Grid>
          )
        }

        <Grid
          container
          onClick={onRowClick}
          className={styles.marginBetweenGrids}
        >
          <Grid
            item
            xs={5}
            md={5}
            lg={5}
            className={styles.payCode1Key}
          >
            <Typography
              className={styles.typographyHeading}
            >
              {t('totalTime')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={7}
            md={7}
            lg={7}
            className={styles.payCode1Value}
          >
            <Typography
              className={styles.typographyValue}
            >
              {`${totalHoursDecimal} ${t('hrs')} - ${totalDays} ${t('days')}`}
            </Typography>
          </Grid>
        </Grid>
        {showHourTypes()}
        <ReviewStatus
          onRowClick={onRowClick}
          reviewStatus={t('reviewStatus')}
          reviewStatusTitle={reviewStatus_Title}
          reviewStatusColor={reviewStatus_Color}
          reviewStatusDisplayTitle={reviewStatus_DisplayTitle}
          reviewStatusCode={reviewStatus_Code}
        />
        <ProcessStatus
          onRowClick={onRowClick}
          processStatus={t('processStatus')}
          reviewStatusTitle={processStatus_DisplayTitle}
          reviewStatusDisplayTitle={processStatus_Title}
          reviewStatusCode={reviewStatus_Code}
        />
        {
          notesExist
          && (
          <Notes
            noteTitle={startEndDates_DisplayTitle}
            employeeName={employeeName}
            requestId={requestId}
          />
          )
        }
      </Grid>
    </div>
  );
}
