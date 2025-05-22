export interface ReusableActionInterface<T> {
  type: string
  payload: T;
  forResend?: boolean;
}
