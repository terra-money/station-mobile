import { Validator } from '@terra-money/terra.js'

export interface Contacts {
  email?: string
  website?: string
  medium?: string
  discord?: string
  telegram?: string
  twitter?: string
}

export interface TerraValidator extends Validator.Data {
  picture?: string
  contact?: Contacts
  miss_counter?: string
  voting_power?: string
  self?: string
  votes?: Vote[]
  rewards_30d?: string
  time_weighted_uptime?: number
  voting_power_rate?: number
  rank?: number
}

interface Vote {
  options: Option[]
  proposal_id: string
  title: string
}

interface Option {
  option: string
  weight: string
}
