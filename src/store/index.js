import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hotList: [],
    privlist: [],
    firstSong: 0,
    isView: true,
    cookie: '',
    isLog: false,
    isPlay: false,
    isLock: false,
    headurl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    headname: '',
    headsonger: '',
    songTime: 0,
    playTime: 0,
    timer: {},
    banVolume: true,
    volume: 0,
    jinduValue: 0,
    list: [],
    selected: 0,
    index: 0,
    navIndex: sessionStorage.getItem('navIndex'),
    rankNavIndex: sessionStorage.getItem('rankIndex'),
    rankId: sessionStorage.getItem('rankId'),
    day: '立即更新',
    songerIndex: sessionStorage.getItem('songerIndex'),
    songerId: 0,
    loginVis: false,
    words: [],  //歌词
    flagIndex: -1,//歌词显示

  },
  mutations: {
    setFlagIndex(state,n) {
      state.flagIndex = n
    },
    setWords(state,w) {
      state.words = w
    },
    setLoginVis(state,i) {
      state.loginVis = i
    },
    setSongerId(state,i){
      state.songerId = i
    },
    setSongerIndex(state,i) {
      state.songerIndex= i
    },
    setDay(state,d){
      state.day = d
    },
    setRankNavIndex(state,i){
      state.rankNavIndex = i
    },
    setNavIndex(state,index){
      state.navIndex = index
    },
    setIndex(state,n){
      state.index = n
    },
    setSelected(state,n){
      state.selected = n
    },
    setList(state,arr){
      state.list = arr
    },
    setJinduValue(state,v){
      state.jinduValue = v
    },
    setVolume(state,v){
      state.volume = v
    },
    setBanVolume(state,f){
      state.banVolume = f
    },
    setTimer(state,timer){
      state.timer = timer
    },
    setPlayTime(state,t){
      state.playTime = t
    },
    setSongTime(state,time){
      state.songTime = time
    },
    setheadsonger(state,songer){
      state.headsonger = songer
    },
    setheadname(state,name){
      state.headname = name
    },
    setHeadUrl(state,url){
      state.headurl = url
    },
    setLock(state){
      state.isLock = !state.isLock
    },
    sethot(state, arr) {
      state.hotList = arr
    },
    setprivlist(state, arr) {
      state.privlist = arr
    },
    setFirstSong(state,id){
      state.firstSong = id
    },
    setIsView(state,flag){
      state.isView = flag
    },
    setCookie(state,cookie){
      state.cookie = cookie
    },
    setIsL(state,is){
      state.isLog = is
    },
    setIsplay(state,f){
      state.isPlay = f
    }
  },
  actions: {
  },
  modules: {
  }
})
