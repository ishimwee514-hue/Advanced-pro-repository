// Require a private object-storage adapter before accepting uploaded files.
export function createStorageProvider(adapter) {
  for (const method of ['put', 'getSignedUrl', 'delete']) if (typeof adapter?.[method] !== 'function') throw new TypeError(`Storage adapter must implement ${method}()`)
  return Object.freeze({ put: (...args) => adapter.put(...args), getSignedUrl: (...args) => adapter.getSignedUrl(...args), delete: (...args) => adapter.delete(...args) })
}
