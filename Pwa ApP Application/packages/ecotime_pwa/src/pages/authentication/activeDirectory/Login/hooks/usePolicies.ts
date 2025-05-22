import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { extractString } from 'utilities';
import { SamlAndActiveDirectoryValidations } from 'appConstants';
import { rememberUserName } from 'utilities/cacheUtility';
import { resetServerValidation } from '../slice';
import { activeDirectoryLoginResponse } from '../selector';
import { IFormActiveDirectoryLogin } from '../types';

const usePolicies = ({
  userName: formUserName,
  rememberMe,
}: IFormActiveDirectoryLogin) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [linkText, setLinkText] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const { token, validation, isLoading } = useSelector(
    activeDirectoryLoginResponse,
  );

  const generateMessagWhenUserIsNotRegistered = (apiString: string) => {
    const { restWords, lastWord } = extractString(apiString);
    setServerErrorMessage(restWords);
    setLinkText(lastWord);
  };

  const resetFields = () => {
    setServerErrorMessage('');
    setLinkText('');
  };

  useEffect(() => {
    const handleLogin = () => {
      rememberUserName(rememberMe, formUserName);
      navigate('/dashboard');
    };
    const handleValidation = () => {
      setServerErrorMessage(validation?.statusMessage);
      setLinkText('');
    };

    if (token) {
      handleLogin();
    } else if (validation.statusCode) {
      if (validation?.statusCode
        === SamlAndActiveDirectoryValidations.UnRegisteredUser) {
        generateMessagWhenUserIsNotRegistered(validation?.statusMessage);
        dispatch(resetServerValidation());
      } else {
        handleValidation();
        dispatch(resetServerValidation());
      }
    }
  }, [token, navigate, validation]);

  return {
    serverErrorMessage,
    setServerErrorMessage,
    linkText,
    resetFields,
    isLoading,
  };
};

export default usePolicies;
