import ExcelJS from 'exceljs'

export const exportToExcel = async (orders, selectedOrders = []) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Orders')

  // Define columns
  worksheet.columns = [
    { header: 'Order ID', key: 'orderId', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Customer Name', key: 'customerName', width: 20 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Region', key: 'region', width: 15 },
    { header: 'City', key: 'city', width: 15 },
    { header: 'Address', key: 'address', width: 30 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Total Amount', key: 'totalAmount', width: 15 },
    { header: 'Product', key: 'product', width: 30 },
    { header: 'SKU', key: 'sku', width: 15 },
    { header: 'IKPU', key: 'ikpu', width: 15 },
    { header: 'Price', key: 'price', width: 12 },
    { header: 'Quantity', key: 'quantity', width: 10 }
  ]

  // Style the header row
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }

  // Filter orders if there are selected ones
  const ordersToExport = selectedOrders.length > 0
    ? orders.filter(order => selectedOrders.includes(order.orderId))
    : orders

  // Add data rows
  const rows = ordersToExport.flatMap(order => {
    return order.items.map(item => ({
      orderId: order.orderId,
      createdAt: new Date(order.createdAt).toLocaleString(),
      customerName: order.name,
      phone: order.phone,
      region: order.region,
      city: order.city,
      address: order.adress,
      status: order.status,
      totalAmount: Number(order.totalSumm),
      product: item.product,
      sku: item.sku,
      ikpu: item.ikpu,
      price: Number(item.sellPrice),
      quantity: Number(item.quantity)
    }))
  })

  // Add rows to worksheet
  worksheet.addRows(rows)

  // Format number columns
  worksheet.getColumn('totalAmount').numFmt = '#,##0.00'
  worksheet.getColumn('price').numFmt = '#,##0.00'

  // Auto-filter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columns.length }
  }

  // Generate file name with current date
  const date = new Date().toISOString().split('T')[0]
  const fileName = `orders_${date}.xlsx`

  // Write to buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}