import React from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Routes, RouteConfig } from '../types/routes';
import Home from './Home';
import Register from './Register';
import Auth from './Auth';

const routeConfig: RouteConfig[] = [
  {
    path: Routes.HOME,
    element: <Home />,
  },
  {
    path: Routes.AUTH,
    element: <Auth />,
  },
  {
    path: Routes.REGISTER,
    element: <Register />,
  },
  // Aquí puedes agregar más rutas protegidas
  // {
  //   path: Routes.EVENTS,
  //   element: <Events />,
  //   private: true,
  // },
];

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  const renderRoutes = () => {
    return routeConfig.map((route) => {
      if (route.private && !user) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={<Navigate to={Routes.AUTH} replace />}
          />
        );
      }
      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      );
    });
  };

  return <ReactRoutes>{renderRoutes()}</ReactRoutes>;
};

export default AppRoutes;
