<template>
  <div 
    class="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out"
    :class="selectedCount > 0 ? 'translate-y-0' : 'translate-y-full'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:pl-64"> <!-- Match sidebar width -->
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <!-- Export Button -->
              <Button 
                variant="secondary"
                class="flex items-center"
                @click="handleExport"
              >
                <ArrowDownTrayIcon class="h-4 w-4 mr-1.5" />
                Export Selected ({{ selectedCount }})
              </Button>

              <!-- Print Label Button - Only show for 'send' status orders -->
              <Button
                v-if="hasSendStatusOrders"
                variant="secondary"
                class="flex items-center"
                @click="handlePrintLabel"
                :disabled="printingLabel"
              >
                <PrinterIcon class="h-4 w-4 mr-1.5" />
                {{ printingLabel ? 'Opening...' : 'Print Label' }}
              </Button>
            </div>

            <!-- Bulk Status Update -->
            <div class="flex items-center space-x-2">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'
import { ORDER_STATUSES } from '@/utils/orderStatuses'
import { useStatusUpdate } from '@/composables/useStatusUpdate'
import { exportToExcel } from '@/utils/exportUtils'
import { useCourierLabel } from '@/composables/useCourierLabel'

const props = defineProps({
  selectedCount: {
    type: Number,
    required: true
  },
  selectedOrders: {
    type: Array,
    required: true
  },
  orders: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['status-updated'])

const { selectedStatus, loading, updateStatus } = useStatusUpdate(props, emit)
const { printingLabel, hasSendStatusOrders, handlePrintLabel } = useCourierLabel(
  computed(() => props.orders),
  computed(() => props.selectedOrders)
)

const handleExport = () => {
  exportToExcel(props.orders, props.selectedOrders)
}
</script>