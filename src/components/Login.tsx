import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import './Login.css';
import logo from '../logo.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        email,
        password
      };

      const response = await authService.login(payload);

      // Actualizar el estado de autenticación
      login({
        id: response.id,
        name: response.name,
        email: response.email,
        role: 'user' // Aquí iría el rol real desde la respuesta del servidor
      }, response.token);

      // Redirigir al home
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Campus Party" className="login-logo" />
          <h1>Bienvenido a Campus Party</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="login-footer">
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
          <p><a href="#">¿Olvidaste tu contraseña?</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
