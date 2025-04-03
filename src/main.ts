// style
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'leaflet/dist/leaflet.css';
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// Vuetify
import 'vuetify/styles'
import '@/styles/vuetify/index.less';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
const app = createApp(App)
const vuetify = createVuetify({
    defaults: {
      // global: {
      // },
      VTextField: {
        // underlined: false
      },
      // VSelect: {
      //   hideDetails: true,
      //   variant: 'outlined',
      //   density: 'compact',
      // }
    },
    components,
    directives,
    // 全局引入material design icon
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  });
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
