import { DocumentNode, gql } from '@apollo/client'

interface Item {
  token: string
  contract: string
  msg: Record<string, unknown>
}

const aliasItem = ({ token, contract, msg }: Item): string => `
    ${token}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

export default (list: Item[]): DocumentNode => gql`
  query {
    ${list.map(aliasItem)}
  }
`

export const stringify = (msg: Record<string, unknown>): string =>
  JSON.stringify(msg).replace(/"/g, '\\"')
