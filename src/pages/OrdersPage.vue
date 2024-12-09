<template>
  <div>
    <OrderFilters
      @reset="handleFilterReset"
      @apply="handleFilterApply"
    />

    <div class="mt-6 flex gap-6">
      <StatusFilter
        v-model:status="selectedStatus"
        :orders="orders"
      />
      <div class="flex-1">
        <OrdersTable 
          :orders="filteredOrders" 
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>

    <OrdersActions
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-orders="filteredOrders.length"
      :selected-count="selectedOrders.length"
      :selected-orders="selectedOrders"
      :start-index="startIndex"
      :end-index="endIndex"
      :orders="filteredOrders"
      @update:page="handlePageUpdate"
      @status-updated="fetchOrders"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import StatusFilter from '@/components/orders/StatusFilter.vue'
import OrdersActions from '@/components/orders/OrdersActions.vue'
import { getOrders } from '@/services/orderService'

const selectedStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedOrders = ref([])
const orders = ref([])
const loading = ref(false)
const error = ref(null)

const activeFilters = ref({
  orderNumber: '',
  createdDateFrom: '',
  createdDateTo: '',
  lastEditDateFrom: '',
  lastEditDateTo: ''
})

const fetchOrders = async (filters = {}) => {
  try {
    loading.value = true
    error.value = null
    
    const apiFilters = {}
    if (filters.orderNumber) {
      apiFilters.orderIds = filters.orderNumber
    }
    
    const response = await getOrders(apiFilters)
    orders.value = response.data
    selectedOrders.value = [] // Reset selection after fetching new orders
  } catch (err) {
    error.value = err.message
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

watch(() => activeFilters.value.orderNumber, (newValue) => {
  if (newValue) {
    fetchOrders({ orderNumber: newValue })
  } else {
    fetchOrders()
  }
})

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (selectedStatus.value !== 'all' && order.status.toLowerCase() !== selectedStatus.value) {
      return false
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const handleFilterReset = () => {
  activeFilters.value = {
    orderNumber: '',
    createdDateFrom: '',
    createdDateTo: '',
    lastEditDateFrom: '',
    lastEditDateTo: ''
  }
  selectedStatus.value = 'all'
  fetchOrders()
}

const handleFilterApply = (filters) => {
  activeFilters.value = filters
  fetchOrders({ orderNumber: filters.orderNumber })
}

const handlePageUpdate = (page) => {
  currentPage.value = page
}

const handleSelectionChange = (selected) => {
  selectedOrders.value = selected
}
</script>