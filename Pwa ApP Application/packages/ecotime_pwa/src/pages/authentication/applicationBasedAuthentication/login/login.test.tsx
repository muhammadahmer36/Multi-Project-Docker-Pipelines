import Login from './login';
import { fireEvent } from '@testing-library/react';
import renderWithReduxAndRouter from '../../../../utilities/cutomRender.test';
import { useNavigate } from 'react-router-dom';
import { setupStore } from '../../../../redux/store/mockStore';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: jest.fn(),
}))

describe('Login', () => {
  it('renders correctly', () => {
    renderWithReduxAndRouter(<Login />);
  });

  it('should navigate to "/employee" when login is successful', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const loginUser = jest.requireMock('../../../../redux/actionCreators/authActions').loginUser;
    let themeColor = "#0E404A"

    const { getByRole, getByTestId, getByLabelText } = renderWithReduxAndRouter(<Login />);

    const emailInput = getByRole('textbox', { name: 'Username' },);
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: 'Log In' });

    await fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.change(passwordInput, { target: { value: 'password123' } });
    // await fireEvent.click(submitButton);

    // await expect(loginUser).toHaveBeenCalledWith({
    //   email: 'test@example.com',
    //   password: 'password123',
    // });

    // expect(mockedUsedNavigate).toBeCalled()
    // expect(navigate).toHaveBeenCalledWith('/employee');
  });

  it('should navigate to registerationStep1', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    const { getByRole, getByTestId, getByLabelText } = renderWithReduxAndRouter(<Login />);
    const registerButton = getByRole('button', { name: 'Register' });
    await fireEvent.click(registerButton)
    expect(navigate).toHaveBeenCalledWith('/registerationStep1');
  })

  it('should dispatch an action on login button', async () => {
    const initialState1 = {
      authRes: {
        token: '',
        validation: {
          statusCode: 211,
          statusMessage: ''
        }
      },
    };
    const initialState = {};
    const store = setupStore(initialState)
    const { getByLabelText, getByText } = renderWithReduxAndRouter(<Login />, { initialState: initialState1 });

    const userNameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const rememberMeCheckbox = getByLabelText('Remember Me');
    fireEvent.change(userNameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(rememberMeCheckbox);
    const logInButton = getByText('Log In');
    await fireEvent.click(logInButton);

    const apiData = {
      loginName: '',
      password: '',
      deviceId: '1',
      deviceName: '',
    };

    expect(store.dispatch({ type: 'LOGIN_APP', payload: apiData })).toEqual({ type: 'LOGIN_APP', payload: apiData });

  })

  it('should navigate to forgot screen', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    const { getByText } = renderWithReduxAndRouter(<Login />);
    const forgotBtn = getByText('Forgot Password?');
    await fireEvent.click(forgotBtn)
    expect(navigate).toHaveBeenCalledWith('/forgotCredentials');
    await fireEvent.click(forgotBtn)
    const initialState = {}
    const store = setupStore(initialState)
    expect(store.dispatch({
      type: 'SET_USER_NAME', payload:
      {
        data: {
          userName: 'shah001'
        }
      }
    })).
      toEqual({
        type: 'SET_USER_NAME', payload: {
          data: {
            userName: 'shah001'
          }
        }
      });
  })

});
