// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add jfif and webp to supported asset extensions
const { assetExts } = config.resolver;
config.resolver.assetExts = [...assetExts, 'jfif', 'webp'];

// Increase timeout for slow connections
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
};

// Increase watcher timeout
config.watchFolders = [__dirname];

module.exports = config;

