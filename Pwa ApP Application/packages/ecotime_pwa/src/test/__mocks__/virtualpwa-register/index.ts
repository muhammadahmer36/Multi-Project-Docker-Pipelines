/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable block-spacing */
export function useRegisterSW(options?: any): any {
  return {
    isRegistered: true,
    registration: null,
    register: jest.fn(),
    update: jest.fn(),
    unregister: jest.fn(),
    ...options,
  };
}
