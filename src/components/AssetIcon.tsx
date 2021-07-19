import React, { ReactElement } from 'react'
import { Image, View } from 'react-native'
import Terra from 'assets/svg/Terra'

export type AssetIconProps = {
  size?: number
  iconSize?: number
  uri?: string
  name: string
}

const AssetIcon = (props: AssetIconProps): ReactElement => {
  const { name, uri, size = 16, iconSize = 12 } = props
  const src = `https://assets.terra.money/icon/60/${name}.png`

  return (
    <>
      {uri ? (
        <View
          style={{
            backgroundColor: '#131A2F',
            borderWidth: 1,
            borderRadius: 100,
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri }}
            style={{ width: iconSize, height: iconSize }}
          />
        </View>
      ) : name === 'Terra' ? (
        <Terra width={size} height={size} />
      ) : name ? (
        <Image
          source={{ uri: src }}
          style={{
            width: size,
            height: size,
          }}
        />
      ) : (
        <Image
          source={{
            uri: 'https://dummyimage.com/20x20/000/ffffff&text=+',
          }}
          style={{
            width: size,
            height: size,
          }}
        />
      )}
    </>
  )
}

export default AssetIcon
