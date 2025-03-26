import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboard.service';
import './Dashboard.css';
import { storageService } from '../services/storage.service';
import { integracionService } from '../services/integracion.service';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'participants' | 'integracion'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const token = useAuth().token;
  const [addUserModal, setAddUserModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [integracion, setIntegracion] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    id: '',
    username: '',
    email: '',
    password: undefined,
    role: undefined
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [usersData, integracionData] = await Promise.all([
        dashboardService.getUsers(token!),
        integracionService.getJSONPlaceHolder()
      ]);
      setUsers(usersData);
      setIntegracion(integracionData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    console.log(token);
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
      email: user.email,
      password: undefined,
      role: user.role
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
      await dashboardService.createUser({
        name: editForm.username, 
        email: editForm.email,
        password: editForm.password,
        role: editForm.role
      }, token!);
      setSelectedUser(null);
      setEditForm({ id: '', username: '', email: '', password: undefined, role: undefined });
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
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={editForm.role}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                name="password"
                value={editForm.password}
                onChange={handleInputChange}
                disabled
              />
            </div> 
            <div className="modal-buttons">
              <button type="submit" className="submit-button">Guardar</button>
              <button type="button" onClick={() => {
                setSelectedUser(null)
                
                }} className="cancel-button">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAddUser = () => {
    if (!addUserModal) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Crear Usuario</h3>
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={editForm.role}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                name="password"
                value={editForm.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-buttons">
              <button type="submit" onClick={() => setSelectedUser(null)} className="submit-button">Guardar</button>
              <button type="button" onClick={() => {
                setSelectedUser(null)
                setAddUserModal(false)
                }} className="cancel-button">Cancelar</button>
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
            <button onClick={() => setAddUserModal(true)} className="add-button">Nuevo Usuario</button>
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
            {renderAddUser()}
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
      case 'integracion':
        return (
          <div className="dashboard-content">
            <h2>Integracion</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titulo</th>
                  <th>Body</th>
                </tr>
              </thead>
              <tbody>
                {integracion.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.body}</td>
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
        <button
          className={`nav-button ${activeTab === 'integracion' ? 'active' : ''}`}
          onClick={() => setActiveTab('integracion')}
        >
          Integracion
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
