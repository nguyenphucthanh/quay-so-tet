const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer',
  })
})

// module.exports = {}
