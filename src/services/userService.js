import { API_BASE_URL } from './config'

export async function getUserProfile() {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      throw new Error('Authentication expired')
    }
    throw new Error('Failed to fetch user profile')
  }

  const data = await response.json()
  return data.data
}