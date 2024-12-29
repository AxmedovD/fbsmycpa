import { ref } from 'vue'

const notification = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

export function useNotification() {
  const showNotification = ({ type = 'success', title, message }) => {
    notification.value = {
      show: true,
      type,
      title,
      message
    }

    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }

  const hideNotification = () => {
    notification.value.show = false
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}