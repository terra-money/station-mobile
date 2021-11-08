import { UTIL } from 'consts'
import _ from 'lodash'

export const schemeUrl = {
  recoverWallet: /^terrastation:(|\/\/)wallet_recover\/\?payload=/,
  send: /^terrastation:(|\/\/)send\/\?payload=/,
}

export const getRecoverWalletDataFromPayload = (
  payload: string
): RecoverWalletSchemeDataType | undefined => {
  const bufferString = UTIL.fromBase64(payload)
  return UTIL.jsonTryParse<RecoverWalletSchemeDataType>(bufferString)
}

export const checkIfRecoverWalletQrCodeDataType = (
  data: RecoverWalletSchemeDataType
): boolean => {
  return (
    _.some(data) &&
    typeof data === 'object' &&
    'address' in data &&
    'name' in data &&
    'encrypted_key' in data
  )
}

export const createRecoverWalletPayload = (
  props: RecoverWalletSchemeDataType
): string => UTIL.toBase64(UTIL.jsonTryStringify(props))

export const createRecoverWalletSchemeUrl = (
  props: RecoverWalletSchemeDataType
): string => {
  const payload = createRecoverWalletPayload(props)
  return `terrastation://wallet_recover/?payload=${payload}`
}
