module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './src',
      alias: {
        components: './src/components',
        styles: './src/styles',
        utils: './src/utils',
        assets: './src/assets',
      },
    },
  ]

  const plugins = [moduleResolver]
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  }
}
