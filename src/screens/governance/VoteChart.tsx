import React, { ReactElement } from 'react'
import { gt, VoteOption } from '@terra-money/use-native-station'

// import Chart from '../../components/Chart'
// import Orb from '../../components/Orb'

import PieChart from '../../components/PieChart'

const VoteChart = ({
  options,
}: {
  options: VoteOption[]
}): ReactElement => {
  const filtered = options.filter((o) => gt(o.ratio, 0))

  const series = filtered.map((o) => parseFloat(o.ratio) * 100)
  const sliceColor = filtered.map((o) => o.color)

  // console.log('filtered', filtered)
  // console.log('series', series)
  // console.log('sliceColor', sliceColor)

  return (
    <>
      {filtered.length > 0 && (
        <PieChart
          chart_wh={60}
          series={series}
          sliceColor={sliceColor}
          doughnut={false}
          coverRadius={0.45}
          coverFill="#FFF"
        />
      )}
    </>
  )
}

export default VoteChart
