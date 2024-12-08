<template>
  <div class="flex-1 bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Orders</h3>
        <Button variant="primary" class="flex items-center">
          <PlusIcon class="h-4 w-4 mr-1" />
          New Order
        </Button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  :checked="selectedOrders.includes(order.id)"
                  @change="toggleOrder(order.id)"
                />
                <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">#{{ order.id }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ order.customer }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ order.phone }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ order.items }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ formatPrice(order.price) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                <PencilSquareIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <td colspan="6" class="px-6 py-4">
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
                    Total Orders: {{ paginatedOrders.length }}
                  </span>
                  <span class="font-medium text-gray-700 dark:text-gray-300">
                    Total: {{ formatPrice(totalPrice) }}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PencilSquareIcon, PlusIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  orders: Array<{
    id: string
    customer: string
    status: string
    items: string
    phone: string
    price: number
  }>
}>()

const selectedOrders = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(props.orders.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const paginatedOrders = computed(() => {
  return props.orders.slice(startIndex.value, endIndex.value)
})

const totalPrice = computed(() => {
  return paginatedOrders.value.reduce((sum, order) => sum + order.price, 0)
})

const selectedOrdersTotal = computed(() => {
  return paginatedOrders.value
    .filter(order => selectedOrders.value.includes(order.id))
    .reduce((sum, order) => sum + order.price, 0)
})

const isAllSelected = computed(() => {
  return paginatedOrders.value.length > 0 && 
    paginatedOrders.value.every(order => selectedOrders.value.includes(order.id))
})

const toggleAllOrders = (event: Event) => {
  const checkbox = event.target as HTMLInputElement
  if (checkbox.checked) {
    selectedOrders.value = [...new Set([...selectedOrders.value, ...paginatedOrders.value.map(order => order.id)])]
  } else {
    selectedOrders.value = selectedOrders.value.filter(id => 
      !paginatedOrders.value.find(order => order.id === id)
    )
  }
}

const toggleOrder = (orderId: string) => {
  const index = selectedOrders.value.indexOf(orderId)
  if (index === -1) {
    selectedOrders.value.push(orderId)
  } else {
    selectedOrders.value.splice(index, 1)
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS'
  }).format(price)
}

const getStatusClass = (status: string) => {
  const classes = {
    'New': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Accept': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Send': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Delivering': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Cancel': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Back': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Sold': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
</script>