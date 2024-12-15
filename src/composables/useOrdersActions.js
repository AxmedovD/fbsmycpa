import { ref, computed } from 'vue'
import { updateOrdersStatus } from '@/services/orderService'
import { exportToExcel } from '@/utils/exportUtils'
import { usePagination } from '@/composables/usePagination'
import { useStatusUpdate } from '@/composables/useStatusUpdate'

export function useOrdersActions(props, emit) {
  const { displayedPages, updatePage } = usePagination(props, emit)
  const { selectedStatus, loading, updateStatus } = useStatusUpdate(props, emit)

  const handleExport = () => {
    exportToExcel(props.orders, props.selectedOrders)
  }

  return {
    selectedStatus,
    loading,
    displayedPages,
    updatePage,
    updateStatus,
    handleExport
  }
}