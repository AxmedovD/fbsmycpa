import { ref, computed } from 'vue'

export function useOrdersTable(props, emit) {
  const selectedOrders = ref([])
  const pageSizes = [20, 50, 100]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const totalPrice = computed(() => {
    return props.orders.reduce((sum, order) => sum + parseFloat(order.totalSumm), 0)
  })

  const selectedOrdersTotal = computed(() => {
    return props.orders
      .filter(order => selectedOrders.value.includes(order.orderId))
      .reduce((sum, order) => sum + parseFloat(order.totalSumm), 0)
  })

  const isAllSelected = computed(() => {
    return props.orders.length > 0 && 
      props.orders.every(order => selectedOrders.value.includes(order.orderId))
  })

  const toggleAllOrders = (event) => {
    const checkbox = event.target
    if (checkbox.checked) {
      selectedOrders.value = props.orders.map(order => order.orderId)
    } else {
      selectedOrders.value = []
    }
    emit('selection-change', selectedOrders.value)
  }

  const toggleOrder = (orderId) => {
    const index = selectedOrders.value.indexOf(orderId)
    if (index === -1) {
      selectedOrders.value.push(orderId)
    } else {
      selectedOrders.value.splice(index, 1)
    }
    emit('selection-change', [...selectedOrders.value])
  }

  const updatePerPage = (size) => {
    emit('update:per-page', size)
  }

  const getShortcut = (size) => {
    switch (size) {
      case 20: return '⌘1'
      case 50: return '⌘2'
      case 100: return '⌘3'
      default: return ''
    }
  }

  return {
    selectedOrders,
    pageSizes,
    formatDate,
    totalPrice,
    selectedOrdersTotal,
    isAllSelected,
    toggleAllOrders,
    toggleOrder,
    updatePerPage,
    getShortcut
  }
}