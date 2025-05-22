import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { obscureEmail, extractString } from '../utilities';
import setupStore from '../redux/store/mockStore';
import './i18n';

type RenderWithReduxAndRouterProps = {
  initialState?: Record<string, unknown>,
  store?: any,
  email?: string
};

const renderWithReduxAndRouter = (
  ui: React.ReactElement,
  {
    initialState = {},
    email = 'harisal7555@gmail.com',
    store = setupStore(initialState),
    ...renderOptions
  }: RenderWithReduxAndRouterProps = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>

      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
export default renderWithReduxAndRouter;

test('placeholder test', () => {
  expect(true).toBe(true);
});