import React from 'react';
import { TimePicker } from 'components';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Dayjs, getFormattedDuration } from 'core/utils';
import styles from './SwapDuration.module.scss';

interface SwapDurationProps {
  durationHeading: string;
  timePickerLabel: string;
  secondaryPayCode: number;
  primaryHourType: string;
  secondaryHourType: string;
  hoursText: string;
  primaryDuration: Dayjs;
  secondaryDuration: Dayjs;
  /* eslint-disable no-unused-vars */
  savePrimaryDuration: (duration: Dayjs | null) => void;
  saveSecondaryDuration: (duration: Dayjs | null) => void;
  onChangePrimaryDuration:(duration: Dayjs | null) => void;
  onChangeSecondaryDuration:(duration: Dayjs | null) => void;
  handleSwapHours: () => void
}
export default function SwapDuration(props: SwapDurationProps) {
  const {
    durationHeading, timePickerLabel, primaryHourType, handleSwapHours,
    secondaryHourType, hoursText, savePrimaryDuration, saveSecondaryDuration, onChangePrimaryDuration,
    primaryDuration, secondaryDuration, secondaryPayCode, onChangeSecondaryDuration,
  } = props;

  return (
    <div className={styles.swapDuration}>

      <div
        className={styles.borderBox}
      >
        <Typography
          className={styles.hoursTypeHeading}
        >
          {primaryHourType}
        </Typography>
        <Divider variant="middle" className={styles.divider} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Typography
            className={styles.duration}
          >
            {durationHeading}
          </Typography>
          <Typography
            className={styles.hoursValue}
          >
            {`${getFormattedDuration(primaryDuration.hour(), primaryDuration.minute())} ${hoursText}`}
          </Typography>
        </Box>
        <Box
          className={styles.timePickerContainer}
        >
          <TimePicker
            value={primaryDuration}
            handleOnChange={onChangePrimaryDuration}
            handleOkButton={savePrimaryDuration}
            label={timePickerLabel}
          />
        </Box>
      </div>

      {
        secondaryPayCode !== 0
        && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div className={styles.swapIconBackGround}>
                <IconButton
                  onClick={handleSwapHours}
                >
                  <SwapVertRoundedIcon
                    className={styles.swapIcon}
                  />
                </IconButton>
              </div>
            </Box>

            <div
              className={styles.borderBox}
            >
              <Typography
                className={styles.hoursTypeHeading}
              >
                {secondaryHourType}
              </Typography>
              <Divider variant="middle" className={styles.divider} />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  className={styles.duration}
                >
                  {durationHeading}
                </Typography>
                <Typography
                  className={styles.hoursValue}
                >
                  {`${getFormattedDuration(secondaryDuration.hour(), secondaryDuration.minute())} ${hoursText}`}
                </Typography>
              </Box>
              <Box
                className={styles.timePickerContainer}
              >
                <TimePicker
                  value={secondaryDuration}
                  handleOnChange={onChangeSecondaryDuration}
                  handleOkButton={saveSecondaryDuration}
                  label={timePickerLabel}
                />
              </Box>
            </div>
          </>
        )
      }
    </div>
  );
}
