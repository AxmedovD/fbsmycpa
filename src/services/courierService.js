import { saveAs } from 'file-saver'

const COURIER_API_URL = 'https://home.courierexe.ru/api'
const AUTH_CREDENTIALS = {
  login: 'MYMGOODS',
  pass: 'MGOODS123',
  extra: '245'
}

export async function getCourierLabel(orderIds) {
  try {
    // Create XML request
    const xmlDoc = `<?xml version="1.0" encoding="UTF-8" ?>
<waybill>
  <auth extra="${AUTH_CREDENTIALS.extra}" login="${AUTH_CREDENTIALS.login}" pass="${AUTH_CREDENTIALS.pass}"/>
  <orders>
    ${orderIds.map(id => `<order orderno="${id}" />`).join('\n    ')}
  </orders>
  <form>2</form>
</waybill>`

    const response = await fetch(COURIER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlDoc
    })

    if (!response.ok) {
      throw new Error('Failed to fetch courier label')
    }

    const data = await response.text()
    const parser = new DOMParser()
    const xmlResponse = parser.parseFromString(data, 'text/xml')
    const content = xmlResponse.querySelector('content')?.textContent

    if (!content) {
      throw new Error('No label content received')
    }

    // Convert base64 to PDF and trigger download
    const pdfBlob = base64ToBlob(content, 'application/pdf')
    saveAs(pdfBlob, `courier-labels-${new Date().toISOString().split('T')[0]}.pdf`)

    return true
  } catch (error) {
    console.error('Error fetching courier label:', error)
    throw error
  }
}

function base64ToBlob(base64, type = 'application/pdf') {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Blob([bytes], { type })
}