<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
    <div class="p-6 space-y-6">
      <!-- Basic Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <Input
            id="orderNumber"
            label="Order Number (separate multiple IDs with spaces)"
            v-model="filters.orderNumber"
            placeholder="e.g. 102A 103B 104C"
          >
            <template #prefix>
              <HashtagIcon class="h-5 w-5 text-gray-400" />
            </template>
          </Input>
        </div>
      </div>

      <!-- Date Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
          <div class="flex space-x-4">
            <div class="flex-1">
              <Input
                type="date"
                v-model="filters.createdDateFrom"
                placeholder="From"
              >
                <template #prefix>
                  <CalendarIcon class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>
            <div class="flex-1">
              <Input
                type="date"
                v-model="filters.createdDateTo"
                placeholder="To"
              >
                <template #prefix>
                  <CalendarIcon class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Edit Date</label>
          <div class="flex space-x-4">
            <div class="flex-1">
              <Input
                type="date"
                v-model="filters.lastEditDateFrom"
                placeholder="From"
              >
                <template #prefix>
                  <CalendarIcon class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>
            <div class="flex-1">
              <Input
                type="date"
                v-model="filters.lastEditDateTo"
                placeholder="To"
              >
                <template #prefix>
                  <CalendarIcon class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex justify-end space-x-3">
        <Button 
          variant="secondary" 
          @click="resetFilters"
          class="flex items-center"
        >
          <ArrowPathIcon class="h-4 w-4 mr-1" />
          Reset
        </Button>
        <Button 
          variant="primary" 
          @click="applyFilters"
          class="flex items-center"
        >
          <FunnelIcon class="h-4 w-4 mr-1" />
          Apply Filters
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { 
  ArrowPathIcon,
  FunnelIcon,
  HashtagIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['reset', 'apply'])

const filters = ref({
  orderNumber: '',
  createdDateFrom: '',
  createdDateTo: '',
  lastEditDateFrom: '',
  lastEditDateTo: ''
})

const resetFilters = () => {
  filters.value = {
    orderNumber: '',
    createdDateFrom: '',
    createdDateTo: '',
    lastEditDateFrom: '',
    lastEditDateTo: ''
  }
  emit('reset')
}

const applyFilters = () => {
  emit('apply', filters.value)
}
</script>