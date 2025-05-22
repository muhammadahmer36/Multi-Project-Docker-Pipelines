import { getSelectedTimesheet } from 'pages/TimesheetManager/selectors';
import { useSelector } from 'react-redux';
import useTimesheetManagerView from './useTimesheetManagerView';

export default function useManagerSelectedTimesheet() {
  const selectedTimesheet = useSelector(getSelectedTimesheet);
  const timesheetManagerView = useTimesheetManagerView();

  if (timesheetManagerView && selectedTimesheet) {
    return selectedTimesheet;
  }
  return {};
}
