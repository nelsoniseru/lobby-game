export const saveAuthData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuthToken = () => localStorage.getItem('token');

export const getAuthUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
