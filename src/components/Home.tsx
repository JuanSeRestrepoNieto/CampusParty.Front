import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import logo from '../logo.svg';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-left">
          <img src={logo} alt="Campus Party" className="nav-logo" />
        </div>
        <div className="nav-right">
          {user ? (
            <div className="user-profile">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/auth" className="nav-link">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>

      <main className="home-main">
        <section className="hero-section">
          <h1>Bienvenido a Campus Party</h1>
          <p>La mayor comunidad de innovación y tecnología del mundo</p>
          <div className="hero-buttons">
            <Link to="/events" className="primary-button">
              Ver Eventos
            </Link>
            <Link to="/community" className="secondary-button">
              Unirme a la Comunidad
            </Link>
          </div>
        </section>

        <section className="features-section">
          <h2>¿Qué Ofrecemos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Eventos en Vivo</h3>
              <p>Participa en conferencias, talleres y hackathons en tiempo real</p>
            </div>
            <div className="feature-card">
              <h3>Comunidad Global</h3>
              <p>Conéctate con miles de profesionales y entusiastas de la tecnología</p>
            </div>
            <div className="feature-card">
              <h3>Recursos Educativos</h3>
              <p>Accede a contenido exclusivo y aprende de los mejores expertos</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Campus Party</h4>
            <p>La comunidad más grande de innovación y tecnología</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <Link to="/about" className="footer-link">Acerca de</Link>
            <Link to="/contact" className="footer-link">Contacto</Link>
            <Link to="/faq" className="footer-link">Preguntas Frecuentes</Link>
          </div>
          <div className="footer-section">
            <h4>Redes Sociales</h4>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Campus Party. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
