module.exports = {
  resolver: {
    extraNodeModules: require('node-libs-react-native'),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
