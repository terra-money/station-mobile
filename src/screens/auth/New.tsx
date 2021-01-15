import React, { useState, useEffect, ReactElement } from 'react'
import { modules } from 'utils'
import Add from './Add'

const New = (): ReactElement => {
  const [seed, setSeed] = useState<string[]>([])

  useEffect(() => {
    const generate = async (): Promise<void> => {
      const mnemonic = await modules.generateSeed()
      setSeed(mnemonic.split(' '))
    }

    generate()
  }, [])

  return <>{seed.length === 24 && <Add generated={seed} />}</>
}

export default New
