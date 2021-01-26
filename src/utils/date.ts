export const getDateYMD = (date: string): string => {
  const match = date.match(/^(\d){4}\.(\d){2}\.(\d){2}/g)
  return match ? match[0] : ''
}
