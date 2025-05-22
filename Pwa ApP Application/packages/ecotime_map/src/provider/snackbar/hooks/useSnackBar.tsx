import { useContext } from "react";
import { SnackbarContext } from "../Provider";

export const useSnackbar= () => {
    const context = useContext(SnackbarContext);
    if (!context) {
      throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
  };