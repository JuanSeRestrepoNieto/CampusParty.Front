import axios from 'axios';

const API_URL = 'http://localhost:3001';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const authService = {
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
};
