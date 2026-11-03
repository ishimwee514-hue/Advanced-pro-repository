// Supply a durable queue adapter in production; process memory is not durable.
export function createJobQueue(adapter) {
  if (typeof adapter?.enqueue !== 'function' || typeof adapter?.close !== 'function') throw new TypeError('Job queue adapter must implement enqueue() and close()')
  return Object.freeze({ enqueue: (name, payload, options) => adapter.enqueue(name, payload, options), close: () => adapter.close() })
}
