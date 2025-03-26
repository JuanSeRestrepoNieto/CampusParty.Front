import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboard.service';
import './Dashboard.css';
import { storageService } from '../services/storage.service';
import { integracionService } from '../services/integracion.service';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'pabellones' | 'participants' | 'integracion'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const token = useAuth().token;
  const [addUserModal, setAddUserModal] = useState(false);
  const [pabellones, setPabellones] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [integracion, setIntegracion] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPabellon, setSelectedPabellon] = useState<any>(null);
  const [addPabellonModal, setAddPabellonModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    username: '',
    email: '',
    password: undefined,
    role: undefined
  });

  const [editPabellonForm, setEditPabellonForm] = useState({
    id: '',
    nombre: '',
    tematica: '',
    area: undefined,
    ubicacion: '',
    capacidad: undefined
  });
  const [editForm, setEditForm] = useState({
    id: '',
    username: '',
    email: '',
    password: undefined,
    role: undefined,
    name: undefined,
    capacity: undefined,
    location: undefined
  });
  const [editPabellon, setEditPabellon] = useState({
    id: '',
    name: '',
    capacity: undefined,
    location: ''
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [usersData, integracionData, pabellonesData] = await Promise.all([
        dashboardService.getUsers(token!),
        integracionService.getJSONPlaceHolder(),
        dashboardService.getPabellones(token!)
      ]);
      setUsers(usersData);
      setPabellones(pabellonesData);
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
      role: user.role,
      name: undefined,
      capacity: undefined,
      location: undefined
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (activeTab === 'users') {
      setEditUserForm(prev => ({ ...prev, [name]: value }));
    } else {
      setEditPabellonForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dashboardService.createUser({
        name: editUserForm.username,
        email: editUserForm.email,
        password: editUserForm.password,
        role: editUserForm.role
      }, token!);
      setSelectedUser(null);
      setEditUserForm({
        id: '',
        username: '',
        email: '',
        password: undefined,
        role: undefined
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditPabellon = (pabellon: any) => {
    setSelectedPabellon(pabellon);
    setEditPabellonForm({
      id: pabellon.id,
      nombre: pabellon.nombre,
      capacidad: pabellon.capacidad,
      ubicacion: pabellon.ubicacion,
      tematica: pabellon.tematica,
      area: pabellon.area
    });
  };

  const handleDeletePabellon = async (id: string) => {
    try {
      await dashboardService.deletePabellon(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting pabellon:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await dashboardService.deleteUser(id, token!);
      await fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreatePabellon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dashboardService.createPabellon({
        name: editPabellonForm.nombre,
        capacity: editPabellonForm.capacidad,
        location: editPabellonForm.ubicacion,
        tematica: editPabellonForm.tematica,
        area: editPabellonForm.area
      });
      setEditPabellonForm({
        id: '',
        nombre: '',
        tematica: '',
        area: undefined,
        ubicacion: '',
        capacidad: undefined
      });
      setAddPabellonModal(false)
      await fetchData();
    } catch (error) {
      console.error('Error creating pabellon:', error);
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

  const renderUpdatePabellon = () => {
    if (!selectedPabellon) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Editar Pabellon</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                name="id"
                value={editPabellonForm.id}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={editPabellonForm.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tematica</label>
              <input
                type="text"
                name="tematica"
                value={editPabellonForm.tematica}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Area</label>
              <input
                type="text"
                name="area"
                value={editPabellonForm.area}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ubicacion</label>
              <input
                type="text"
                name="ubicacion"
                value={editPabellonForm.ubicacion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacidad</label>
              <input
                type="number"
                name="capacidad"
                value={editPabellonForm.capacidad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-buttons">
              <button type="submit" onClick={(e) => {
                setAddPabellonModal(false)
                handleCreatePabellon(e)
              }} className="submit-button">Guardar</button>
              <button type="button" onClick={() => {
                setSelectedPabellon(null)
                setAddPabellonModal(false)
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

  const renderAddPabellon = () => {
    if (!addPabellonModal) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Crear Pabellón</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={editPabellonForm.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacidad</label>
              <input
                type="number"
                name="capacidad"
                value={editPabellonForm.capacidad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={editPabellonForm.ubicacion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Temática</label>
              <input
                type="text"
                name="tematica"
                value={editPabellonForm.tematica}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Área</label>
              <input
                type="text"
                name="area"
                value={editPabellonForm.area}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-buttons">
              <button type="submit" onClick={(e) => {
                setAddPabellonModal(false)
                handleCreatePabellon(e)
              }} className="submit-button">Guardar</button>
              <button type="button" onClick={() => {
                setAddPabellonModal(false)
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
                {users && users.length > 0 && users.map((user) => (
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
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="delete-button"
                      >
                        Eliminar
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
      case 'pabellones':
        return (
          <div className="dashboard-content">
            <h2>Pabellones</h2>
            <button onClick={() => setAddPabellonModal(true)} className="add-button">Nuevo Pabellón</button>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Capacidad</th>
                  <th>Ubicación</th>
                  <th>Temática</th>
                  <th>Área</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(pabellones) && pabellones.length > 0 ? (
                  pabellones.map((pabellon) => (
                    <tr key={pabellon.id}>
                      <td>{pabellon.id}</td>
                      <td>{pabellon.nombre}</td>
                      <td>{pabellon.capacidad}</td>
                      <td>{pabellon.ubicacion}</td>
                      <td>{pabellon.tematica}</td>
                      <td>{pabellon.area}</td>
                      <td>
                        <button onClick={() => handleEditPabellon(pabellon)} className="edit-button">Editar</button>
                        <button onClick={() => handleDeletePabellon(pabellon.id)} className="delete-button">Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No hay pabellones disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
            {renderAddPabellon()}
            {renderUpdatePabellon()}
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
          className={`nav-button ${activeTab === 'pabellones' ? 'active' : ''}`}
          onClick={() => setActiveTab('pabellones')}
        >
          Pabellones
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
