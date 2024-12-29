import * as orderApi from './api/orderApi'

export async function getOrders(params = {}) {
  try {
    const response = await orderApi.fetchOrders({
      page: params.page,
      per_page: params.per_page,
      orderNumber: params.orderNumber,
      article: params.article,
      status: params.status,
      created_date_from: params.created_date_from,
      created_date_to: params.created_date_to,
      last_edit_date_from: params.last_edit_date_from,
      last_edit_date_to: params.last_edit_date_to
    })
    return response
  } catch (error) {
    console.error('Error in getOrders:', error)
    throw error
  }
}

export async function updateOrdersStatus(orderIds, status) {
  try {
    return await orderApi.updateOrderStatus(orderIds, status)
  } catch (error) {
    console.error('Error in updateOrdersStatus:', error)
    throw error
  }
}