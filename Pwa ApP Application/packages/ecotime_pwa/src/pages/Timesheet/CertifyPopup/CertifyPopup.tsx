import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { primaryBorderColor, primaryColor, white } from 'appConstants/colors';
import { getPayPeriodSummary, getVisibleCertifyPopup } from 'pages/Timesheet/selectors';
import { certifyTimesheet, setVisibleCertifyPopup } from 'pages/Timesheet/slice';
import { TimesheetActions } from 'pages/dashboard/types';
import { ButtonBase } from '@mui/material';
import { useManagerSelectedTimesheet } from 'common/hooks';

export default function InformationPopup() {
  const [t] = useTranslation();
  const visible = useSelector(getVisibleCertifyPopup);
  const { certifyMessage } = useSelector(getPayPeriodSummary) || {};
  const dispatch = useDispatch();
  const { empNo } = useManagerSelectedTimesheet();

  const handleClose = () => {
    dispatch(setVisibleCertifyPopup(false));
  };

  const handleOk = () => {
    dispatch(certifyTimesheet({
      actionId: TimesheetActions.Certitfy,
      employeeNumber: empNo || undefined,
    }));
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={visible}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${primaryBorderColor}`,
          paddingRight: '0px',
          height: '25px',
        }}
      >
        <DialogContentText
          sx={{
            color: primaryColor,
            fontWeight: '700',
            fontSize: '18px',
          }}
        >
          {t('certifyTimesheet')}
        </DialogContentText>

      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: primaryColor,
            fontWeight: '500',
            fontSize: '16px',
            paddingTop: '10px',
          }}
        >
          {certifyMessage && certifyMessage}
          {!certifyMessage
          && (
          <div>
            {t('certifyMessage')}
          </div>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ButtonBase
          sx={{
            height: '46px',
            width: '166px',
            borderRadius: '7px',
            border: `solid 2px ${primaryColor}`,
            color: primaryColor,
            fontSize: '18px',
            textTransform: 'none',
          }}
          onClick={handleCancel}
        >
          {t('cancel')}
        </ButtonBase>
        <ButtonBase
          sx={{
            height: '46px',
            width: '166px',
            borderRadius: '7px',
            border: `solid 2px ${primaryColor}`,
            backgroundColor: primaryColor,
            fontSize: '18px',
            color: white,
            textTransform: 'none',

          }}
          onClick={handleOk}
        >
          {t('ok')}
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
}
