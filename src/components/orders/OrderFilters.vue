<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Order Number -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Order Number
        </label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HashtagIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            v-model="filters.orderNumber"
            placeholder="e.g. 102A 103B 104C"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
          >
        </div>
      </div>

      <!-- Article -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search by Article
        </label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TagIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            v-model="filters.article"
            placeholder="Enter article number"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
          >
        </div>
      </div>

      <!-- Created Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Created Date
        </label>
        <div class="grid grid-cols-2 gap-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              v-model="filters.createdDateFrom"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              v-model="filters.createdDateTo"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
            >
          </div>
        </div>
      </div>

      <!-- Last Edit Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Edit Date
        </label>
        <div class="grid grid-cols-2 gap-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              v-model="filters.lastEditDateFrom"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              v-model="filters.lastEditDateTo"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex justify-end space-x-3">
      <button
        type="button"
        @click="handleReset"
        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowPathIcon class="h-4 w-4 mr-1.5" />
        Reset
      </button>
      <button
        type="button"
        @click="handleApply"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FunnelIcon class="h-4 w-4 mr-1.5" />
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  HashtagIcon,
  TagIcon,
  CalendarIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['reset', 'apply'])

const filters = ref({
  orderNumber: '',
  article: '',
  createdDateFrom: '',
  createdDateTo: '',
  lastEditDateFrom: '',
  lastEditDateTo: ''
})

const handleReset = () => {
  filters.value = {
    orderNumber: '',
    article: '',
    createdDateFrom: '',
    createdDateTo: '',
    lastEditDateFrom: '',
    lastEditDateTo: ''
  }
  emit('reset')
}

const handleApply = () => {
  emit('apply', { ...filters.value })
}
</script>

<style scoped>
/* Fix date input appearance on mobile */
input[type="date"] {
  min-height: 38px; /* Ensure consistent height */
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
}

/* Hide default calendar icon on Webkit browsers */
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* Dark mode styles for date inputs */
.dark input[type="date"] {
  color-scheme: dark;
}
</style>