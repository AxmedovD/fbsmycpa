<template>
  <div class="mt-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <!-- Export Button -->
          <Button 
            variant="secondary"
            class="flex items-center"
            @click="handleExport"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-1.5" />
            Export {{ selectedCount ? 'Selected' : 'All' }}
          </Button>

          <div class="flex items-center space-x-4">
            <!-- Bulk Status Update -->
            <div v-if="selectedCount > 0" class="flex items-center space-x-2">
              <div class="relative">
                <select
                  v-model="selectedStatus"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select Status</option>
                  <option 
                    v-for="(status, key) in ORDER_STATUSES" 
                    :key="key" 
                    :value="key"
                    class="py-1"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon class="h-4 w-4" />
                </div>
              </div>
              <Button 
                variant="primary"
                class="flex items-center"
                :disabled="!selectedStatus"
                @click="updateStatus"
              >
                <ArrowPathIcon class="h-4 w-4 mr-1" />
                Update Status ({{ selectedCount }})
              </Button>
            </div>

            <!-- Pagination -->
            <div class="flex items-center space-x-2">
              <Button
                variant="secondary"
                :disabled="currentPage === 1"
                @click="updatePage(currentPage - 1)"
                class="text-sm"
              >
                <ChevronLeftIcon class="h-4 w-4" />
              </Button>

              <div class="flex items-center space-x-1">
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="updatePage(page)"
                  class="px-3 py-1 rounded-md text-sm"
                  :class="page === currentPage ? 
                    'bg-blue-600 text-white' : 
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
                >
                  {{ page }}
                </button>
              </div>

              <Button
                variant="secondary"
                :disabled="currentPage === totalPages"
                @click="updatePage(currentPage + 1)"
                class="text-sm"
              >
                <ChevronRightIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'
import { ORDER_STATUSES } from '@/utils/orderStatuses'
import { updateOrdersStatus } from '@/services/orderService'
import { exportToExcel } from '@/utils/exportUtils'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalOrders: {
    type: Number,
    required: true
  },
  selectedOrders: {
    type: Array,
    required: true
  },
  selectedCount: {
    type: Number,
    required: true
  },
  startIndex: {
    type: Number,
    required: true
  },
  endIndex: {
    type: Number,
    required: true
  },
  orders: {
    type: Array,
    required: true
  },
  perPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:page', 'status-updated', 'update:per-page'])

const selectedStatus = ref('')
const loading = ref(false)

// Pagination logic
const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxDisplayed / 2))
  let end = Math.min(props.totalPages, start + maxDisplayed - 1)

  if (end - start + 1 < maxDisplayed) {
    start = Math.max(1, end - maxDisplayed + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const updatePage = (page) => {
  emit('update:page', page)
}

const updateStatus = async () => {
  if (!selectedStatus.value || props.selectedOrders.length === 0) return

  try {
    loading.value = true
    await updateOrdersStatus(props.selectedOrders, selectedStatus.value)
    emit('status-updated')
    selectedStatus.value = ''
  } catch (error) {
    console.error('Failed to update status:', error)
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  exportToExcel(props.orders, props.selectedOrders)
}
</script>