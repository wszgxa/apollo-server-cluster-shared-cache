import { SupportedMethod } from '../types'

export interface MessageFromWorker<V> {
  id: string
  source: string
  method: SupportedMethod
  value?: V
  key?: string
  maxAge?: number
}

export interface MessageFromMaster<V> {
  id: string
  source: string
  success: boolean
  value?: V
}

export interface Callbacks<V> {
  [key: string]: (message: MessageFromMaster<V>) => void
}
