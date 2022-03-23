// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('metro-config')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (async () => {
  console.log(await getDefaultConfig())

  const {
    resolver: { assetExts },
  } = await getDefaultConfig()

  console.log(assetExts)

  return {
    resolver: {
      extraNodeModules: require('node-libs-react-native'),
      assetExts: [
        ...assetExts,
        'obj',
        'mtl',
        'JPG',
        'vrx',
        'hdr',
        'gltf',
        'glb',
        'bin',
        'arobject',
        'gif',
      ],
    },
    transformer: {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  }
})()
