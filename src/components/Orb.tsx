import React from 'react'
import { View, Image } from 'react-native'

interface Props {
  ratio?: string
  size: number
  className?: string
  completed?: string
}

const Orb = ({ ratio = '0' }: Props) => {
  const orbSize = 60
  const orbHeight = orbSize * parseFloat(ratio)

  return (
    <>
      <View
        style={{
          justifyContent: 'flex-end',
          width: orbSize,
          height: orbSize,
          borderRadius: orbSize / 2,
          backgroundColor: 'rgb(233, 237, 248)',
          overflow: 'hidden',
        }}
      >
        {orbHeight > 0 && (
          <Image
            source={require('../../assets/orb_fill.png')}
            style={{ top: 3 }}
          />
        )}
        <View
          style={{
            height: orbHeight,
            backgroundColor: 'rgb(26, 153, 128)',
          }}
        />
      </View>
    </>
  )
}

export default Orb
