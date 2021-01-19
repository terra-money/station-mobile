import React, { ReactElement } from 'react'
import { Image, View } from 'react-native'
import images from 'assets/images'
import Terra from 'assets/svg/Terra'
import Luna from 'assets/svg/Luna'

export type AssetIconNameType =
  | 'EUT'
  | 'KRT'
  | 'Luna'
  | 'SDT'
  | 'Terra'
  | 'UST'

export type AssetIconProps = {
  size?: number
  uri?: string
  name?: AssetIconNameType
}

const AssetIcon = (props: AssetIconProps): ReactElement => {
  const { name, uri, size = 16 } = props

  return (
    <>
      {uri ? (
        <View
          style={{
            backgroundColor: 'black',
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
            style={{ width: size, height: size }}
          />
        </View>
      ) : name === 'Terra' ? (
        <Terra width={size} height={size} />
      ) : name === 'Luna' ? (
        <Luna width={size} height={size} />
      ) : name ? (
        <Image
          source={images[name]}
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
