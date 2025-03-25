import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Interfaces para las diferentes tablas
export interface Pabellon {
  id: string;
  nombre: string;
  tematica: string;
  area: number;
  ubicacion: string;
  capacidad: number;
  createdAt?: string;
}

export interface PabellonService {
  // Usuarios
  getAll: () => Promise<Pabellon[]>;
  getOne: (id: string) => Promise<Pabellon>;
  create: (data: Partial<Pabellon>) => Promise<Pabellon>;
  update: (id: string, data: Partial<Pabellon>) => Promise<Pabellon>;
  deleteOne: (id: string) => Promise<void>;
}

export const pabellonService: PabellonService = {
  // Usuarios
  getAll: async () => {
    const response = await axios.get(`${API_URL}/pabellon`);
    return response.data;
  },
  getOne: async (id) => {
    const response = await axios.get(`${API_URL}/pabellon/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(`${API_URL}/pabellon`, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/pabellon/${id}`, data);
    return response.data;
  },
  deleteOne: async (id) => {
    await axios.delete(`${API_URL}/pabellon/${id}`);
  }
};
