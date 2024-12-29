<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg w-64 flex-shrink-0 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-200">
        Order Status
        <span v-if="hasActiveFilters" class="text-xs text-gray-500 dark:text-gray-400 ml-1">
          (Filtered)
        </span>
      </h3>
      <button 
        class="lg:hidden text-gray-400 hover:text-gray-500 focus:outline-none"
        @click="$emit('close')"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
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
        <span class="text-sm font-medium">{{ hasActiveFilters ? filteredTotal : totalOrders }}</span>
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
import { InboxStackIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ORDER_STATUSES } from '@/utils/orderStatuses'

const props = defineProps({
  statusCounts: {
    type: Object,
    required: true
  },
  totalOrders: {
    type: Number,
    required: true
  },
  filteredTotal: {
    type: Number,
    required: true
  },
  hasActiveFilters: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:status', 'close'])

const selectedStatus = ref('all')

const getStatusCount = (status) => {
  return props.statusCounts[status] || 0
}

const selectStatus = (status) => {
  selectedStatus.value = status
  emit('update:status', status)
}
</script>