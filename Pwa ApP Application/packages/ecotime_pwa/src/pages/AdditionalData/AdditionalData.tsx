import React from 'react';
import { useTranslation } from 'react-i18next';
import BottomBar from 'layout/bottomBar/bottomBar';
import Header from 'layout/header/header';
import Form from './DynamicForm';

export default function AdditionalData() {
  const [t] = useTranslation();

  return (
    <>
      <Header formLabel={t('additionalInformation')} />
      <Form />
      <BottomBar />
    </>
  );
}
