export const dateTimeInformation = {
  dateFormat: 'MM/dd/yyyy',
  dateTimeFormat: 'MM/dd/yyyy hh:mm tt',
  dateTimeFormatClockWidget: 'hh:mm:ss tt',
  timeFormat: 'hh:mm tt',
};

export const applicationInfo = {
  userEmpNo: '',
  userEmployeeName: '',
  appHeader: '',
  appFooter: '',
  messageCount: 0,
  numCharsForAutoComplete: 0,
  ...dateTimeInformation,
};

export const timeAndDateInformation = { ...dateTimeInformation };
