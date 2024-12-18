import { ref, computed } from 'vue'
import { getCourierLabel } from '@/services/courier/courierService'
import { useNotification } from './useNotification'

export function useCourierLabel(orders, selectedOrders) {
  const printingLabel = ref(false)
  const { showNotification } = useNotification()

  const hasSendStatusOrders = computed(() => {
    return orders.value
      .filter(order => selectedOrders.value.includes(order.orderId))
      .some(order => order.status.toLowerCase() === 'send')
  })

  const getSendStatusOrders = () => {
    return orders.value
      .filter(order => 
        selectedOrders.value.includes(order.orderId) && 
        order.status.toLowerCase() === 'send'
      )
      .map(order => order.orderId)
  }

  const handlePrintLabel = async () => {
    try {
      printingLabel.value = true
      const sendStatusOrders = getSendStatusOrders()

      if (sendStatusOrders.length === 0) {
        showNotification('No orders with "send" status selected', 'warning')
        return
      }

      await getCourierLabel(sendStatusOrders)
      showNotification('Labels opened in new tab', 'success')
    } catch (error) {
      showNotification('Failed to get courier labels: ' + error.message, 'error')
    } finally {
      printingLabel.value = false
    }
  }

  return {
    printingLabel,
    hasSendStatusOrders,
    handlePrintLabel
  }
}