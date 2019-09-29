import initCacheMessageHandler, { Callbacks, MessageFromMaster, MessageFromWorker } from './cluster-message-handler'
import { Options } from 'lru-cache'
import { SupportedMethod } from './types'
import uuid from 'uuid/v4'
import { LRU_CACHE_MESSAGE_SOURCE } from './consts'

interface Response<V> {
  success: boolean
  value?: V
}

class SharedLRUCache<V> {
  private timeout = 100
  private callbacks: Callbacks<V> = {}
  constructor(cacheSetting: Options<string, V>) {
    initCacheMessageHandler<V>(cacheSetting, this.callbacks)
  }

  public async set(key: string, value: V, maxAge?: number) {
    const result = await this.sendMessage('set', key, value, maxAge)
    return result.success
  }

  public async get(key: string) {
    const result = await this.sendMessage('get', key)
    return result.value
  }

  public async del(key: string) {
    const result = await this.sendMessage('del', key)
    return result.success
  }

  public async reset() {
    const result = await this.sendMessage('reset')
    return result.success
  }

  private async sendMessage(method: SupportedMethod, key?: string, value?: V, maxAge?: number): Promise<Response<V>> {
    return new Promise<Response<V>>((resolve) => {
      const messageFromWorker: MessageFromWorker<V> = {
        id: uuid(),
        source: LRU_CACHE_MESSAGE_SOURCE,
        method,
        key,
        value,
        maxAge
      }
      let isResolved = false
      setTimeout(() => {
        isResolved = true
        if(!isResolved) {
          resolve({
            success: false,
            value: undefined
          })
        }
      }, this.timeout)

      this.callbacks[messageFromWorker.id] = (messageFromMaster: MessageFromMaster<V>) => {
        const { success, value } = messageFromMaster
        if(!isResolved) {
          resolve({
            success,
            value
          })
        }
      }

      process.send && process.send(messageFromWorker)
    })
  }

}

export default SharedLRUCache
