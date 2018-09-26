'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

var path = require('path')

module.exports = {
  dev: {
    autoOpenBrowser: true,
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/COSCenter':{
        target:'http://101.200.0.8:8066/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COSCenter':'/'
        }
      },
      '/COS0IN':{
        target:'http://172.16.1.100:888/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS0IN':'/'
        }
      },
      '/COS0OUT':{
        target:'http://111.160.234.166:888/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS0OUT':'/'
        }
      },
      '/COS1OLD':{
        target:'http://101.200.0.8:8060/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1OLD':'/'
        }
      },
      '/COS1A':{
        target:'http://101.200.0.8:8060/COSA/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1A':'/'
        }
      },
      '/COS1B':{
        target:'http://101.200.0.8:8060/COSB/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1B':'/'
        }
      },
      '/COS1C':{
        target:'http://101.200.0.8:8060/COSC/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1C':'/'
        }
      },
      '/COS1D':{
        target:'http://101.200.0.8:8060/COSD/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1D':'/'
        }
      },
      '/COS1E':{
        target:'http://101.200.0.8:8060/COSE/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
            '^/COS1E':'/'
        }
      },
      '/COS1F':{
        target:'http://101.200.0.8:8060/COSF/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
            '^/COS1F':'/'
        }
      },
      '/COS1Z':{
        target:'http://101.200.0.8:8060/COSZ/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
            '^/COS1Z':'/'
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    autoOpenBrowser:true,
    proxyTable: {
      '/COSCenter':{
        target:'http://101.200.0.8:8066/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COSCenter':'/'
        }
      },
      '/COS0IN':{
        target:'http://172.16.1.100:888/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS0IN':'/'
        }
      },
      '/COS0OUT':{
        target:'http://111.160.234.166:888/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS0OUT':'/'
        }
      },
      '/COS1OLD':{
        target:'http://101.200.0.8:8060/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1OLD':'/'
        }
      },
      '/COS1A':{
        target:'http://101.200.0.8:8060/COSA/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1A':'/'
        }
      },
      '/COS1B':{
        target:'http://101.200.0.8:8060/COSB/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1B':'/'
        }
      },
      '/COS1C':{
        target:'http://101.200.0.8:8060/COSC/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1C':'/'
        }
      },
      '/COS1D':{
        target:'http://101.200.0.8:8060/COSD/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
          '^/COS1D':'/'
        }
      },
      '/COS1E':{
        target:'http://101.200.0.8:8060/COSE/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
            '^/COS1E':'/'
        }
      },
      '/COS1F':{
        target:'http://101.200.0.8:8060/COSF/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
            '^/COS1F':'/'
        },
      },
      '/COS1Z':{
        target:'http://101.200.0.8:8060/COSZ/',
        // target:'http://127.0.0.1:1337/',
        changeOrigin:true,
        pathRewrite: {
            '^/COS1Z':'/'
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 80,

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
