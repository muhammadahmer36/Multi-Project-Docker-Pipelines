import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetServerErrorTexts } from 'redux/actionCreators';
import { extractString } from 'utilities/index';
import * as appConstants from 'appConstants';
import { authResponse } from '../selector';

const useFlows = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverErrorMessage, setServerErrorMessage] = useState(' ');
  const [linkText, setLinkText] = useState('');
  const [statusCode, setStatusCode] = useState(0);

  const {
    validation,
  } = useSelector(authResponse);

  useEffect(() => {
    if (validation) {
      if (validation?.statusCode
        === appConstants.ValidationStatusCodes.ForgotPasswordSucc) {
        navigate(appConstants.resetPasword, { state: { isAccountActivation: false } });
      } else if (validation?.statusCode
        === appConstants.ValidationStatusCodes.ForgotUserNameSucc
      ) {
        const
          { restWords, lastWord } = extractString(validation?.statusMessage);
        setServerErrorMessage(restWords);
        setLinkText(lastWord);
        setStatusCode(validation?.statusCode);
      } else if (validation?.statusCode
        === appConstants.ValidationStatusCodes.UnRegisteredUser) {
        const
          { restWords, lastWord } = extractString(validation?.statusMessage);
        setLinkText(lastWord);
        setServerErrorMessage(restWords);
        setStatusCode(validation?.statusCode);
      } else {
        setStatusCode(validation?.statusCode);
        setServerErrorMessage(validation?.statusMessage);
      }
    }
    dispatch(resetServerErrorTexts());
  }, [validation, navigate]);

  return {
    serverErrorMessage,
    linkText,
    statusCode,
    setServerErrorMessage,
    setLinkText,
  };
};
export default useFlows;
