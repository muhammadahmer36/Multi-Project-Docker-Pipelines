import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UseFormSetValue } from 'react-hook-form';
import { SamlAndActiveDirectoryValidations } from 'appConstants';
import { extractString } from 'utilities';
import { resetValidation } from '../slice';
import { RegistrationResponse } from '../selector';
import { ISetValue } from '../types';

const useFlows = (setValue: UseFormSetValue<ISetValue>) => {
  const navigate = useNavigate();
  const [linkText, setLinkText] = useState('');
  const dispatch = useDispatch();
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const { employeeDetail, validation, isLoading } = useSelector(RegistrationResponse);

  const resetField = () => {
    setServerErrorMessage('');
    setLinkText('');
  };

  const onClickLink = () => {
    navigate('/ada/login');
  };

  const setUserData = () => {
    const {
      employeeEmail, loginName, employeeName, employeeNumber,
    } = employeeDetail;
    setValue('employeeEmail', employeeEmail);
    setValue('userName', loginName);
    setValue('employeeName', employeeName);
    setValue('employeeNumber', employeeNumber);
  };

  useEffect(() => {
    if (validation?.statusCode) {
      if (
        validation.statusCode
        === SamlAndActiveDirectoryValidations.SuccessfullRegister
      ) {
        navigate('/ada/registrationSuccess');
      } else if (
        validation.statusCode
        === SamlAndActiveDirectoryValidations.AlreadyRegisteredUser
      ) {
        const { restWords, lastWord } = extractString(
          validation?.statusMessage,
        );
        setServerErrorMessage(restWords);
        setLinkText(lastWord);
      } else {
        setServerErrorMessage(validation?.statusMessage);
        setLinkText('');
      }
      dispatch(resetValidation());
    }
  }, [validation]);

  useEffect(() => {
    setUserData();
  }, []);

  return {
    serverErrorMessage,
    linkText,
    isLoading,
    resetField,
    onClickLink,
  };
};

export default useFlows;
