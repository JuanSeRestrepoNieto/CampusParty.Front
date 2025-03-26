import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboard.service';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'participants'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    id: '',
    username: '',
    email: ''
  });
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [usersData] = await Promise.all([
        dashboardService.getUsers(token!),
        // dashboardService.getEvents(),
        // dashboardService.getParticipants()
      ]);
      console.log(usersData);
      setUsers(usersData);
      // setEvents(eventsData);
      // setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      id: user.id,
      username: user.username,
      email: user.email
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dashboardService.updateUser(editForm.id, editForm);
      setSelectedUser(null);
      setEditForm({ id: '', username: '', email: '' });
      await fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const renderEditModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Editar Usuario</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                name="id"
                value={editForm.id}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-buttons">
              <button type="submit" className="submit-button">Guardar</button>
              <button type="button" onClick={() => setSelectedUser(null)} className="cancel-button">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="dashboard-content">
            <h2>Usuarios</h2>
            <button className="add-button">Nuevo Usuario</button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="edit-button"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderEditModal()}
          </div>
        );
      case 'events':
        return (
          <div className="dashboard-content">
            <h2>Eventos</h2>
            <button className="add-button">Nuevo Evento</button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.name}</td>
                    <td>{event.description}</td>
                    <td>{event.date}</td>
                    <td>{event.location}</td>
                    <td>
                      <button className="edit-button">Editar</button>
                      <button className="delete-button">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'participants':
        return (
          <div className="dashboard-content">
            <h2>Participantes</h2>
            <button className="add-button">Nuevo Participante</button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Evento</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.id}</td>
                    <td>{participant.eventId}</td>
                    <td>{participant.userId}</td>
                    <td>{participant.status}</td>
                    <td>
                      <button className="edit-button">Editar</button>
                      <button className="delete-button">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard de Campus Party</h1>
        <div className="user-info">
          <span>Bienvenido, {localStorage.getItem('user') || 'Usuario'}</span>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </button>
        <button
          className={`nav-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Eventos
        </button>
        <button
          className={`nav-button ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          Participantes
        </button>
      </nav>

      <main className="dashboard-main">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div>
  );
};

export default Dashboard;
