import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from './app';

test('renders learn react link', () => {
  const initialState = { output: 10 };
  const mockStore = configureStore();
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  );
});
