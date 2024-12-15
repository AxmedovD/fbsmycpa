import { ref, computed } from 'vue'
import { getOrders } from '@/services/orderService'

export function useOrders() {
  const orders = ref([])
  const selectedOrders = ref([])
  const selectedStatus = ref('all')
  const currentPage = ref(1)
  const perPage = ref(20)
  const loading = ref(false)
  const error = ref(null)
  const totalOrders = ref(0)
  const totalPages = ref(1)
  const statusCounts = ref({
    filtered: {},
    total: {}
  })

  const activeFilters = ref({
    orderNumber: '',
    article: '',
    createdDateFrom: '',
    createdDateTo: '',
    lastEditDateFrom: '',
    lastEditDateTo: ''
  })

  const filteredOrders = computed(() => {
    if (!orders.value) return []
    
    return orders.value.filter(order => {
      if (selectedStatus.value !== 'all' && order.status.toLowerCase() !== selectedStatus.value) {
        return false
      }
      return true
    })
  })

  const fetchOrders = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        ...filters
      }
      
      const response = await getOrders(params)
      orders.value = response.data || []
      totalOrders.value = response.meta?.total || 0
      totalPages.value = response.meta?.last_page || 1
      statusCounts.value = response.status_counts || { filtered: {}, total: {} }
      selectedOrders.value = []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching orders:', err)
    } finally {
      loading.value = false
    }
  }

  const handleFilterReset = () => {
    activeFilters.value = {
      orderNumber: '',
      article: '',
      createdDateFrom: '',
      createdDateTo: '',
      lastEditDateFrom: '',
      lastEditDateTo: ''
    }
    selectedStatus.value = 'all'
    currentPage.value = 1
    fetchOrders()
  }

  const handleFilterApply = (filters) => {
    activeFilters.value = filters
    currentPage.value = 1
    fetchOrders({ 
      orderNumber: filters.orderNumber,
      article: filters.article,
      created_date_from: filters.createdDateFrom,
      created_date_to: filters.createdDateTo,
      last_edit_date_from: filters.lastEditDateFrom,
      last_edit_date_to: filters.lastEditDateTo
    })
  }

  const handlePageUpdate = (page) => {
    currentPage.value = page
    fetchOrders(activeFilters.value)
  }

  const handlePerPageUpdate = (size) => {
    perPage.value = size
    currentPage.value = 1
    fetchOrders(activeFilters.value)
  }

  const handleSelectionChange = (selected) => {
    selectedOrders.value = selected
  }

  return {
    // State
    orders,
    selectedOrders,
    selectedStatus,
    currentPage,
    perPage,
    loading,
    error,
    totalOrders,
    totalPages,
    statusCounts,
    activeFilters,
    filteredOrders,
    
    // Methods
    fetchOrders,
    handleFilterReset,
    handleFilterApply,
    handlePageUpdate,
    handlePerPageUpdate,
    handleSelectionChange
  }
}