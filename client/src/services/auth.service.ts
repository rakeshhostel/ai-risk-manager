import api from './api';

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response;
  } catch (err) {
    // Fallback for demo when backend is not running
    if (credentials.email === 'admin@demo.com' && credentials.password === 'admin123') {
      return {
        data: {
          token: 'demo-token-' + Date.now(),
          user: { _id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'admin' }
        }
      };
    }
    throw err;
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  return { data: { success: true } };
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch {
    return { data: { user: null } };
  }
};
