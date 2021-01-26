import validators from '../../validators'

export const useValidator = (): {
  getValidatorList: () => Promise<Record<string, string>>
} => {
  const getValidatorList = async (): Promise<
    Record<string, string>
  > => {
    return validators
  }

  return {
    getValidatorList,
  }
}
