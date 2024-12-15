import { ref } from 'vue'
import { updateOrdersStatus } from '@/services/orderService'

export function useStatusUpdate(props, emit) {
  const selectedStatus = ref('')
  const loading = ref(false)

  const updateStatus = async () => {
    if (!selectedStatus.value || props.selectedOrders.length === 0) return

    try {
      loading.value = true
      await updateOrdersStatus(props.selectedOrders, selectedStatus.value)
      emit('status-updated')
      selectedStatus.value = ''
    } catch (error) {
      console.error('Failed to update status:', error)
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