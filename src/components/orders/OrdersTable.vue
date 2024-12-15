<template>
  <div class="flex-1 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col">
    <div class="overflow-x-auto flex-1">
      <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  :checked="isAllSelected"
                  @change="toggleAllOrders"
                />
                <span class="ml-2">Order ID</span>
              </div>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Created At</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Customer</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Address</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Items</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Total</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  :checked="selectedOrders.includes(order.orderId)"
                  @change="toggleOrder(order.orderId)"
                />
                <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">{{ order.orderId }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ order.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ order.phone }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white whitespace-nowrap">{{ order.region }}, {{ order.city }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 break-words max-w-[300px]">{{ order.adress }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusConfig(order.status).bgColor"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col space-y-1">
                <div v-for="item in order.items" :key="item.id" class="text-sm text-gray-500 dark:text-gray-300">
                  {{ item.product }} ({{ item.sku }}) x{{ item.quantity }} - {{ formatPrice(item.sellPrice) }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatPrice(order.totalSumm) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Fixed Footer -->
    <div class="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
      <div class="px-6 py-4">
        <div class="flex justify-between items-center text-sm">
          <div class="flex items-center space-x-4">
            <div v-if="selectedOrders.length > 0" class="flex items-center space-x-4">
              <span class="font-medium text-gray-700 dark:text-gray-300">
                Selected: {{ selectedOrders.length }}
              </span>
              <span class="font-medium text-gray-700 dark:text-gray-300">
                Selected Total: {{ formatPrice(selectedOrdersTotal) }}
              </span>
            </div>
            <div class="w-px h-4 bg-gray-300 dark:bg-gray-600" v-if="selectedOrders.length > 0"></div>
            <span class="font-medium text-gray-700 dark:text-gray-300">
              Total Orders: {{ orders.length }}
            </span>
            <span class="font-medium text-gray-700 dark:text-gray-300">
              Total: {{ formatPrice(totalPrice) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '@/utils/formatters'
import { getStatusConfig } from '@/utils/orderStatuses'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['selection-change'])

const selectedOrders = ref([])

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
</script>