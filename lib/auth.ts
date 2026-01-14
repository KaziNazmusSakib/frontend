import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'strict' });
};

export const getAuthToken = () => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getUserRole = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};