<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
    <div class="px-6 py-4">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <!-- Per Page Selection -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-600 dark:text-gray-400">Show:</span>
          <div class="flex items-center space-x-2">
            <button
              v-for="size in pageSizes"
              :key="size"
              @click="updatePerPage(size)"
              class="px-2 py-1 rounded transition-colors text-sm"
              :class="perPage === size ? 
                'bg-blue-600 text-white' : 
                'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'"
            >
              {{ size }}
              <span class="text-xs ml-1 opacity-60">({{ getShortcut(size) }})</span>
            </button>
          </div>
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
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:page', 'update:per-page'])

const pageSizes = [20, 50, 100]

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

const updatePerPage = (size) => {
  emit('update:per-page', size)
}

const getShortcut = (size) => {
  switch (size) {
    case 20: return '⌘1'
    case 50: return '⌘2'
    case 100: return '⌘3'
    default: return ''
  }
}
</script>