import { ref } from 'vue'
import { updateOrdersStatus } from '@/services/orderService'
import { useNotification } from '@/composables/useNotification'

export function useStatusUpdate(props, emit) {
  const selectedStatus = ref('')
  const loading = ref(false)
  const { showNotification } = useNotification()

  const updateStatus = async () => {
    if (!selectedStatus.value || props.selectedOrders.length === 0) return

    try {
      loading.value = true
      await updateOrdersStatus(props.selectedOrders, selectedStatus.value)
      showNotification({
        type: 'success',
        title: 'Status Updated',
        message: `Successfully updated ${props.selectedOrders.length} orders to ${selectedStatus.value} status`
      })
      emit('status-updated')
      selectedStatus.value = ''
    } catch (error) {
      console.error('Failed to update status:', error)
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update order status. Please try again.'
      })
    } finally {
      loading.value = false
    }
  }

  return {
    selectedStatus,
    loading,
    updateStatus
  }
}