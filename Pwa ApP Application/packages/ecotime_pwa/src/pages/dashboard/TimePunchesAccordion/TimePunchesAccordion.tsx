import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Geofencing, StyledButton } from 'components';
import Typography from '@mui/material/Typography';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import TimePunches from 'pages/dashboard/TimePunches';
import RunningClock from 'pages/dashboard/RunningClock';
import { getClockComponentItems } from 'pages/dashboard/TimePunches/selector';
import { getTimePunches } from 'pages/dashboard/selectors';
import Stack from '@mui/material/Stack';
import { APP_VERSION } from 'enviroments';
import { APP_CURRENT_VERSION, punchHistory } from 'appConstants';
import { Resource } from 'common/types/types';
import { timePunchingComponents } from '../TimePunches/slice';
import { ITimePunchesAccordionProps } from '../types';
import styles from './TimePunchesAccordion.module.scss';

function TimePunchesAccordion({ isExpanded, onChange }: ITimePunchesAccordionProps) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timePunches = useSelector(getTimePunches);
  const clockComponentItems = useSelector(getClockComponentItems);

  const refresh = () => {
    dispatch(timePunchingComponents());
  };

  const navigateToPunchHistory = () => {
    navigate(punchHistory);
  };

  return (
    <Geofencing.GeofencingResource resourceId={Resource.TimePunches}>
      <div className={styles.TimePunchesAccordion}>
        {timePunches && clockComponentItems.length > 0 && (
        <Accordion
          onChange={onChange}
          defaultExpanded={isExpanded}
          sx={{
            borderRadius: '7px',
            border: '2px solid rgba(14, 64, 74, 0.10)',
            boxShadow: '0px 3px 8px 0px rgba(0, 0, 0, 0.08)',
          }}
        >
          <AccordionSummary
            className={styles.accordianHeight}
            expandIcon={<ExpandMoreIcon className={styles.iconColor} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <MoreTimeIcon className={styles.iconColor} />
            <Typography ml={2} className={styles.accordianHeading}>
              {timePunches?.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RefreshOutlinedIcon className={styles.refreshIcon} onClick={refresh} />
            <RunningClock />
            <TimePunches />
            <Stack
              mt={2}
              spacing={1}
              direction="row"
              className={styles.centerWidgetButtons}
            >
              {
                APP_VERSION !== APP_CURRENT_VERSION && (
                  <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={styles.widgetsButtons}
                  >
                    Report Missed Punch
                  </StyledButton>
                )
              }

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                className={styles.widgetsButtons}
                onClick={navigateToPunchHistory}
              >
                {t('punchHistory')}
              </StyledButton>
            </Stack>
          </AccordionDetails>
        </Accordion>
        )}
      </div>
    </Geofencing.GeofencingResource>

  );
}
export default TimePunchesAccordion;
