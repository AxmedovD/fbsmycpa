import { API_BASE_URL } from './config'

export async function getFinanceData(store) {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const queryParams = new URLSearchParams({
    status: 'sold'
  })
  
  if (store) {
    queryParams.append('store', store)
  }

  const url = `${API_BASE_URL}/orders?${queryParams.toString()}`

  const response = await fetch(url, {
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
    throw new Error('Failed to fetch finance data')
  }

  const data = await response.json()
  return data
}