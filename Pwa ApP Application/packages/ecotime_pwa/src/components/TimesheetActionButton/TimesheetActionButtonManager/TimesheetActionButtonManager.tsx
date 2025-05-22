import React, { ReactNode } from 'react';
import ManagerView from '../ManagerView';
import ApprovedUnapprove from '../ApprovedUnapprove';

interface Props {
  children: ReactNode;
}

export const aprovedUnapprove = 1998;
export const managerListView = 1997;

export default function TimesheetActionButtonManager({ children }: Props) {
  return (
    <>
      <ApprovedUnapprove key={aprovedUnapprove} />
      {children}
      <ManagerView key={managerListView} />
    </>

  );
}
