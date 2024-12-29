<template>
  <div>
    <router-view></router-view>
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDarkMode } from './composables/useDarkMode'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'

const { isDarkMode } = useDarkMode()

onMounted(() => {
  // Initialize dark mode on app mount
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>