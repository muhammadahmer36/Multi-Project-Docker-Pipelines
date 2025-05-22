import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UseFormSetValue } from 'react-hook-form';
import { SamlAndActiveDirectoryValidations, samlUserRegistrationSuccess } from 'appConstants';
import { resetValidation } from 'pages/authentication/saml/slice';
import { getRegistrationResponseFromMsal } from 'pages/authentication/saml/selector';
import { ISetValue } from 'pages/authentication/common/types';

const useFlows = (setValue: UseFormSetValue<ISetValue>) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { SuccessfullRegister } = SamlAndActiveDirectoryValidations;
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const { employeeDetail, validation, isLoading } = useSelector(getRegistrationResponseFromMsal);

  const resetField = () => {
    setServerErrorMessage('');
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
      if (validation.statusCode
        === SuccessfullRegister) {
        navigate(samlUserRegistrationSuccess);
      } else {
        setServerErrorMessage(validation?.statusMessage);
      }
      dispatch(resetValidation());
    }
  }, [validation]);

  useEffect(() => {
    setUserData();
  }, []);

  return {
    serverErrorMessage, isLoading, resetField,
  };
};

export default useFlows;
