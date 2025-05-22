import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { additionalInformation } from 'appConstants';
import { navigateToAdditionalDataForm } from '../slice';
import { getAdditionalDataForm } from '../selectors';

const useNavigateToAdditionalDataForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openAdditionalDataForm = useSelector(getAdditionalDataForm);

  useEffect(() => {
    if (openAdditionalDataForm) {
      navigate(additionalInformation);
      dispatch(navigateToAdditionalDataForm(false));
    }
  }, [openAdditionalDataForm]);
};

export default useNavigateToAdditionalDataForm;
