import { useState, useEffect } from 'react'
import { loadKey } from '../utils/storage'
import useNames from './useNames'

export default (): { names?: string[]; keys?: Key[] } => {
  const names = useNames()
  const [keys, setKeys] = useState<Key[]>()

  useEffect(() => {
    const collectKeys = async (names: string[]) => {
      await names.forEach(async (name) => {
        const key = await loadKey(name)
        setKeys((keys) => [...(keys || []), key])
      })
    }

    names && collectKeys(names)
  }, [Array.isArray(names)])

  return { names, keys }
}
