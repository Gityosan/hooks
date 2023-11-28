import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
      meta: [
        { name: 'description', content: '' },
        { name: 'viewport', content: 'width=device-width' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        {
          rel: 'icon',
          href: '/favicon.png'
        }
      ]
    }
  },
  components: {
    global: true,
    dirs: ['~/components']
  },
  typescript: { shim: false, strict: true },
  css: ['@/assets/css/index.scss'],
  build: { transpile: ['vuetify'] },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  vite: {
    define: {
      'window.global': {},
      'process.env.DEBUG': false
    },
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },
  runtimeConfig: {
    public: {
      isDev: false,
      limit: 100,
      discordWebhook: ''
    }
  },
  devtools: {
    enabled: true
  }
})
