export const whitelist = (): {
  topupGranteeAddress: string[]
  topupMessageType: string[]
} => {
  const topupGranteeAddress = [
    'terra1na2r5d5ele6hh2fz44avgzw5cxvem2j0aaz0nk',
  ]
  const topupMessageType = ['msgauth/MsgGrantAuthorization']

  return {
    topupGranteeAddress,
    topupMessageType,
  }
}
