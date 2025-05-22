import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { primaryBorderColor, primaryColor } from 'appConstants/colors';
import { getEmployeeInformation, getVisibleInformationPopup } from '../selectors';
import { setVisibleInformationPopup } from '../slice';

export default function InformationPopup() {
  const [t] = useTranslation();
  const visible = useSelector(getVisibleInformationPopup);
  const employeeInformation = useSelector(getEmployeeInformation);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setVisibleInformationPopup(false));
  };

  // eslint-disable-next-line react/no-array-index-key
  const information = employeeInformation.map((item: string, index: number) => <div key={index}>{item}</div>);

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '25px',
          borderBottom: `1px solid ${primaryBorderColor}`,
          paddingRight: '0px',
        }}
      >
        <DialogContentText sx={{
          color: primaryColor,
          fontWeight: '700',
          fontSize: '18px',
        }}
        >
          {t('employeeInformation')}
        </DialogContentText>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: 'auto', color: primaryColor }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color: primaryColor,
          fontWeight: '500',
          fontSize: '16px',
          paddingTop: '10px',
        }}
      >
        {information}
        {information.length === 0 && (
          <div>
            {t('noEmployeeInformationFound')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
