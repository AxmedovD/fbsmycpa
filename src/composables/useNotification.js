import { ref } from 'vue'

const notifications = ref([])

export function useNotification() {
  const showNotification = (message, type = 'info') => {
    const id = Date.now()
    notifications.value.push({
      id,
      message,
      type
    })

    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 5000)
  }

  return {
    notifications,
    showNotification
  }
}