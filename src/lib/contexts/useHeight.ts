import { useState, useEffect } from 'react'
import numeral from 'numeral'
import debounce from 'lodash/fp/debounce'
import { HeightData } from '../types'
import fcd from '../api/fcd'
import { intercept } from '../api/fcd'
import useFinder from '../hooks/useFinder'

// getting minting/parameters will trigger axios intercept
const trigger = (): Promise<any> =>
  fcd.get('/minting/parameters').catch()

export default (): HeightData | undefined => {
  const getLink = useFinder()
  const [height, setHeight] = useState<string>()

  const updateBlockHeight = debounce(1000)((height: string) => {
    setHeight(height)
  })

  useEffect(() => {
    // intercept request on height change
    const interceptId = intercept(updateBlockHeight)

    trigger()

    const intervalId = setInterval(() => {
      trigger()
    }, 3000)

    return (): void => {
      fcd.interceptors.response.eject(interceptId)
      clearInterval(intervalId)
    }
    // eslint-disable-next-line
  }, [])

  /* block */
  const block = height
    ? {
        formatted: `#${numeral(height).format()}`,
        link: getLink!({ q: 'blocks', v: height! }),
      }
    : undefined

  return block
}
