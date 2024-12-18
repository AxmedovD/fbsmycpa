import { COURIER_API_URL } from './courierConfig'
import { buildCourierXml } from './courierXmlBuilder'
import { openBase64InNewTab } from '@/utils/base64Utils'

export async function getCourierLabel(orderIds) {
  try {
    const xmlDoc = buildCourierXml(orderIds)
    
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

    // Open PDF in new tab
    openBase64InNewTab(content, 'application/pdf')
    return true
  } catch (error) {
    console.error('Error fetching courier label:', error)
    throw error
  }
}