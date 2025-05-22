import React from 'react';
import IconButton from '@mui/material/IconButton';
import managerIcon from 'assets/img/managerIcon.svg';
import EmployeeIcon from 'assets/img/EmployeeIcon.svg';
import { UserRole } from 'common/types/types';
import styles from './SwitchRoleButton.module.scss';

interface Props {
  handleClickOnManagerIcon?: () => void
  handleClickOnEmployeeIcon?: () => void
  hideRoleIcon?: boolean;
  currentUserMode?: number;
}

export default function SwitchRoleButton(props: Props) {
  const {
    handleClickOnManagerIcon, handleClickOnEmployeeIcon, hideRoleIcon, currentUserMode,
  } = props;

  if (hideRoleIcon) {
    return null;
  }

  return (
    <div className={styles.switchRole}>
      {currentUserMode !== UserRole.Manager ? (
        <IconButton
          onClick={handleClickOnManagerIcon}
        >
          <img
            src={managerIcon}
            alt="managerIcon"
            className={styles.icon}
          />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleClickOnEmployeeIcon}
        >
          <img
            src={EmployeeIcon}
            alt="employeeIcon"
            className={styles.icon}
          />
        </IconButton>
      )}
    </div>
  );
}
