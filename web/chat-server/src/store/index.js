import { createStore } from 'vuex'

export default createStore({
  state: {
    // web服务器地址
    // backendUrl: 'https://192.168.2.114:8000',
    // wsUrl: 'wss://192.168.2.114:8000',
    backendUrl: 'https://123.56.164.220:8000',
    wsUrl: 'wss://123.56.164.220:8000',
    // 信令服务器地址
    // signalUrl: 'wss://127.0.0.1:8001',
    userInfo: (sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo'))) || {},
    socket: null,
    // 全局颜色变量 - 固定RGB值
    globalColor: 'rgb(246, 229, 247)',
  },
  getters: {
    // 获取全局颜色
    getGlobalColor: (state) => state.globalColor,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    cleanUserInfo(state) {
      state.userInfo = {};
      sessionStorage.removeItem('userInfo');
    },
    // 设置全局颜色 - 固定RGB值
    // setGlobalColor(state, rgbColor) {
    //   // 验证RGB格式
    //   if (rgbColor.startsWith('rgb(') && rgbColor.endsWith(')')) {
    //     state.globalColor = rgbColor;
    //     // 更新CSS变量
    //     document.documentElement.style.setProperty('--global-color', rgbColor);
    //   } else {
    //     console.warn('颜色格式必须是RGB格式，例如: rgb(229, 132, 132)');
    //   }
    // }
  },
  actions: {
    // 初始化全局颜色（在应用启动时调用）
    initGlobalColor({ commit, state }) {
      // 将store中的颜色应用到CSS变量
      document.documentElement.style.setProperty('--global-color', state.globalColor);
    }
  },
  modules: {
  },
  computed:{
    globalColor(){
      return this.$store.getters.getGlobalColor
    }
  }
})
