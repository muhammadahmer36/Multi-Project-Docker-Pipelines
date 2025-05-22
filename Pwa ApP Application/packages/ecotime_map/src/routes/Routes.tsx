import App from "App";
import Unauthrorized from "components/pages/Unauthrorized";
import { getValueFromSessionStorage } from "core/utils";
import { Routes, Route, Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const token = getValueFromSessionStorage("token");
    return token ? <>{element}</> : <Navigate to="/401" replace />;
  };
  
  export default function AppRoutes()  {

    return (
      <Routes>
        <Route >
          <Route >
            <Route path="/" element={<PrivateRoute element={<App />} />} />
          </Route>
        </Route>
        <Route path="/401" element={<Unauthrorized />} />
      </Routes>
    );
  }
  

