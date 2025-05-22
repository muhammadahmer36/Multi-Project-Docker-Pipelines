import React from 'react';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { timesheetManager } from 'appConstants';
import managerListView from 'assets/img/managerListView.svg';

export default function ManagerView() {
  const navigate = useNavigate();
  const onManagerView = () => {
    navigate(timesheetManager);
  };

  return (
    <IconButton onClick={onManagerView}>
      <img
        alt="managerListView"
        src={managerListView}
      />
    </IconButton>
  );
}
