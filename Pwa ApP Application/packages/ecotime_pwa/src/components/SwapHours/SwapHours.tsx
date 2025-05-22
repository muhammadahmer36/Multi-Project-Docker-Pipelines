import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDetailItemsOfTimeOffRequest } from 'pages/TimeOffCalendar/slice';
import { getItemDetailOfTimeOffRequests } from 'pages/TimeOffCalendar/selectors';
import IconButton from '@mui/material/IconButton';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { zeroDuration } from 'appConstants';
import { TimeOffRequestItemDetail } from 'pages/TimeOffCalendar/types';
import styles from './SwapHours.module.scss';

interface SwapHoursProps {
  itemIndex: number;
  primaryPayCode: number;
  primaryDuration: number;
  secondaryDuration: number;
  secondaryPayCode: number;
}

export default function SwapHours(props: SwapHoursProps) {
  const {
    itemIndex, primaryPayCode, secondaryPayCode, primaryDuration, secondaryDuration,
  } = props;
  const dispatch = useDispatch();
  const ItemsDetail = useSelector(getItemDetailOfTimeOffRequests);

  const handleSwapHours = () => {
    const updatedItemsDetail = ItemsDetail.map((item: TimeOffRequestItemDetail, rowIndex: number) => {
      if (rowIndex === itemIndex) {
        const { duration1, duration2, ...rest } = item;
        return {
          ...rest,
          duration1: duration2,
          duration2: duration1,
        };
      }
      return item;
    });
    dispatch(setDetailItemsOfTimeOffRequest(updatedItemsDetail));
  };

  return (
    <div className={styles.swapHours}>
      {(!(primaryPayCode === zeroDuration || secondaryPayCode === zeroDuration))
        && (!(primaryDuration === zeroDuration && secondaryDuration === zeroDuration)) && (
          <IconButton
            onClick={handleSwapHours}
          >
            <SwapVertRoundedIcon
              className={styles.swapIcon}
            />
          </IconButton>
      )}
    </div>
  );
}
