import { Options } from 'lru-cache'
import { Callbacks } from './types'
import { handleMessageFromWorker } from './handleMessageFromWorker'
import { handsMessageFromMaster } from './handleMessageFromMaster'

const initCacheMessageHandler = <V>(cacheSetting: Options<string, V>, callbacks: Callbacks<V>): void => {
  handleMessageFromWorker<V>(cacheSetting)
  handsMessageFromMaster<V>(callbacks)
}

export default initCacheMessageHandler
