import RegistrationSuccess from './registrationSuccess';
import { fireEvent } from '@testing-library/react';
import { setupStore } from 'redux/store/mockStore';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<RegistrationSuccess />);
    });

    it('should dispatch on login button', async () => {
        const initialState1 = {
            authRes: {
                loginToConfrmCode: true,
                loginData: {
                    loginName: 'jk10015',
                    rememberMe: true,
                }
            },
        };
        const { getByText } = renderWithReduxAndRouter(<RegistrationSuccess />, { initialState: initialState1 });
        const loginButton = getByText('Next');
        await fireEvent.click(loginButton)
        const initialState = {}
        const store = setupStore(initialState)
        expect(store.dispatch({
            type: 'LOGIN_APP', payload:
            {
                data: {
                    loginName: 'jk10015',
                    rememberMe: true,
                    deviceId: '1',
                    deviceName: navigator.userAgent.replace(/\s+/g, ''),
                    password: 'Hbs123'
                }
            }
        })).
            toEqual({
                type: 'LOGIN_APP', payload: {
                    data: {
                        loginName: 'jk10015',
                        rememberMe: true,
                        deviceId: '1',
                        deviceName: navigator.userAgent.replace(/\s+/g, ''),
                        password: 'Hbs123'
                    }
                }
            });
    })
});
