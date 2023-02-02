module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      alias: {
        '@core': './src/core',
        '@features': './src/features',
        '@playground': './src/playground',
      },
    },
  ]

  const plugins = [moduleResolver, 'react-native-reanimated/plugin']
  return {
    presets: ['module:metro-react-native-babel-preset'],
    retainLines: true,
    plugins,
  }
}
