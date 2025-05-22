import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './List.module.scss';
import Item from '../Item';
import { getBalanceCategories } from '../selectors';

export default function List() {
  const [t] = useTranslation();
  const categories = useSelector(getBalanceCategories);

  // need to implement virtualization list

  const categoriesList = categories.map((option: { type: string, hours: string, balanceGroupId: number }) => (
    <div key={option.type} className={styles.content}>
      <Item value={option.type} />
      <Item value={option.hours} />
    </div>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div className={styles.title}>
          <Item value={t('Type')} isHeading />
          <Item value={t('hours')} isHeading />
        </div>
        {categoriesList}

      </div>
      {categoriesList.length === 0
      && (
      <div className={styles.noDataFound}>
        {t('noDataFound')}
      </div>
      )}
    </div>
  );
}
