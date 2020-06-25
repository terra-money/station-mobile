import React, { useState, useEffect } from 'react'
import { modules } from '../../utils'
import Add from './Add'

const New = () => {
  const [seed, setSeed] = useState<string[]>([])

  useEffect(() => {
    const generate = async () => {
      const mnemonic = await modules.generateSeed()
      setSeed(mnemonic.split(' '))
    }

    generate()
  }, [])

  return seed.length === 24 ? <Add generated={seed} /> : null
}

export default New
