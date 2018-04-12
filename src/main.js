const Vue = window.Vue

// import and register your component(s)
import customComponent from process.env.COMPONENT_PATH
Vue.customElement(process.env.COMPONENT_NAME, customComponent)
