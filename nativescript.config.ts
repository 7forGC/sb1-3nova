import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.yourdomain.messagingapp',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    codeCache: true,
    suppressCallJSMethodExceptions: false
  },
  ios: {
    discardUncaughtJsExceptions: false
  },
  useLibs: true,
  webpackConfigPath: 'webpack.config.js'
} as NativeScriptConfig;