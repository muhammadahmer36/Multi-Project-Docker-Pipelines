import { useRegisterSW } from 'virtual:pwa-register/react';
import Routes from '../routes';
import useAuthNavigation from './hooks/useAuthNavigation';

function App() {
  useRegisterSW({ immediate: true });
  useAuthNavigation();

  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
