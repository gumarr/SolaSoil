import { PayOS } from '@payos/node';

let payosInstance: PayOS | null = null;

function getPayOS() {
  if (!payosInstance) {
    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

    // Fallback/dummy values during build time so module evaluation doesn't crash
    payosInstance = new PayOS({
      clientId: clientId || 'dummy-client-id',
      apiKey: apiKey || 'dummy-api-key',
      checksumKey: checksumKey || 'dummy-checksum-key'
    });
  }
  return payosInstance;
}

const payosProxy = new Proxy({} as PayOS, {
  get(target, prop, receiver) {
    const instance = getPayOS();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export default payosProxy;
