import _ from 'lodash'

export function setComma(str: string | number): string {
  const parts = _.toString(str).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function delComma(str: string | number): string {
  return _.toString(str).replace(/,/g, '')
}
