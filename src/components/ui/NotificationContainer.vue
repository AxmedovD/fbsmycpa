<template>
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <Toast
        :show="notification.show"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        @close="hideNotification"
      />
    </div>
  </div>
</template>

<script setup>
import Toast from './Toast.vue'
import { useNotification } from '@/composables/useNotification'

const { notification, hideNotification } = useNotification()
</script>
