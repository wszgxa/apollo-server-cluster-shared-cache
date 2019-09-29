import LRUCache from 'lru-cache'
import { Worker } from 'cluster'
import { MessageFromWorker } from './types'
import { LRU_CACHE_MESSAGE_SOURCE } from '../consts'

export const handleCacheSet = <V>(message: MessageFromWorker<V>, cache: LRUCache<string, V>, worker: Worker): void => {
  if(!message.key) throw new Error('Set cache should provide the key')
  if(!message.value) throw new Error('Set cache should provide the value')
  const success = cache.set(message.key, message.value, message.maxAge)
  worker.send({
    id: message.id,
    success,
    source: LRU_CACHE_MESSAGE_SOURCE
  })
}

export const handleCacheGet = <V>(message: MessageFromWorker<V>, cache: LRUCache<string, V>, worker: Worker): void => {
  if(!message.key) throw new Error('Get cache should provide the key')
  const result = cache.get(message.key)
  if(result === undefined) {
    worker.send({
      id: message.id,
      success: false,
      value: undefined,
      source: LRU_CACHE_MESSAGE_SOURCE
    })
  } else {
    worker.send({
      id: message.id,
      success: true,
      value: result,
      source: LRU_CACHE_MESSAGE_SOURCE
    })
  }
}

export const handleCacheDel = <V>(message: MessageFromWorker<V>, cache: LRUCache<string, V>, worker: Worker): void => {
  if(!message.key) throw new Error('Delete cache should provide the key')
  cache.del(message.key)
  worker.send({
    id: message.id,
    success: true,
    source: LRU_CACHE_MESSAGE_SOURCE
  })
}

export const handleCacheReset = <V>(message: MessageFromWorker<V>, cache: LRUCache<string, V>, worker: Worker): void => {
  cache.reset()
  worker.send({
    id: message.id,
    success: true,
    source: LRU_CACHE_MESSAGE_SOURCE
  })
}
