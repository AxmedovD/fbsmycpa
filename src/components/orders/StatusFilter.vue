<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg w-64 flex-shrink-0">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-200">Order Status</h3>
    </div>
    
    <div class="p-4">
      <button 
        class="w-full text-left py-2 px-3 rounded-md mb-3 flex items-center justify-between"
        :class="selectedStatus === 'all' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
        @click="selectStatus('all')"
      >
        <div class="flex items-center">
          <InboxStackIcon class="h-5 w-5 mr-2" />
          <span>All Orders</span>
        </div>
        <span class="text-sm font-medium">{{ totalOrders }}</span>
      </button>
      
      <div class="space-y-2">
        <button 
          v-for="status in Object.keys(ORDER_STATUSES)" 
          :key="status"
          class="w-full text-left py-2 px-3 rounded-md text-sm flex items-center justify-between transition-colors duration-150"
          :class="[
            selectedStatus === status ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
          @click="selectStatus(status)"
        >
          <div class="flex items-center">
            <component 
              :is="ORDER_STATUSES[status].icon" 
              class="h-5 w-5 mr-2" 
              :class="ORDER_STATUSES[status].iconColor" 
            />
            <span>{{ ORDER_STATUSES[status].label }}</span>
          </div>
          <span 
            class="font-medium" 
            :class="ORDER_STATUSES[status].textColor"
          >
            {{ getStatusCount(status) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { InboxStackIcon } from '@heroicons/vue/24/outline'
import { ORDER_STATUSES } from '@/utils/orderStatuses'

const props = defineProps({
  statusCounts: {
    type: Object,
    required: true,
    default: () => ({
      filtered: {},
      total: {}
    })
  },
  totalOrders: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:status'])

const selectedStatus = ref('all')

const getStatusCount = (status) => {
  // Use filtered counts when a filter is applied, otherwise use total counts
  const counts = Object.keys(props.statusCounts.filtered).length > 0 
    ? props.statusCounts.filtered 
    : props.statusCounts.total
  return counts[status] || 0
}

const selectStatus = (status) => {
  selectedStatus.value = status
  emit('update:status', status)
}
</script>