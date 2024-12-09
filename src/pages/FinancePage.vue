<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Sold Sum</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ formatPrice(summary.soldSum) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TruckIcon class="h-6 w-6 text-blue-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Shipping Fee</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ formatPrice(summary.shippingFee) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ShoppingBagIcon class="h-6 w-6 text-purple-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Product Sum</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ formatPrice(summary.productSum) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BanknotesIcon class="h-6 w-6 text-emerald-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Mgoods</dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ formatPrice(summary.mgoodsTotal) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shipping</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mgoods</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </td>
            </tr>
            <tr v-else-if="error" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-red-500">
                {{ error }}
              </td>
            </tr>
            <tr v-else-if="orders.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No sold orders found
              </td>
            </tr>
            <tr v-for="order in orders" :key="order.orderId" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ order.orderId }}
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div v-for="item in order.items" :key="item.id" class="text-sm text-gray-500 dark:text-gray-300">
                    {{ item.product }} ({{ formatPrice(item.sellPrice) }} × {{ item.quantity }})
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatPrice(order.totalSumm) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatPrice(order.netCostShip) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatPrice(order.purchaseSumm) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatPrice(calculateMgoods(order)) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <td colspan="2" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Total
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPrice(summary.soldSum) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPrice(summary.shippingFee) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPrice(summary.productSum) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPrice(summary.mgoodsTotal) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { CurrencyDollarIcon, TruckIcon, ShoppingBagIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
import { formatPrice } from '@/utils/formatters'
import { useUser } from '@/composables/useUser'
import { getFinanceData } from '@/services/financeService'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

const { userStore } = useUser()

const calculateMgoods = (order) => {
  return Number(order.totalSumm) - Number(order.netCostShip) - Number(order.purchaseSumm)
}

const summary = computed(() => {
  const result = orders.value.reduce((acc, order) => {
    acc.soldSum += Number(order.totalSumm) || 0
    acc.shippingFee += Number(order.netCostShip) || 0
    acc.productSum += Number(order.purchaseSumm) || 0
    acc.mgoodsTotal += calculateMgoods(order)
    return acc
  }, {
    soldSum: 0,
    shippingFee: 0,
    productSum: 0,
    mgoodsTotal: 0
  })
  
  return result
})

const fetchFinanceData = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await getFinanceData(userStore.value)
    orders.value = data.data || []
  } catch (err) {
    error.value = err.message
    console.error('Error fetching finance data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFinanceData()
})
</script>