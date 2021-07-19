export const get = async (address: string): Promise<Response> => {
  const method = 'GET'
  const headers = new Headers()
  headers.append('pragma', 'no-cache')
  headers.append('cache-control', 'no-cache')

  return await fetch(address, { method, headers })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getJson = async (address: string): Promise<any> => {
  const ret = await get(address)
  return await ret.json()
}
