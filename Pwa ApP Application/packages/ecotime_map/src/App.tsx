import TimelineIcon from '@mui/icons-material/Timeline';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import Map from 'components/pages/Map';
import { useGeofencing } from 'provider/geofencing/hooks';
import { Geofence } from 'api/types';
import Paper from '@mui/material/Paper';
import Delete from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import * as api  from 'api/client';
import { useSnackbar } from 'provider/snackbar/hooks';

const drawerWidth = 300;

 function App() {
  const {
    geofences,
    getPolygon,
    getGeofencesList,
    setPolygons,
    setSelectedItemIndex,
    selectedItemIndex,
    setVisibleGeofencePopup,
    setGeofenceForm } = useGeofencing();
  const { showSnackbar } = useSnackbar();
  const [deleteInProgess, setDeleteInProgess] = React.useState(false);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelect =(geofenceId: number, index: number)=> (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    getPolygon(geofenceId);
    setSelectedItemIndex(index);
  }

    const deletePolygon = async (id: number) => {
      try {
        setDeleteInProgess(true);
        const response = await api.deleteGeofencesVertex(id);
        const { data, validation } = response.data;
        const {id: geofenceId } = data;
        if(validation && validation.statusCode && validation.statusCode === 61) {
          showSnackbar(validation.statusMessage, 'error')   
        }
        else if(geofenceId){
          setPolygons([[]])
          getGeofencesList();
          showSnackbar(validation.statusMessage, 'success')
        }
      } catch (error) {
          // Handle error
      }
      finally {
        setDeleteInProgess(false);
      }
    }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars   
    const onDelete =(geofenceId: number)=> (event: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
      deletePolygon(geofenceId);
    }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars   
    const onEdit =(item: Geofence)=> (event: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
      setGeofenceForm(item)
      setVisibleGeofencePopup(true)
    }

    const drawer = (
      <List sx={{ pl: 2, pr: 2}}>
        {geofences.length === 0 ? (
          <ListItem 
            disablePadding 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '43vh' }} >
            <Typography fontSize={18} fontWeight='500'>No Data</Typography>
          </ListItem>
        ) : (
          geofences.map((item: Geofence, index: number) => (
            <React.Fragment key={item.id}>
              <Paper 
                elevation={2}
                variant="elevation"
                sx={{ mb: 1, backgroundColor: selectedItemIndex  === index ? '#C0C0C0' : undefined }}
                
                >
                <ListItem
                  disablePadding
                  secondaryAction={
                    <ListItem disablePadding>
             
                    <ListItemButton
                    disabled={deleteInProgess} 
                    onClick={onEdit(item)}
                    sx={{
                    paddingRight: '0px',
                    paddingLeft: '0px' }}
                    >
                      <EditIcon />
                    </ListItemButton>
                    <ListItemButton
                    disabled={deleteInProgess} 
                    onClick={onDelete(item.id)}
                    sx={{
                    paddingRight: '0px',
                    paddingLeft: '0px' }}
                    >
                      <Delete />
                    </ListItemButton>
                    </ListItem>
                 
                    
                  }
                  >
                  <ListItemButton onClick={onSelect(item.id, index)}>
                    <ListItemIcon>
                      <TimelineIcon  fontSize='large'/>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography
                          sx={{
                              maxWidth: '90%',
                              fontWeight: '500',
                              overflowWrap:
                              'break-word'
                             }}>{item.title}</Typography>}
                      secondary={<Typography 
                          sx={{
                          maxWidth: '100%', 
                          overflowWrap: 'break-word'
                        }}>
                          {item.description || ''}
                          </Typography>}
                    />
                  </ListItemButton>
              
                </ListItem>
              </Paper>
            </React.Fragment>
          ))
        )}
      </List>
    );
    

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block'},
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          height:'100vh',
          width: `calc(100vw - ${drawerWidth}px)`

        }}
      >
        <Map />
      </Box>
    </Box>
  );
}

export default App