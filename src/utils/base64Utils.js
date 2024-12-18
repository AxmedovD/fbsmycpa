export function base64ToBlob(base64, type = 'application/pdf') {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Blob([bytes], { type })
}

export function openBase64InNewTab(base64, type = 'application/pdf') {
  const blob = base64ToBlob(base64, type)
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, '_blank')
  
  // Clean up the blob URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl)
  }, 100)
}