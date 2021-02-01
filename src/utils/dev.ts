// Do not commit 'console.log'
const log = (msg: string): void => {
  if (__DEV__) {
    // eslint-disable-next-line
    console.log(msg)
  }
}

export default {
  log,
}
