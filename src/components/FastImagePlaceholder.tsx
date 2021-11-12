import React, { ReactElement, useState } from 'react'
import { Platform, StyleProp } from 'react-native'
import FastImage, {
  Source,
  ImageStyle as FastImageStyle,
} from 'react-native-fast-image'

type FastImagePlaceholderProps = {
  source: Source | number
  style?: StyleProp<FastImageStyle>
  placeholder: Source | number
}

function FastImagePlaceholder({
  source,
  style,
  placeholder,
}: FastImagePlaceholderProps): ReactElement {
  const isLocalSource = typeof source !== 'number'
  const [loading, setLoading] = useState(isLocalSource)

  return (
    <>
      {loading && <FastImage source={placeholder} style={style} />}
      <FastImage
        source={source}
        style={loading ? { flex: 0 } : style}
        onLoad={(): void => setLoading(false)}
        fallback={Platform.OS === 'android' && isLocalSource}
      />
    </>
  )
}

export default FastImagePlaceholder
