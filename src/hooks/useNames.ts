import { useState, useEffect } from 'react'
import { loadNames } from '../utils/storage'

export default (): string[] | undefined => {
  const [names, setNames] = useState<string[]>()

  useEffect(() => {
    const load = async (): Promise<void> => {
      const names = await loadNames()
      setNames(names)
    }

    load()
  }, [])

  return names
}
