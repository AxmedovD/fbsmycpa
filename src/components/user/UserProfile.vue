<template>
  <div class="p-4 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 dark:text-red-400 text-sm py-2">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <div class="flex items-center space-x-3 mb-4">
        <img
          class="h-10 w-10 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.store }}</p>
        </div>
      </div>
      
      <div class="space-y-3">
        <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <EnvelopeIcon class="h-4 w-4" />
          <span>{{ user.email }}</span>
        </div>
        
        <div class="pt-3 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="logout"
            class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          >
            Sign out
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { EnvelopeIcon } from '@heroicons/vue/24/outline'
import { useUser } from '@/composables/useUser'

const { user, loading, error } = useUser()

const emit = defineEmits(['logout'])

const logout = () => {
  emit('logout')
}
</script>