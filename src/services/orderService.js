import { API_BASE_URL } from './config'

export async function getOrders(filters = {}) {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  let url = `${API_BASE_URL}/orders`
  
  // Add filters to URL if they exist
  if (filters.orderIds) {
    // Convert space-separated IDs to comma-separated format
    const formattedIds = filters.orderIds.split(' ').filter(id => id).join(',')
    url += `?orderIds=${formattedIds}`
  }

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
    throw new Error('Failed to fetch orders')
  }

  const data = await response.json()
  return data
}

export async function updateOrdersStatus(orderIds, status) {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/orders/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderIds,
      status
    })
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      throw new Error('Authentication expired')
    }
    throw new Error('Failed to update order status')
  }

  return await response.json()
}