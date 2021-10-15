module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './src',
      alias: {
        components: './src/components',
        consts: './src/consts',
        types: './src/types',
        styles: './src/styles',
        utils: './src/utils',
        assets: './src/assets',
        hooks: './src/hooks',
        stores: './src/stores',
        nativeModules: './src/nativeModules',
        lib: './src/lib',
      },
    },
  ]

  const plugins = [moduleResolver, 'react-native-reanimated/plugin']
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  }
}
