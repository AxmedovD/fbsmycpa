<template>
  <header class="bg-white dark:bg-gray-800 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon v-if="!isSidebarOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
          <h1 class="ml-4 text-2xl font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Dark mode toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <SunIcon v-if="isDarkMode" class="h-6 w-6" />
            <MoonIcon v-else class="h-6 w-6" />
          </button>
          
          <!-- Profile dropdown -->
          <div class="relative">
            <button
              @click="isProfileOpen = !isProfileOpen"
              class="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <img
                class="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </button>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isProfileOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
              >
                <UserProfile 
                  :user="user"
                  @logout="handleLogout"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useDarkMode } from '@/composables/useDarkMode'
import { useUser } from '@/composables/useUser'
import UserProfile from '@/components/user/UserProfile.vue'

const props = defineProps({
  isSidebarOpen: Boolean
})

defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const isProfileOpen = ref(false)
const { isDarkMode, toggleDarkMode } = useDarkMode()
const { user } = useUser()

const pageTitle = computed(() => {
  return route.name || 'Dashboard'
})

const handleLogout = () => {
  localStorage.removeItem('authToken')
  router.push('/auth/login')
}
</script>