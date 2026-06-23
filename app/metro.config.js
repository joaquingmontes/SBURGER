const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const androidBuildBlockList = new RegExp(
  [
    '.*[\\\\/]android[\\\\/]\\.gradle[\\\\/].*',
    '.*[\\\\/]android[\\\\/]app[\\\\/]\\.cxx[\\\\/].*',
    '.*[\\\\/]android[\\\\/]app[\\\\/]build[\\\\/].*',
    '.*[\\\\/]android[\\\\/]build[\\\\/].*',
    '.*[\\\\/]ios[\\\\/]build[\\\\/].*',
    '.*[\\\\/]\\.cxx[\\\\/].*',
    '.+[\\\\/]__tests__[\\\\/].*',
  ].join('|') + '$',
);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: androidBuildBlockList,
  },
  watcher: {
    healthCheck: {
      enabled: true,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
