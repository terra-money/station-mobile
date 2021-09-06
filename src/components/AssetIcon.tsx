import React, { ReactElement } from 'react'
import { Image } from 'react-native'
import Terra from 'assets/svg/Terra'

export type AssetIconProps = {
  size?: number
  uri?: string
  name?: string
}

const AssetIcon = (props: AssetIconProps): ReactElement => {
  const { name, uri, size = 18 } = props
  const src =
    uri ||
    (name
      ? `https://assets.terra.money/icon/60/${name}.png`
      : undefined)

  return (
    <>
      {src ? (
        <Image
          source={{ uri: src }}
          style={{
            width: size,
            height: size,
          }}
        />
      ) : (
        <Terra width={size} height={size} />
      )}
    </>
  )
}

export default AssetIcon
