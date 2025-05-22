import { UserRole } from 'common/types/types';
import { getTimesheetRole, getTimesheetUserCurrentRole } from 'pages/Timesheet/selectors';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import managerIcon from 'assets/img/managerIcon.svg';
import employeeIcon from 'assets/img/EmployeeIcon.svg';
import { useLocation } from 'react-router-dom';
import { timesheetManager, timesheetSearchManager } from 'appConstants';

interface Props {
    handleClickOnManager: () => void;
    handleClickOnEmployee: () => void;
  }

const renderIconButton = ({
  handleClickOnManager,
  handleClickOnEmployee,
}: Props) => {
  const timesheetUserCurrentRole = useSelector(getTimesheetUserCurrentRole);
  const timesheetUserRole = useSelector(getTimesheetRole);
  const { pathname } = useLocation();

  if ((timesheetUserRole === UserRole.Both && (pathname === timesheetSearchManager || pathname === timesheetManager))) {
    return (
      <IconButton onClick={handleClickOnEmployee}>
        <img src={employeeIcon} alt="employeeIcon" />
      </IconButton>
    );
  }

  if (((timesheetUserRole === UserRole.Both && timesheetUserCurrentRole === UserRole.Employee))) {
    return (
      <IconButton onClick={handleClickOnManager}>
        <img src={managerIcon} alt="managerIcon" />
      </IconButton>
    );
  }

  return null;
};
export default renderIconButton;
