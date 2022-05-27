import { API, CoinItem, Card } from '..'

export interface TxsPage extends API<TxsData> {
  ui?: TxsUI
}

export interface TxsUI {
  card?: Card
  list?: TxUI[]
  more?: () => void
}

export interface TxUI {
  link: string
  hash: string
  date: string
  messages: MessageUI[]
  details: Card[]
}

export interface MessageUI {
  tag: string
  summary: string[]
  success: boolean
}

/* data */
export interface TxsData {
  txs: Tx[]
}

export interface Tx {
  id: number
  height: number
  timestamp: string
  txhash: string
  chainId: string
  tx: {
    type: string
    value: TxValue
  }
  raw_log: string
}

export interface TxValue {
  fee: { gas: string; amount: { amount: string; denom: string }[] }
  memo: string
  msg: { type: string; value: any }[]
}

export interface Message {
  tag: string
  text: string
  out?: CoinItem[]
}


export interface TxsDataV2 {
  txs: TxV2[]
}

export interface TxV2 {
  body: {
    messages: {
      type_url: string,
      value: string
    }[]
    memo: string
    timeout_height: string
    extension_options: {
      type_url: string
      value: string
    }[]
    non_critical_extension_options: {
      type_url: string
      value: string
    }[]
  }
  auth_info: {
    signer_infos: {
      public_key: {
        type_url: string
        value: string
      }
      mode_info: {
        single: {
          mode: string
        }
        multi: {
          bitarray: {
            extra_bits_stored: 0
            elems: string
          }
          mode_infos: []
        }
      }
      sequence: string
    }[]
    fee: {
      amount: {
        denom: string
        amount: string
      }[]
      gas_limit: string
      payer: string
      granter: string
    }
  }
  signatures: string[]
}
