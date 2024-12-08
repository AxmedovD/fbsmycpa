const API_BASE_URL = 'https://api.mycpa.uz/api';

// Function to handle user login
export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

// Function to handle user registration
export async function register(name, email, password, passwordConfirmation, store) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      store,
    }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}
