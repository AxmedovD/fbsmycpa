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
  const filteredTotal = ref(0)
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
    return orders.value
  })

  const hasActiveFilters = computed(() => {
    return Object.values(activeFilters.value).some(value => !!value)
  })

  const currentStatusCounts = computed(() => {
    if (!statusCounts.value) return {}
    // If there are active filters (except status), use filtered counts
    if (hasActiveFilters.value) {
      return statusCounts.value.filtered || {}
    }
    // Otherwise use total counts
    return statusCounts.value.total || {}
  })

  const fetchOrders = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        status: selectedStatus.value,
        ...filters
      }
      
      const response = await getOrders(params)
      orders.value = response.data || []
      totalOrders.value = response.meta?.total || 0
      filteredTotal.value = response.meta?.filtered_total || 0
      totalPages.value = response.meta?.last_page || 1
      statusCounts.value = {
        filtered: response.status_counts?.filtered || {},
        total: response.status_counts?.total || {}
      }
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
      last_edit_date_to: filters.lastEditDateTo,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined 
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

  const handleStatusChange = (status) => {
    selectedStatus.value = status
    currentPage.value = 1
    fetchOrders({
      ...activeFilters.value, 
      orderNumber: activeFilters.value.orderNumber,
      article: activeFilters.value.article,
      created_date_from: activeFilters.value.createdDateFrom,
      created_date_to: activeFilters.value.createdDateTo,
      last_edit_date_from: activeFilters.value.lastEditDateFrom,
      last_edit_date_to: activeFilters.value.lastEditDateTo
    })
  }

  return {
    orders,
    selectedOrders,
    selectedStatus,
    currentPage,
    perPage,
    totalPages,
    totalOrders,
    filteredTotal,
    statusCounts: currentStatusCounts,
    hasActiveFilters,
    filteredOrders,
    fetchOrders,
    handleFilterReset,
    handleFilterApply,
    handlePageUpdate,
    handlePerPageUpdate,
    handleSelectionChange,
    handleStatusChange
  }
}