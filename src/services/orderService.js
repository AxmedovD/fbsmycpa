import { API_BASE_URL } from './config'

export async function getOrders(params = {}) {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  // Build query parameters
  const queryParams = new URLSearchParams()
  
  if (params.page) {
    queryParams.append('page', params.page)
  }
  
  if (params.per_page) {
    queryParams.append('per_page', params.per_page)
  }
  
  if (params.orderNumber) {
    // Convert space-separated IDs to comma-separated format
    const formattedIds = params.orderNumber.trim().split(' ').filter(id => id).join(',')
    if (formattedIds) {
      queryParams.append('ordersId', formattedIds)
    }
  }

  if (params.created_date_from) {
    queryParams.append('created_date_from', params.created_date_from)
  }

  if (params.created_date_to) {
    queryParams.append('created_date_to', params.created_date_to)
  }

  if (params.last_edit_date_from) {
    queryParams.append('last_edit_date_from', params.last_edit_date_from)
  }

  if (params.last_edit_date_to) {
    queryParams.append('last_edit_date_to', params.last_edit_date_to)
  }

  if (params.store) {
    queryParams.append('store', params.store)
  }

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