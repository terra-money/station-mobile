import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { TallyingUI } from 'use-station/src'
import { Text } from 'components'

const ProposalFooter = ({ contents }: TallyingUI): ReactElement => (
  <>
    {contents.map(({ title, content }) => (
      <View key={title}>
        <Text>{title}</Text>
        <Text>{content}</Text>
      </View>
    ))}
  </>
)

export default ProposalFooter
