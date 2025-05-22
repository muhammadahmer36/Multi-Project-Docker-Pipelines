import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { formatsMapper } from 'core/utils';
import { primaryColor, activeColor } from 'appConstants/colors';
import { RenderDayProps } from '../types';
import styles from '../DateCalendar.module.scss';

const renderDay = (props: RenderDayProps) => {
  const {
    highlightedDays, badgeStyleClass, styledBadgeContentIcon, ...rest
  } = props;

  const { day } = rest;

  const shouldRenderIcon = highlightedDays.includes(day.format(formatsMapper['MM/DD/YYYY']));

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      className={badgeStyleClass}
      badgeContent={
        shouldRenderIcon ? (
          <FiberManualRecordIcon
            className={styledBadgeContentIcon}
            htmlColor={primaryColor}
          />
        ) : null
      }
    >
      <PickersDay {...rest} />
    </Badge>
  );
};

export default renderDay;

const commonStyles = {
  sx: {
    color: `${primaryColor}`,
  },
};

export const slotProps = {
  day: {
    sx: {
      '&.MuiPickersDay-root.Mui-selected': {
        backgroundColor: `${activeColor}`,
      },
    },
    className: styles.styledDateCalendarDay,
  },
  leftArrowIcon: commonStyles,
  rightArrowIcon: commonStyles,
  switchViewIcon: commonStyles,
  calendarHeader: commonStyles,
};
