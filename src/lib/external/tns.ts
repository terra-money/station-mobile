import useLCD from 'hooks/useLCD'
import { QueryObserverResult, useQuery } from 'react-query'
import { QueryKeyEnum } from 'types'
import keccak256 from 'keccak256'
import { useCurrentChainName } from 'lib/contexts/ConfigContext'

/**
 * Resolve terra address from a domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The terra address of the specified name, null if not resolvable
 */
const RegistryContracts: Dictionary<string> = {
  mainnet: 'terra19gqw63xnt9237d2s8cdrzstn98g98y7hkl80gs',
  testnet: 'terra1fmmced3dms3ha2st4y2qj8w5v2zyel7xpg8wpq',
}
export const useTnsAddress = (
  name: string
): QueryObserverResult<string, unknown> => {
  const lcd = useLCD()
  const currentChainName = useCurrentChainName()
  return useQuery(
    [QueryKeyEnum.tns, name],
    async () => {
      try {
        /**
         * Get the resolver address of a given domain name.
         *
         * @param name - A TNS identifier such as "alice.ust"
         * @returns The Resolver contract address of the specified name, null if the domain does not exist.
         *
         * @see https://docs.ens.domains/#ens-architecture for the role of Resolver Contract
         */
        const { resolver } = await lcd.wasm.contractQuery<{
          resolver: string
        }>(RegistryContracts[currentChainName], {
          get_record: { name },
        })

        if (!resolver) return

        const { address } = await lcd.wasm.contractQuery<{
          address: string
        }>(resolver, { get_terra_address: { node: node(name) } })

        return address
      } catch {}
    },
    { enabled: name.endsWith('.ust') }
  )
}

/**
 * Generate a unique hash for any valid domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The result of namehash function in a {@link Buffer} form
 *
 * @see https://docs.ens.domains/contract-api-reference/name-processing#hashing-names
 * for ENS Terminology
 *
 * @see https://eips.ethereum.org/EIPS/eip-137#namehash-algorithm
 * for namehash algorithm specification proposed in EIP-137
 */
function namehash(name: string): Buffer {
  if (name) {
    const [label, remainder] = name.split('.')
    return keccak256(
      Buffer.concat([namehash(remainder), keccak256(label)])
    )
  }

  return Buffer.from(''.padStart(64, '0'), 'hex')
}

/**
 * Generate the output of the namehash function in a form of number array
 * which is supported by the contract query.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The result of namehash function in a number array format
 */
function node(name: string): number[] {
  return Array.from(Uint8Array.from(namehash(name)))
}
