import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Geofencing, ReactWindowList, StyledTextField, TimeOffPageFooter,
} from 'components';
import Box from '@mui/material/Box';
import Header from 'layout/header/header';
import BottomBar from 'layout/bottomBar/bottomBar';
import { formatsMapper, getDateAgainstFormat } from 'core/utils';
import {
  heightForAddTimeOffDetailGridContainer, previousPage,
  yearMonthDayFormat,
} from 'appConstants';
import { openPopup } from 'components/Popup/slice';
import { Severity } from 'components/SnackBar/types';
import { Resource } from 'common/types/types';
import {
  getAddTimeOffRequestFormValues,
  getItemDetailOfTimeOffRequests, getSuccessTimeOffRequest,
  getSummaryOfItemsDetail,
} from 'pages/TimeOffCalendar/selectors';
import {
  saveTimeOffRequest, resetSaveTimeOffRequest, setDetailItemsOfTimeOffRequest,
  updateItemDetail, saveEndDateOfTimeOffRequest, resetAddTimeOfRequestFormValues,
  getTimeOffRequests,
} from 'pages/TimeOffCalendar/slice';
import { validateMaximumHoursOfAllTimeOfRequests, validateZeroHours } from 'pages/TimeOffCalendar/utils';
import DetailHeader from './Header';
import Item from './Item';
import GridFooter from './GridFooter';
import styles from './SaveTimeOffRequest.module.scss';

export default function AddTimeOffStep2() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ItemsDetail = useSelector(getItemDetailOfTimeOffRequests);
  const timeOffRequestInitialFormValues = useSelector(getAddTimeOffRequestFormValues);
  const summaryOfItemsDetail = useSelector(getSummaryOfItemsDetail);
  const successfullyCreatedTimeOffRequest = useSelector(getSuccessTimeOffRequest);

  const { startDate: summaryStartDate, endDate: summaryEndDate, requestId } = summaryOfItemsDetail;
  const timeOffRequestStartDate = getDateAgainstFormat(summaryStartDate);
  const timeOffRequestEndDate = getDateAgainstFormat(summaryEndDate);

  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(ItemsDetail.length).fill(false));

  const onExpandAll = () => {
    setExpandedItems(new Array(ItemsDetail.length).fill(true));
  };

  const onCollapseAll = () => {
    setExpandedItems(new Array(ItemsDetail.length).fill(false));
  };

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = ItemsDetail[index];
    return (
      <div key={index} style={{ ...style }}>
        <Item
          item={item}
          lastRow={ItemsDetail.length - 1 === index}
          index={index}
        />
      </div>
    );
  };

  const handlePreviousClick = () => {
    navigate(previousPage);
    dispatch(setDetailItemsOfTimeOffRequest([]));
    dispatch(updateItemDetail([]));
  };

  const handleSaveButton = () => {
    const { notes } = timeOffRequestInitialFormValues;
    if (!validateMaximumHoursOfAllTimeOfRequests(ItemsDetail)) {
      dispatch(openPopup({
        message: t('maximumHoursValidation'),
        severity: Severity.ERROR,
      }));
    } else if (validateZeroHours(ItemsDetail)) {
      dispatch(openPopup({
        message: t('zeroHoursValidation'),
        severity: Severity.ERROR,
      }));
    } else {
      const saveTimeOfRequestPayload = {
        summaryStartDate,
        summaryEndDate,
        timeOffRequestId: requestId,
        notes,
      };
      dispatch(saveTimeOffRequest(saveTimeOfRequestPayload));
    }
  };

  useEffect(() => {
    const backToTimeOffScreen = -2;
    if (successfullyCreatedTimeOffRequest) {
      dispatch(saveEndDateOfTimeOffRequest(timeOffRequestEndDate));
      dispatch(resetSaveTimeOffRequest());
      dispatch(resetAddTimeOfRequestFormValues());
      const getDate = getDateAgainstFormat(timeOffRequestEndDate, formatsMapper[yearMonthDayFormat]);
      dispatch(getTimeOffRequests({ date: getDate }));
      navigate(backToTimeOffScreen);
    }
  }, [successfullyCreatedTimeOffRequest]);

  return (
    <div>
      <Header formLabel={t('newTimeOffRequests')} />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimeOff} />
      <Geofencing.GeofencingResource resourceId={Resource.TimeOff}>
        <Box
          mt={2}
          ml={2}
          mr={2}
        >
          <StyledTextField
            value={`${timeOffRequestStartDate}-${timeOffRequestEndDate}`}
            label={t('date')}
          />
        </Box>
        <Box mt={1} ml={2} mr={2}>
          <div
            className={styles.gridContainer}
            style={{
              boxSizing: 'border-box',
              height: `calc(100vh - ${heightForAddTimeOffDetailGridContainer}px)`,
            }}
          >
            <DetailHeader
              onExpand={onExpandAll}
              onCollapse={onCollapseAll}
              expandedItems={expandedItems}
            />
            <Box
              className={styles.listBox}
            >
              {
                ItemsDetail.length > 0 && (
                  <ReactWindowList
                    setExpandedItems={setExpandedItems}
                    expandedItems={expandedItems}
                    data={ItemsDetail}
                    rowRenderer={rowRenderer}
                  />
                )
              }
            </Box>
            <GridFooter />
          </div>
          <TimeOffPageFooter
            primaryLabel={t('previous')}
            secondaryLabel={t('save')}
            footerClass={styles.footer}
            handleSecondaryButton={handleSaveButton}
            handlePrimaryButton={handlePreviousClick}
            shouldButtonDisable={false}
          />
        </Box>
        <BottomBar />
      </Geofencing.GeofencingResource>
    </div>
  );
}
