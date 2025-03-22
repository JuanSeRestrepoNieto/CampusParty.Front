import React from 'react';
import Login from './Login';
import Register from './Register';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login />
      ) : (
        <Register />
      )}
    </div>
  );
};

export default Auth;
