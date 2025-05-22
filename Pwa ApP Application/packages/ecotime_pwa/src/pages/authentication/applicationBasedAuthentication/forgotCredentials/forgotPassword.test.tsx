import { useNavigate } from 'react-router-dom';
import { fireEvent } from '@testing-library/react'
import ForgotPassword from './forgotCredentials';;
import { setupStore } from 'redux/store/mockStore';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: jest.fn(),
}))

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<ForgotPassword />);
    });

    it('should navigate to login screen', async () => {
        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        const { getByTestId } = renderWithReduxAndRouter(<ForgotPassword />);
        const backButton = getByTestId('et-icon');
        await fireEvent.click(backButton)
        expect(navigate).toHaveBeenCalledWith('/login');
    })

    it('should dispatch on next button', async () => {
        const initialState1 = {
            authRes: {
                userName: 'shah001',
                validation: {
                    statusCode: 211,
                    statusMessage: ''
                }
            },
        };
        const { getByText } = renderWithReduxAndRouter(<ForgotPassword />, { initialState: initialState1 });
        const ConfirmButton = getByText('Next');
        await fireEvent.click(ConfirmButton)
        const initialState = {}
        const store = setupStore(initialState)
        expect(store.dispatch({
            type: 'USER_FORGOT_PASSWORD', payload:
            {
                data: {
                    loginName: 'shah001',
                }
            }
        })).
            toEqual({
                type: 'USER_FORGOT_PASSWORD', payload: {
                    data: {
                        loginName: 'shah001',
                    }
                }
            });
    })

});

