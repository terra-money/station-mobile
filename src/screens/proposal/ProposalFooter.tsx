import React from 'react'
import { View, Text } from 'react-native'
import { TallyingUI } from '@terra-money/use-native-station'

const ProposalFooter = ({ title, contents }: TallyingUI) => (
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
