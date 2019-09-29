import cluster, { Worker } from 'cluster'
import LRUCache, { Options } from 'lru-cache'
import { LRU_CACHE_MESSAGE_SOURCE } from '../consts'
import { MessageFromWorker } from './types'
import { handleCacheGet, handleCacheSet, handleCacheDel, handleCacheReset } from './messageHandler'

export const handleMessageFromWorker = <V>(cacheSetting?: Options<string, V>) => {
  if(cluster.isMaster) {
    const cache = new LRUCache({ ...cacheSetting })

    cluster.on('fork', (worker: Worker) => {
      worker.on('message', (message: MessageFromWorker<V>) => {
        if(message.source !== LRU_CACHE_MESSAGE_SOURCE) return
        switch (message.method) {
          case 'set':
            handleCacheGet<V>(message, cache, worker)
            break
          case 'get':
            handleCacheSet<V>(message, cache, worker)
            break
          case 'del':
            handleCacheDel<V>(message, cache, worker)
            break
          case 'reset':
            handleCacheReset<V>(message, cache, worker)
            break
          default:
            // eslint-disable-next-line no-console
            console.error('No default handler')
        }
      })
    })
  }
}


