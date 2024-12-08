<template>
  <div class="mt-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <!-- Export Button -->
          <Button 
            variant="secondary"
            class="flex items-center"
            @click="exportToExcel"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-1.5" />
            Export {{ selectedCount ? 'Selected' : 'All' }}
          </Button>

          <div class="flex items-center space-x-4">
            <!-- Bulk Edit -->
            <Button 
              v-if="selectedCount > 0"
              variant="secondary"
              class="flex items-center"
            >
              <PencilSquareIcon class="h-4 w-4 mr-1" />
              Bulk Edit ({{ selectedCount }})
            </Button>

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

<script setup lang="ts">
import { computed } from 'vue'
import { 
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalOrders: number
  selectedCount: number
  startIndex: number
  endIndex: number
  orders: Array<{
    id: string
    status: string
  }>
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

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

const updatePage = (page: number) => {
  emit('update:page', page)
}

const exportToExcel = () => {
  // Export logic will be implemented here
  console.log('Exporting to Excel...')
}
</script>