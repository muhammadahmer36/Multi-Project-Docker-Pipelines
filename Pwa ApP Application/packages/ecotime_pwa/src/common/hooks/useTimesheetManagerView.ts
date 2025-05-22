import { UserRole } from 'common/types/types';
import { getTimesheetRole, getTimesheetUserCurrentRole } from 'pages/Timesheet/selectors';
import { useSelector } from 'react-redux';

export default function useTimesheetManagerView() {
  const timesheetUserCurrentRole = useSelector(getTimesheetUserCurrentRole);
  const timesheetUserRole = useSelector(getTimesheetRole);

  if (timesheetUserRole === UserRole.Both && timesheetUserCurrentRole === UserRole.Manager) {
    return true;
  }
  if (timesheetUserRole === UserRole.Manager) {
    return true;
  }
  return false;
}
