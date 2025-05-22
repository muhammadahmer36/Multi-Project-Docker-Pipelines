import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyledText } from 'components';
import styles from '../AddNotes.module.scss';

export default function DialogHeader() {
  const [t] = useTranslation();
  return (
    <div className={styles.dialogHeaderContainer}>
      <StyledText
        className={styles.dialogHeadingClass}
      >
        {t('addNotes')}
      </StyledText>
    </div>
  );
}
