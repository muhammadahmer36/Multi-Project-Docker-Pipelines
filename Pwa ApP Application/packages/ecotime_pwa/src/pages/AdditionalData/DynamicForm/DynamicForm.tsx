import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import Box from '@mui/material/Box';
import {
  BackDrop, Loader, OfflineModal, StyledButton,
} from 'components';
import { getCurrentPunch } from 'pages/dashboard/TimePunches/selector';
import { TimePunch } from 'pages/dashboard/TimePunches/types';
import { dashboard, previousPage } from 'appConstants';
import FormBuilder from '../FormBuilder';
import {
  getAdditionalInformationIn,
  getAdditionalInformationOut,
  getAdditionalInformationTransfer,
  getLoaderState,
  getUniqueId,
} from '../selectors';
import PunchHeaderInformation from '../PunchHeaderInformation';
import { postAdditionalDataForm, setPunchHeaderInformation } from '../slice';
import { IFormAdditionalData, IPunchAdditionalInfo } from '../types';
import styles from './DynamicForm.module.scss';

export function Form(): JSX.Element | null {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showOpenOfflineActionSnackBar, setOfflineMessage } = OfflineModal.useModalContext();
  const additionalInformationIn = useSelector(getAdditionalInformationIn);
  const additionalInformationOut = useSelector(getAdditionalInformationOut);
  const additionalInformationTransfer = useSelector(getAdditionalInformationTransfer);
  const uniqueIndentifier = useSelector(getUniqueId);
  const currentPunch = useSelector(getCurrentPunch);
  const isLoading = useSelector(getLoaderState);

  const { TimeIn, TimeOut, Transfer } = TimePunch;

  const punchMapping: { [key: string]: IPunchAdditionalInfo } = {
    [TimeIn]: additionalInformationIn,
    [TimeOut]: additionalInformationOut,
    [Transfer]: additionalInformationTransfer,
  };

  const currentAdditionalInformation: IPunchAdditionalInfo = punchMapping[currentPunch] || [];

  const onSubmit: SubmitHandler<FieldValues | IFormAdditionalData> = (data) => {
    const currentPunchDetail = currentAdditionalInformation.punchDetails;
    dispatch(postAdditionalDataForm({
      data, currentPunchDetail, uniqueIndentifier,
    }));
    setOfflineMessage(t('additionalInformationOfflineMessage'));
    navigate(previousPage);
    dispatch(setPunchHeaderInformation(''));
    showOpenOfflineActionSnackBar();
  };

  const {
    handleSubmit, control, formState,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { isValid, isDirty } = formState;
  const componentnList = (Array.isArray(currentAdditionalInformation.punchDetails)
    ? currentAdditionalInformation.punchDetails
    : []).map((punchDetail) => (
      <React.Fragment key={punchDetail.fldId}>
        <FormBuilder
          punchDetail={punchDetail}
          punchTasksList={Array.isArray(currentAdditionalInformation.punchTasksList)
            ? currentAdditionalInformation.punchTasksList
            : []}
          control={control}
        />
        <Box className={styles.spaceBetweenFields} />
      </React.Fragment>
  ));

  const handleCancelButton = () => {
    navigate(dashboard);
  };

  return (
    <>
      <BackDrop
        openBackDrop={isLoading}
      />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.formBox}
      >
        <PunchHeaderInformation />
        {componentnList}
        <Box
          sx={{ '& > :not(style)': { m: '0px 4px' } }}
          className={styles.container}
        >
          <StyledButton
            fullWidth
            onClick={handleCancelButton}
            variant="outlined"
            className={styles.cancelButton}
          >
            {t('cancel')}
          </StyledButton>
          <StyledButton
            type="submit"
            fullWidth
            disabled={!isValid || !isDirty}
            variant="contained"
            className={styles.submitButton}
          >
            {t('submit')}
          </StyledButton>
        </Box>
        <Loader
          showLoader={isLoading}
        />
      </Box>
    </>
  );
}

export default Form;
