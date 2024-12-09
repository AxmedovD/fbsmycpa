<template>
  <div class="max-w-full">
    <OrderFilters
      @reset="handleFilterReset"
      @apply="handleFilterApply"
    />

    <div class="mt-6 flex gap-6">
      <StatusFilter
        v-model:status="selectedStatus"
        :orders="orders"
      />
      <div class="flex-1 min-w-0">
        <OrdersTable 
          :orders="filteredOrders"
          :per-page="perPage"
          @selection-change="handleSelectionChange"
          @update:per-page="handlePerPageUpdate"
        />
      </div>
    </div>

    <OrdersActions
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-orders="totalOrders"
      :selected-count="selectedOrders.length"
      :selected-orders="selectedOrders"
      :start-index="startIndex"
      :end-index="endIndex"
      :orders="filteredOrders"
      :per-page="perPage"
      @update:page="handlePageUpdate"
      @status-updated="fetchOrders"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import StatusFilter from '@/components/orders/StatusFilter.vue'
import OrdersActions from '@/components/orders/OrdersActions.vue'
import { getOrders } from '@/services/orderService'
import { useUser } from '@/composables/useUser'

const selectedStatus = ref('all')
const currentPage = ref(1)
const perPage = ref(20)
const selectedOrders = ref([])
const orders = ref([])
const loading = ref(false)
const error = ref(null)
const totalOrders = ref(0)
const totalPages = ref(1)

const { userStore } = useUser()

const activeFilters = ref({
  orderNumber: '',
  createdDateFrom: '',
  createdDateTo: '',
  lastEditDateFrom: '',
  lastEditDateTo: ''
})

// Handle keyboard shortcuts for per-page selection
const handleKeyPress = (event) => {
  if (event.metaKey || event.ctrlKey) {
    switch (event.key) {
      case '1':
        handlePerPageUpdate(20)
        break
      case '2':
        handlePerPageUpdate(50)
        break
      case '3':
        handlePerPageUpdate(100)
        break
    }
  }
}

onMounted(() => {
  fetchOrders()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

const fetchOrders = async (filters = {}) => {
  try {
    loading.value = true
    error.value = null
    
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      store: userStore.value,
      ...filters
    }
    
    const response = await getOrders(params)
    orders.value = response.data
    totalOrders.value = response.meta.total
    totalPages.value = Math.ceil(response.meta.total / perPage.value)
    selectedOrders.value = [] // Reset selection after fetching new orders
  } catch (err) {
    error.value = err.message
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (selectedStatus.value !== 'all' && order.status.toLowerCase() !== selectedStatus.value) {
      return false
    }
    return true
  })
})

const startIndex = computed(() => (currentPage.value - 1) * perPage.value + 1)
const endIndex = computed(() => Math.min(startIndex.value + perPage.value - 1, totalOrders.value))

const handleFilterReset = () => {
  activeFilters.value = {
    orderNumber: '',
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
    created_date_from: filters.createdDateFrom,
    created_date_to: filters.createdDateTo,
    last_edit_date_from: filters.lastEditDateFrom,
    last_edit_date_to: filters.lastEditDateTo
  })
}

const handlePageUpdate = (page) => {
  currentPage.value = page
  fetchOrders({
    orderNumber: activeFilters.value.orderNumber,
    created_date_from: activeFilters.value.createdDateFrom,
    created_date_to: activeFilters.value.createdDateTo,
    last_edit_date_from: activeFilters.value.lastEditDateFrom,
    last_edit_date_to: activeFilters.value.lastEditDateTo
  })
}

const handlePerPageUpdate = (size) => {
  perPage.value = size
  currentPage.value = 1 // Reset to first page when changing page size
  fetchOrders({
    orderNumber: activeFilters.value.orderNumber,
    created_date_from: activeFilters.value.createdDateFrom,
    created_date_to: activeFilters.value.createdDateTo,
    last_edit_date_from: activeFilters.value.lastEditDateFrom,
    last_edit_date_to: activeFilters.value.lastEditDateTo
  })
}

const handleSelectionChange = (selected) => {
  selectedOrders.value = selected
}
</script>