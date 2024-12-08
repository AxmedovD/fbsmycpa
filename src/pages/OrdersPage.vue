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
        <OrdersTable :orders="filteredOrders" />
      </div>
    </div>

    <OrdersActions
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-orders="filteredOrders.length"
      :selected-count="selectedCount"
      :start-index="startIndex"
      :end-index="endIndex"
      :orders="filteredOrders"
      @update:page="handlePageUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import StatusFilter from '@/components/orders/StatusFilter.vue'
import OrdersActions from '@/components/orders/OrdersActions.vue'

const selectedStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedCount = ref(0)

// Sample orders data with prices
const orders = [
  { 
    id: '139440',
    date: '2024-01-23',
    shop: 'Mgoods',
    orderType: 'Cart',
    customer: 'John Doe',
    phone: '+1234567890',
    manager: 'Sarah',
    items: 'Product A x2',
    status: 'New',
    price: 250000
  },
  { 
    id: '139441',
    date: '2024-01-23',
    shop: 'MyShop',
    orderType: 'Direct',
    customer: 'Jane Smith',
    phone: '+0987654321',
    manager: 'Mike',
    items: 'Product B x1',
    status: 'Delivering',
    price: 180000
  },
  { 
    id: '139442',
    date: '2024-01-22',
    shop: 'XM-Shop',
    orderType: 'Cart',
    customer: 'Alice Johnson',
    phone: '+1122334455',
    manager: 'Tom',
    items: 'Product C x3',
    status: 'Delivered',
    price: 450000
  },
  { 
    id: '139443',
    date: '2024-01-22',
    shop: 'Mgoods',
    orderType: 'Direct',
    customer: 'Bob Wilson',
    phone: '+5544332211',
    manager: 'Sarah',
    items: 'Product D x1',
    status: 'Accept',
    price: 120000
  },
  { 
    id: '139444',
    date: '2024-01-21',
    shop: 'MyShop',
    orderType: 'Cart',
    customer: 'Charlie Brown',
    phone: '+6677889900',
    manager: 'Mike',
    items: 'Product E x2',
    status: 'Send',
    price: 320000
  },
  { 
    id: '139445',
    date: '2024-01-21',
    shop: 'XM-Shop',
    orderType: 'Direct',
    customer: 'David Miller',
    phone: '+9988776655',
    manager: 'Tom',
    items: 'Product F x1',
    status: 'Cancel',
    price: 150000
  },
  { 
    id: '139446',
    date: '2024-01-20',
    shop: 'Mgoods',
    orderType: 'Cart',
    customer: 'Eve Anderson',
    phone: '+1234567890',
    manager: 'Sarah',
    items: 'Product G x4',
    status: 'Back',
    price: 580000
  },
  { 
    id: '139447',
    date: '2024-01-20',
    shop: 'MyShop',
    orderType: 'Direct',
    customer: 'Frank Thomas',
    phone: '+0987654321',
    manager: 'Mike',
    items: 'Product H x2',
    status: 'Sold',
    price: 290000
  }
]

const activeFilters = ref({
  orderNumber: '',
  client: '',
  phone: '',
  createdDateFrom: '',
  createdDateTo: '',
  lastEditDateFrom: '',
  lastEditDateTo: ''
})

const filteredOrders = computed(() => {
  return orders.filter(order => {
    if (selectedStatus.value !== 'all' && order.status !== selectedStatus.value) {
      return false
    }
    if (activeFilters.value.orderNumber && !order.id.includes(activeFilters.value.orderNumber)) {
      return false
    }
    if (activeFilters.value.client && order.shop !== activeFilters.value.client) {
      return false
    }
    if (activeFilters.value.phone && !order.phone.includes(activeFilters.value.phone)) {
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
    client: '',
    phone: '',
    createdDateFrom: '',
    createdDateTo: '',
    lastEditDateFrom: '',
    lastEditDateTo: ''
  }
  selectedStatus.value = 'all'
}

const handleFilterApply = (filters: typeof activeFilters.value) => {
  activeFilters.value = filters
}

const handlePageUpdate = (page: number) => {
  currentPage.value = page
}
</script>