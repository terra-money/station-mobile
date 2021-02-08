import _ from 'lodash'

// add comma for a number like 1000 -> 1,000
// check testcase in __test__
export function setComma(str?: string | number): string {
  const parts = _.toString(str).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// delete comma for a number like 1,000 -> 1000
// check testcase in __test__
export function delComma(str: string | number): string {
  return _.toString(str).replace(/,/g, '')
}
