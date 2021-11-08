import { NominalType } from './common'

// Native currencies
export type uToken = string & NominalType<'uToken'>
export type Token = string & NominalType<'Token'>
