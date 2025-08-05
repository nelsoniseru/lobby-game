
const API_BASE =  'http://localhost:4000/auth';

export async function registerUser(form) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  console.log(data)
  if (!res.ok) throw new Error(data.data?.message || 'Registration failed');
  return data.data;
}

export async function loginUser(form) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.data?.message || 'Login failed');
  return data.data;
}
