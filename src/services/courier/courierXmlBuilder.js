import { AUTH_CREDENTIALS } from './courierConfig'

export function buildCourierXml(orderIds) {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<waybill>
  <auth extra="${AUTH_CREDENTIALS.extra}" login="${AUTH_CREDENTIALS.login}" pass="${AUTH_CREDENTIALS.pass}"/>
  <orders>
    ${orderIds.map(id => `<order orderno="${id}" />`).join('\n    ')}
  </orders>
  <form>2</form>
</waybill>`
}