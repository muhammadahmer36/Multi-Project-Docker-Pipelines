import * as React from 'react';
import { Dayjs } from 'core/utils';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { commonStyles } from './utils';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
  label: string;
  showAmPmColumn?: boolean;
  closePickerOnTimeSelection?: boolean;
  /* eslint-disable no-unused-vars */
  handleOkButton: (date: Dayjs | null) => void;
  handleOnChange?: (date: Dayjs | null) => void;
  value: Dayjs
}

export default function TimePicker({
  label, handleOkButton,
  closePickerOnTimeSelection = false, showAmPmColumn = false, value, handleOnChange,
}: TimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <DesktopTimePicker
          ampm={showAmPmColumn}
          slotProps={{
            openPickerIcon: {
              ...commonStyles,
            },
            desktopPaper: {
              className: styles.timePicker,
            },
          }}
          closeOnSelect={closePickerOnTimeSelection}
          onAccept={handleOkButton}
          onChange={handleOnChange}
          className="styledTextField"
          label={label}
          value={value}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
