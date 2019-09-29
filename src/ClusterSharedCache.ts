import { TestableKeyValueCache } from 'apollo-server-caching'
import LRUCache, { Options } from 'lru-cache'
import SharedLRUCache from './shared-cache'

const defaultLengthCalculation = (item: any) => {
  if (Array.isArray(item) || typeof item === 'string') {
    return item.length
  }

  return 1
}
export const defaultCacheSetting = {
  max: Infinity,
  length: defaultLengthCalculation
}

class ClusterSharedCache<V = string> implements TestableKeyValueCache<V> {
  private store: LRUCache<string, V> | SharedLRUCache<V>

  constructor(props: {
    cacheSetting?: Options<string, V>
    enableClusterShared: boolean
  }) {
    if (props.enableClusterShared) {
      this.store = new SharedLRUCache({...defaultCacheSetting, ...props.cacheSetting})
    } else {
      this.store = new LRUCache<string, V>({...defaultCacheSetting, ...props.cacheSetting})
    }
  }

  public async get(key: string) {
    return this.store.get(key)
  }

  public async set(key: string, value: V, options?: { ttl?: number }): Promise<void> {
    const maxAge = options && options.ttl && options.ttl * 1000
    this.store.set(key, value, maxAge)
  }

  public async delete(key: string):Promise<void> {
    this.store.del(key)
  }

  public async flush(): Promise<void> {
    this.store.reset()
  }

}
export default ClusterSharedCache
