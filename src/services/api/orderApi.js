import { API_BASE_URL } from '../config'

export async function fetchOrders(params = {}) {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  // Build query parameters
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (key === 'orderNumber') {
        // Convert space-separated IDs to comma-separated format
        const formattedIds = value.trim().split(/\s+/).filter(id => id).join(',')
        if (formattedIds) {
          queryParams.append('ordersId', formattedIds)
        }
      } else if (key === 'status' && value !== 'all') {
        // Only append status if it's not 'all'
        queryParams.append('status', value)
      } else {
        queryParams.append(key, value)
      }
    }
  })

  const url = `${API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

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
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch orders')
  }

  return response.json()
}

export async function updateOrderStatus(orderIds, status) {
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
    const error = await response.json()
    throw new Error(error.message || 'Failed to update order status')
  }

  return response.json()
}