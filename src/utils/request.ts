export const get = async (address: string): Promise<Response> => {
  const init: RequestInit = {
    method: 'GET',
  }
  return await fetch(address, init)
}

export const getJson = async (address: string): Promise<any> => {
  const ret = await get(address)
  return await ret.json()
}
