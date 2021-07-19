import React, { ReactElement } from 'react'
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: animateTransform */

const SvgComponent = (props: SvgProps): ReactElement => {
  return (
    <Svg
      width={38}
      height={38}
      viewBox="0 0 38 38"
      stroke="#2043B5"
      {...props}
    >
      <G
        transform="translate(1 1)"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
      >
        <Circle strokeOpacity={0.3} cx={18} cy={18} r={18} />
        <Path d="M36 18c0-9.94-8.06-18-18-18"></Path>
      </G>
    </Svg>
  )
}

export default SvgComponent
