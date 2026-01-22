const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Windows - disable problematic node externals
config.resolver.blockList = [
  /node:sea/,
];

// Alternative: completely disable node externals on Windows
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Skip node: protocol modules that cause issues on Windows
  if (moduleName.startsWith('node:')) {
    return {
      type: 'empty',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
