import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Interfaces para las diferentes tablas
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
}

export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  status: string;
}

export interface DashboardService {
  // Usuarios
  getUsers: () => Promise<User[]>;
  getUser: (id: string) => Promise<User>;
  createUser: (data: Partial<User>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;

  // Eventos
  getEvents: () => Promise<Event[]>;
  getEvent: (id: string) => Promise<Event>;
  createEvent: (data: Partial<Event>) => Promise<Event>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;

  // Participantes
  getParticipants: () => Promise<Participant[]>;
  getParticipant: (id: string) => Promise<Participant>;
  createParticipant: (data: Partial<Participant>) => Promise<Participant>;
  updateParticipant: (id: string, data: Partial<Participant>) => Promise<Participant>;
  deleteParticipant: (id: string) => Promise<void>;
}

export const dashboardService: DashboardService = {
  // Usuarios
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/auth/all`);
    return response.data;
  },
  getUser: async (id) => {
    const response = await axios.get(`${API_URL}/auth/${id}`);
    return response.data;
  },
  createUser: async (data) => {
    const response = await axios.post(`${API_URL}/auth`, data);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await axios.put(`${API_URL}/auth/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    await axios.delete(`${API_URL}/auth/${id}`);
  },

  // Eventos
  getEvents: async () => {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  },
  getEvent: async (id) => {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  },
  createEvent: async (data) => {
    const response = await axios.post(`${API_URL}/events`, data);
    return response.data;
  },
  updateEvent: async (id, data) => {
    const response = await axios.put(`${API_URL}/events/${id}`, data);
    return response.data;
  },
  deleteEvent: async (id) => {
    await axios.delete(`${API_URL}/events/${id}`);
  },

  // Participantes
  getParticipants: async () => {
    const response = await axios.get(`${API_URL}/participants`);
    return response.data;
  },
  getParticipant: async (id) => {
    const response = await axios.get(`${API_URL}/participants/${id}`);
    return response.data;
  },
  createParticipant: async (data) => {
    const response = await axios.post(`${API_URL}/participants`, data);
    return response.data;
  },
  updateParticipant: async (id, data) => {
    const response = await axios.put(`${API_URL}/participants/${id}`, data);
    return response.data;
  },
  deleteParticipant: async (id) => {
    await axios.delete(`${API_URL}/participants/${id}`);
  }
};
