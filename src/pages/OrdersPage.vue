<template>
  <div class="max-w-full">
    <OrderFilters
      @reset="handleFilterReset"
      @apply="handleFilterApply"
    />

    <div class="mt-6 flex gap-6 relative">
      <!-- Status Filter Toggle Button (Mobile) -->
      <button
        class="lg:hidden fixed left-4 bottom-4 z-40 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 border border-gray-200 dark:border-gray-700"
        @click="isStatusFilterOpen = !isStatusFilterOpen"
      >
        <FunnelIcon 
          class="h-5 w-5 text-gray-600 dark:text-gray-400"
          :class="{ 'text-blue-600 dark:text-blue-400': isStatusFilterOpen }"
        />
      </button>

      <!-- Status Filter Sidebar -->
      <div 
        class="fixed lg:relative left-0 top-0 bottom-0 z-30 lg:z-0 transform transition-transform duration-300 ease-in-out"
        :class="isStatusFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <StatusFilter
          v-model:status="selectedStatus"
          :status-counts="statusCounts"
          :total-orders="totalOrders"
          :filtered-total="filteredTotal"
          :has-active-filters="hasActiveFilters"
          @update:status="handleStatusChange"
          @close="isStatusFilterOpen = false"
        />
      </div>

      <!-- Backdrop -->
      <div
        v-if="isStatusFilterOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden transition-opacity duration-300 ease-in-out"
        @click="isStatusFilterOpen = false"
      ></div>

      <div class="flex-1 min-w-0 flex flex-col">
        <OrdersTable 
          :orders="filteredOrders"
          :total-orders="totalOrders"
          :filtered-total="filteredTotal"
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
import { ref, onMounted } from 'vue'
import { FunnelIcon } from '@heroicons/vue/24/outline'
import OrderFilters from '@/components/orders/OrderFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import StatusFilter from '@/components/orders/StatusFilter.vue'
import FixedActions from '@/components/orders/FixedActions.vue'
import OrdersPagination from '@/components/orders/OrdersPagination.vue'
import { useOrders } from '@/composables/useOrders'

const isStatusFilterOpen = ref(window.innerWidth >= 1024) // Open by default on desktop

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
  filteredTotal,
  fetchOrders,
  handleFilterReset,
  handleFilterApply,
  handlePageUpdate,
  handlePerPageUpdate,
  handleSelectionChange,
  handleStatusChange,
  hasActiveFilters
} = useOrders()

onMounted(() => {
  fetchOrders()
})
</script>