import Vue from 'vue'

// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element'
Vue.use(VueCustomElement)

// import and register your component(s)
const customComponent = require(process.env.COMPONENT_PATH)
Vue.customElement(process.env.COMPONENT_NAME, customComponent)
