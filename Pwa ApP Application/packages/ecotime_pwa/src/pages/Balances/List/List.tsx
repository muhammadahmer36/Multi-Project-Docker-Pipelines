import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { VariableSizeList } from 'react-window';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { balanceListItemHeight } from 'appConstants';
import { balanceCategory } from 'appConstants';
import Item from '../Item';
import { GroupedBalanceSummary } from '../types';
import Row from './Row';
import styles from './List.module.scss';

export default function List({ groupedBalance }: GroupedBalanceSummary) {
  const { sectionName, columnName, balances } = groupedBalance;

  const [t] = useTranslation();
  const navigate = useNavigate();
  const listRef = useRef<VariableSizeList>(null);

  if (!balances) {
    return null;
  }

  const handleKeyDown = (
    event: React.KeyboardEvent,
    balanceGroupId: number,
    category: string,
    employeeNumber: string,
    sectionName: string,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(balanceCategory, {
        state: {
          balanceGroupId, category, employeeNumber, sectionName,
        },
      });
    }
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    balanceGroupId: number,
    category: string,
    employeeNumber: string,
    sectionName: string,
  ) => {
    navigate(balanceCategory, {
      state: {
        balanceGroupId, category, employeeNumber, sectionName,
      },
    });
  };

  const rowHeights = new Array(balances.length).fill(true).map(() => 50);

  const getItemSize = (index: number) => rowHeights[index];

  const getHeight = () => {
    const singleGridHeight = balanceListItemHeight * balances.length;
    return singleGridHeight;
  };

  return (
    <div>
      {balances && (
        <div className={styles.list}>
          <div className={styles.sectionHeading}>{sectionName}</div>
          <div className={styles.title}>
            <Item value={t('category')} />
            <Item value={columnName} />
          </div>
          <AutoSizer disableHeight>
            {({ width }: HorizontalSize) => (
              <VariableSizeList
                ref={listRef}
                height={getHeight()}
                width={width}
                itemSize={getItemSize}
                itemCount={balances.length}
              >
                {({ index }) => (
                  <Row
                    sectionName={sectionName}
                    index={index}
                    balances={balances}
                    handleKeyDown={handleKeyDown}
                    handleItemClick={handleItemClick}
                  />
                )}
              </VariableSizeList>
            )}
          </AutoSizer>
        </div>
      )}
      {balances.length <= 0 && (
        <div className={styles.noDataFound}>
          {t('noDataFound')}
        </div>
      )}
    </div>
  );
}
