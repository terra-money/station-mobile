module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './src',
      alias: {
        components: './src/components',
        types: './src/types',
        styles: './src/styles',
        utils: './src/utils',
        assets: './src/assets',
        hooks: './src/hooks',
        stores: './src/stores',
        nativeModules: './src/nativeModules',
        'use-station': './src/use-station',
      },
    },
  ]

  const plugins = [moduleResolver]
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  }
}
