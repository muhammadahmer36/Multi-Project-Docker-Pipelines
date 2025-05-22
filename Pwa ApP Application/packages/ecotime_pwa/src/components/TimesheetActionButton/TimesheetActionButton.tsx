import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getActions } from 'pages/Timesheet/selectors';
import { Action } from 'pages/Timesheet/types';
import { useTimsheetManagerView } from 'common/hooks';
import Builder from './Builder';
import CertifyUncertify from './CertifyUncertify';
import styles from './TimesheetActionButton.module.scss';
import ApprovedUnapprove from './ApprovedUnapprove';
import ManagerView from './ManagerView';

export const certifyUncertifyKey = 1999;
export const aprovedUnapprove = 1998;
export const managerListView = 1997;

interface Props {
  hideActionIds?: number[];
}

export default function ActionButton({ hideActionIds = [] }: Props) {
  const actions = useSelector(getActions) || [];
  const [items, setItems] = useState([]);
  const managerView = useTimsheetManagerView();

  const actionItems = items.sort((a: Action, b: Action) => a.displayOrder - b.displayOrder)
    // eslint-disable-next-line react/no-array-index-key
    .map(({ actionId }: Action, index: number) => <Builder key={`${actionId}-${index}`} actionId={actionId} />);

  const builderItems = [
    ...actionItems,
    <CertifyUncertify key={certifyUncertifyKey} />,
  ];

  useEffect(() => {
    if (actions?.length > 0) {
      const newActions = [...actions] as [];
      setItems(newActions);
    }
  }, [actions]);

  if (managerView) {
    const timesheetManagerActionButtons = [
      <ApprovedUnapprove key={aprovedUnapprove} />,
      ...builderItems,
      <ManagerView key={managerListView} />,
    ];

    const builderItemsFilteredManagerView = timesheetManagerActionButtons.filter((item: ReactElement) => {
      const { key } = item;
      if (typeof key === 'string' || typeof key === 'number') {
        const keyPrefix = key.toString().split('-')[0];
        return ![certifyUncertifyKey, ...hideActionIds].includes(Number(keyPrefix));
      }
      return true;
    });
    return (
      <div className={styles.container}>
        {builderItemsFilteredManagerView}
      </div>
    );
  }

  const builderItemsFiltered = builderItems.filter((item: ReactElement) => {
    const { key } = item;
    if (typeof key === 'string' || typeof key === 'number') {
      const keyPrefix = key.toString().split('-')[0];
      return !hideActionIds.includes(Number(keyPrefix));
    }
    return true;
  });

  return (
    <div className={styles.container}>
      {builderItemsFiltered}
    </div>
  );
}
