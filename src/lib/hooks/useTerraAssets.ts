import axios from 'axios'
import { useEffect, useState } from 'react'

const config = { baseURL: 'https://assets.terra.money' }

const useTerraAssets = <T = any>(
  path: string
): {
  data: T | undefined
  loading: boolean
  error: Error | undefined
} => {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      try {
        setLoading(true)
        const { data } = await axios.get(path, config)
        setData(data)
      } catch (error) {
        setError(error)
      }
      setLoading(false)
    }

    fetch()
  }, [path])

  return { data, loading, error }
}

export default useTerraAssets
