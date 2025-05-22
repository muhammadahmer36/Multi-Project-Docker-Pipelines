import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ReactWindowList from 'components/ReactWindowList';
import { sortData } from 'utilities';
import { getPunchHistory } from '../selectors';
import Header from './Header';
import Item from './Item';
import { setPunchHistory } from '../slice';
import { SortableTypes, SortOrderRows, SortOrderRowsKeys } from '../types';
import styles from './HistoryDetail.module.scss';

export default function HistoryDetail() {
  const historyList = useSelector(getPunchHistory);

  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(historyList.length).fill(false));
  const [sortingOrder, setSortingOrder] = useState({
    rowOneDescending: false,
    rowTwoDescending: false,
    rowThreeDescending: false,
  });
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const handleSortingOrder = (headerLabel: string) => {
    switch (headerLabel) {
      case SortableTypes.Type:
        return sortingOrder.rowThreeDescending;
      case SortableTypes.Date:
        return sortingOrder.rowOneDescending;
      case SortableTypes.Time:
        return sortingOrder.rowTwoDescending;
      default:
        return false;
    }
  };

  const handleSort = (sortAbleType: SortableTypes) => {
    const iconMap: Record<string, string> = {
      [SortableTypes.Type]: SortOrderRowsKeys.rowThreeDescending,
      [SortableTypes.Time]: SortOrderRowsKeys.rowTwoDescendin,
      [SortableTypes.Date]: SortOrderRowsKeys.rowOneDescending,
    };

    const iconName = iconMap[sortAbleType] as keyof SortOrderRows;
    setSortingOrder((previousState) => ({
      ...previousState,
      [iconName]: !previousState[iconName],
    }));

    const sortType = handleSortingOrder(sortAbleType);

    const sortedData = sortData(historyList, sortAbleType, sortType);
    dispatch(setPunchHistory(sortedData));
  };

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = historyList[index];
    return (
      <div key={index} style={{ ...style }}>
        <Item
          item={item}
          lastRow={historyList.length - 1 === index}
          index={index}
        />
      </div>
    );
  };

  return (
    <div>
      <Header
        rowData={sortingOrder}
        onSorted={handleSort}
      />
      {historyList.length < 1
        && (
          <div className={styles.emptyPunchHistory}>
            {t('thereIsNoPunchHistory')}
          </div>
        )}
      {
        historyList.length >= 1 && (
          <ReactWindowList
            setExpandedItems={setExpandedItems}
            expandedItems={expandedItems}
            data={historyList}
            rowRenderer={rowRenderer}
          />
        )
      }

    </div>
  );
}
