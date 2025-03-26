import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const integracionService = {
  getJSONPlaceHolder: async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  }
};