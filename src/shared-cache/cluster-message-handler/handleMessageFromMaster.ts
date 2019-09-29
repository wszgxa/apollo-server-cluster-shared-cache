import cluster from 'cluster'
import { MessageFromMaster, Callbacks } from './types'
import { LRU_CACHE_MESSAGE_SOURCE } from '../consts'

export const handsMessageFromMaster = <V>(callbacks: Callbacks<V>) => {
  if(cluster.isWorker) {
    process.on('message', (message: MessageFromMaster<V>) => {
      if(message.source !== LRU_CACHE_MESSAGE_SOURCE || callbacks[message.id] === undefined) return

      const callback = callbacks[message.id]
      callback(message)
    })
  }
}

