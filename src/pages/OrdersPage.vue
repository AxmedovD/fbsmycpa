<template>
  <div class="max-w-full">
    <OrderFilters
      @reset="handleFilterReset"
      @apply="handleFilterApply"
    />

    <div class="mt-6 flex gap-6">
      <StatusFilter
        v-model:status="selectedStatus"
        :status-counts="statusCounts"
        :total-orders="totalOrders"
      />
      <div class="flex-1 min-w-0 flex flex-col">
        <OrdersTable 
          :orders="filteredOrders"
          @selection-change="handleSelectionChange"
        />
        
        <OrdersPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :per-page="perPage"
          @update:page="handlePageUpdate"
          @update:per-page="handlePerPageUpdate"
        />
      </div>
    </div>

    <!-- Fixed Actions Component -->
    <FixedActions
      v-if="selectedOrders.length > 0"
      :selected-count="selectedOrders.length"
      :selected-orders="selectedOrders"
      :orders="filteredOrders"
      @status-updated="fetchOrders"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import StatusFilter from '@/components/orders/StatusFilter.vue'
import FixedActions from '@/components/orders/FixedActions.vue'
import OrdersPagination from '@/components/orders/OrdersPagination.vue'
import { useOrders } from '@/composables/useOrders'

const {
  orders,
  selectedOrders,
  selectedStatus,
  currentPage,
  perPage,
  totalPages,
  totalOrders,
  statusCounts,
  filteredOrders,
  fetchOrders,
  handleFilterReset,
  handleFilterApply,
  handlePageUpdate,
  handlePerPageUpdate,
  handleSelectionChange
} = useOrders()

onMounted(() => {
  fetchOrders()
})
</script>