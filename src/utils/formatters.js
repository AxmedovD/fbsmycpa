export const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS'
  }).format(price)
}

export const getStatusClass = (status) => {
  const classes = {
    'New': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Accept': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Send': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Delivering': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Cancel': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Back': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Sold': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}