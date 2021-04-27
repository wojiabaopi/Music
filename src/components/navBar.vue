<template>
  <div class="navbar">

    <div class="left">
      <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1375463293,1992165362&fm=26&gp=0.jpg" alt="">
      <div>午夜神话</div>
    </div>

    <div class="center">
      <div :key="index" :class="index === activeIndex ? 'active':''"
           @click="navClick(index)" v-for="(item,index) in navList">{{item}}</div>

    </div>

    <div class="right">
      <div class="search">
        <i class="el-icon-search"></i>
        <input class="input-search" @input="inputShow" @blur="inputBlur" @change="searchInput" @focus="handleFocus" type="text" v-model="inputText"  >
      </div>
      <div v-show="isSearch"  class="searchBox">
        <div class="top-box">
          <span>搜“{{inputText}}" 相关得到:</span>
        </div>
        <div class="input-content">
          <div class="box1">
            <div style="height: 50%">
              <span style="font-size: 16px" class="el-icon-headset"></span>
              <span style="margin-left: 5px">单曲</span>
            </div>
            <div style="height: 25%">
              <span style="font-size: 16px" class="el-icon-video-play"></span>
              <span style="margin-left: 5px">专辑</span>
            </div>
            <div style="height: 25%">
              <span style="font-size: 16px" class="el-icon-tickets"></span>
              <span style="margin-left: 5px">歌单</span>
            </div>
          </div>
          <div class="box2">
            <div class="b1">
              <div v-if="songList !== []" class="s" v-for="(item,index) in songList" :key="index">
                <a @click="playAudio(item.id)" href="javascript:;">{{item.name}}-{{item.artists[0].name}}</a>
              </div>
            </div>
            <div class="b2">
              <div  v-if="abList !== []" class="s" v-for="(item,index) in abList" :key="index">
                <a @click="goA(item.id)" href="javascript:;">{{item.name}}-{{item.artists[0].name}}</a>
              </div>
            </div>
            <div class="b3">
              <div  v-if="sheetList !== []" class="s" v-for="(item,index) in sheetList" :key="index">
                <a @click="toD(item.id)" href="javascript:;">{{item.name}}-{{item.creator.nickname}}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isLogin" @click="loginVis = true" class="right-login">登录</div>
      <div v-else class="right-login2">
        <el-popover
          placement="bottom"
          trigger="hover">
           <el-button @click="quitLogin" style="margin-left: 20px" size="mini" type="info">点击退出登陆</el-button>
          <img slot="reference" :src="profile.avatarUrl" alt="">
        </el-popover>
      </div>
    </div>


    <el-dialog
      @close="close"
      :title="title"
      :visible.sync="loginVis"
      width="30%">
      <div class="login-div">
        <el-input  prefix-icon="el-icon-user" @input="reg2"  clearable style="margin-bottom: 10px" v-model="input1" placeholder="账号"></el-input>
        <el-input @keyup.enter.native="login(input1,input2)" @input="reg" prefix-icon="el-icon-lock" show-password clearable v-model="input2" placeholder="密码"></el-input>

        <div class="register-reg" v-if="flag">
          <p v-if="pawd1" class="el-icon-success">密码不能包含空格</p>
          <p v-else class="el-icon-warning">密码不能包含空格</p>
          <p class="el-icon-success" v-if="pawd2">包含数字，符号，字母中至少两种</p>
          <p class="el-icon-warning" v-else>包含数字，符号，字母中至少两种</p>
          <p class="el-icon-success" v-if="pawd3">密码长度为8-20位</p>
          <p class="el-icon-warning" v-else>密码长度为8-20位</p>
        </div>
        <el-input  v-if="flag"  prefix-icon="el-icon-s-check"  clearable style="width: 150px;margin-left: 38px; margin-top: 10px" v-model="input3" placeholder="验证码"></el-input>
        <el-button v-if="flag&&!flag4" @click="sent" type="primary" style="margin-left: 50px" :disabled="flag3" round>发送验证码</el-button>
        <el-button v-if="flag&&flag4" type="primary" style="margin-left: 50px" :disabled="flag4" round>{{time}}s后再次发送</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <span v-if="flag2" class="register">没有账号?点击 <a @click="aClick" href="javascript:;">注册</a> </span>
        <span v-else class="register">已有账号?点击 <a @click="a2Click" href="javascript:;">登录</a></span>
       <el-button  v-if="flag"  type="primary" :disabled="flag3" @click="register">注册</el-button>
        <el-button v-else type="primary" @click="login(input1,input2)">登录</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "navBar",
  data (){
    return {
      isSearch: false,
      inputText: '音乐/视频/电台/用户',
      navList: ['推荐音乐','排行榜','歌单','歌手','我的音乐'],
      dialogVisible: false,
      input1: '',
      input2: '',
      title: '登录',
      flag: false,
      flag2: true,
      isLogin: false,
      profile: {},
      flag3: true,
      pawd1: false,
      pawd2: false,
      pawd3: false,
      input3: '',
      time: 60,
      timer: {},
      flag4: false,
      songList: [],
      abList: [],
      sheetList: [],
      t: '',
      flag5: true,
      mark: 0,
      speed: 0,
      tracks: [],
      url: ''
    }
  },
  watch: {
    inputText: function (newVal,oldVal) {
      if(newVal !== '音乐/视频/电台/用户' && newVal !== '') {
        this.debounce(this.getList,500)
      }
    }
  },
  computed: {
    loginVis: {
      get(){
        return this.$store.state.loginVis
      },
      set(v){
        this.$store.commit('setLoginVis',v)
      }
    },
    activeIndex: {
      get(){
        return this.$store.state.navIndex
      },
      set(v){
        this.$store.commit('setNavIndex',v)
      }
    }
  },
  methods: {
    playAudio(id) {
        this.$http.get('/song/url?id=' + id).then(res2 => {
          if (res2.data.code == 200) {
            this.url = res2.data.data[0].url
            const audio = document.getElementById('audio1')
            audio.setAttribute('src', this.url)
            //重新加载
            audio.load()
            //返回当前音频的总长
            audio.oncanplay = () => {
              audio.play()
              this.$message({
                type: 'success',
                message: '播放成功',
                center: true,
                offset: 200
              })
            }

          } else {
            this.$message({
              type: 'err0r',
              center: true,
              message: 'url资源获取失败',
              offset: 200
            })
          }
        })
    },
    goA(id) {
      this.$router.push('/album/' + id)
    },
    toD(id) {
      this.$router.push('/songSheetDetail/' + id)
      this.$store.commit('setNavIndex',2)
    },
    debounce(fn,wait) {
      if(this.t !== null) {
        clearTimeout(this.t)
      }
      this.t = setTimeout(fn,wait)
    },
    getList() {
      this.$http.get('/search?keywords=' + this.inputText).then( res => {
        this.songList = res.data.result.songs.slice(0,4)
      })
      this.$http.get('/search?keywords=' + this.inputText+'&type=10').then( res => {
        this.abList = res.data.result.albums.slice(0,2)
      })
      this.$http.get('/search?keywords=' + this.inputText+'&type=1000').then( res => {
        this.sheetList = res.data.result.playlists.slice(0,2)
      })
    },
    inputShow() {
      this.isSearch = true
    },
    searchInput() {

    },
    quitLogin() {
      this.$http.get('/logout').then( res => {
        if(res.status === 200) {
          this.$message({
            type: 'success',
            message: '退出登陆成功'
          })
          this.isLogin = false
          this.$store.commit('setIsL',false)
          sessionStorage.setItem('value','false')
          sessionStorage.setItem('username','')
          sessionStorage.setItem('password','')
        }

      })
    },
    close(){
      this.input3 = ''
      this.input2 = ''
      this.input1 = ''
      this.title = '登录'
      this.flag = false
      this.flag2 = true
      this.flag3 = true
      this.pawd3 = false
      this.pawd2 = false
      this.pawd1 = false
      this.time = 60
      this.flag4 = false
    },
    timesub(){
      this.timer = setInterval( ()=> {
        if(this.time > 0){
          this.time--
        } else {
          clearInterval(this.timer)
          this.flag4 = false
        }
      },1000)
    },
    sent() {
      this.$http.get('/captcha/sent?phone='+this.input1).then( res => {
        if(res.data.code === 200){
          this.flag4 = true
          this.$message({
            type: 'success',
            message: '发送成功',
            center: true,
            offset: 200
          })
          this.timesub()
        }
      }).catch( error => {
        this.$message({
          type: 'error',
          message: '发送失败',
          center: true,
          offset: 200
        })
      })
    },
    reg2(){
      if(this.pawd1 && this.pawd2 && this.pawd3 && this.input1 != ''){
        this.flag3 = false
      } else {
        this.flag3 = true
      }
    },
    reg(){
      const r1 = /^[^ ]+$/
      const r2 = /^.{8,20}$/
      const r3 = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{2,20}$/

      if( r1.test(this.input2)){
        this.pawd1 = true
      } else {
        this.pawd1 = false
      }
      if( r2.test(this.input2)){
        this.pawd3 = true
      } else {
        this.pawd3 = false
      }
      if( r3.test(this.input2)){
        this.pawd2 = true
      } else {
        this.pawd2 = false
      }
      if(this.pawd1 && this.pawd2 && this.pawd3 && this.input1 != ''){
        this.flag3 = false
      } else {
        this.flag3 = true
      }
    },
    register(){
      this.loginVis = false
      this.$http.get('/captcha/verify?phone='+this.input1+'&captcha=' + this.input3).then( res => {
        if(res.data.code === 200){
          this.$http.get('/register/cellphone?phone='+this.input1+'&password='+this.input2+'&captcha='+this.input3+'&nickname=默认Nic').then( res => {
            if( res.data.code === 200){
              this.$message({
                type: 'success',
                message: '注册成功',
                center: true,
                offset: 200
              })
            } else {
              this.$message({
                type: 'error',
                message: '注册失败',
                center: true,
                offset: 200
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '验证失败',
            center: true,
            offset: 200
          })
        }
      }).catch( error => {
        this.$message({
          type: 'error',
          center: true,
          offset: 200,
          message: '注册失败!'
        })
      })
      this.flag = false
      this.flag2 = false
      this.input1 = ''
      this.input2 = ''
      this.input3 = ''
      this.title = '登录'
    },
    login(username,password){
      if(username ==='' || password===''){
        this.$message({
          type: 'error',
          center: true,
          offset: 200,
          message: '密码或账号不能为空!'
        })
        return
      }
      this.loginVis = false
      this.$http.get('/login/cellphone?phone='+username+'&password='+password).then( res => {
        if(res.data.code === 200){
          this.$store.commit('setIsL',true)
          sessionStorage.setItem('value','true')
          sessionStorage.setItem('username',username)
          sessionStorage.setItem('password',password)
          this.$store.commit('setCookie',res.data.cookie)
          this.isLogin = true
          this.profile = res.data.profile
          this.$message({
            type: 'success',
            center: true,
            message: '登录成功！',
            offset: 200
          })

        } else {
          this.$message({
            type: 'error',
            center: true,
            message: res.data.message,
            offset: 200
          })
        }
      }).catch( error => {
        this.$message({
          type: 'error',
          message: '账号或密码错误',
          center: true
        })
      })
      this.input2 = ''
      this.input1 = ''
    },
    a2Click(){
      this.title = '登录'
      this.flag2 = true
      this.flag = false
    },
    aClick(){
      this.title = '注册'
      this.flag2 = false
      this.flag = true
    },
    handleFocus() {
      this.inputText = ''
      this.isSearch = true
      this.songList = []
      this.abList = []
      this.sheetList = []
    },
    inputBlur() {
      if(this.inputText === '') {
        this.inputText = '音乐/视频/电台/用户'
      }
      setTimeout( () => {
        this.isSearch = false
      },500)
    },
    navClick(index) {
      this.activeIndex = index
      sessionStorage.setItem('navIndex',index)
      switch (index) {
        case 0: this.$router.push('/home'); break ;
        case 1: this.$router.push('/rank'); break;
        case 2: this.$router.push('/songSheet/'+'全部'); break;
        case 3: this.$router.push('/songer'); break;
        case 4: this.$router.push('/mysong'); break;
      }

    }
  },
  mounted() {
    const value = sessionStorage.getItem('value')
    if(value === 'true'){
      const user = sessionStorage.getItem('username')
      const password = sessionStorage.getItem('password')
      this.login(user,password)
    }

  }

}
</script>

<style lang="less" scoped>
  .searchBox {
    width: 220px;
    z-index: 9999;
    height: 300px;
    color: #5d5a5a;
    background-color: #ffffff;
    position: absolute;
    top: 60px;
    margin-left: 40px;
    border-radius: 5px;
    border: 1px solid #8c939d;
    box-shadow: 0 0 5px #8e8e8e;
    .top-box {
      font-size: 12px;
      margin-top: 10px;
      margin-left: 10px;

    }
    .input-content {
      display: flex;
      border-top: 1px solid #cccccc;
      width: 220px;
      height: 250px;
      margin-top: 25px;
      font-size: 12px;
      .box1 {
        border-right: 1px solid #8e8e8e;
        width: 30%;
        height: 100%;
        padding-left: 10px;
        padding-top: 10px;
      }
      .box2 {
        width: 70%;
        height: 100%;
        .b1 {
          height: 50%;
          border-bottom: 1px solid #8e8e8e;
          .s:hover {
            background-color: #e3e5e7;
          }
          .s {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 90%;
            height: 28px;
            padding-left: 10px;
            a {
              line-height: 28px;
              color: #5d5a5a;
              font-size: 12px;
            }
          }
        }
        .b2 {
          border-bottom: 1px solid #8e8e8e;
          height: 25%;
          background-color: #f9f8f8;
          .s:hover {
            background-color: #e3e5e7;
          }
          .s {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 90%;
            height: 28px;
            padding-left: 10px;
            a {
              line-height: 28px;
              color: #5d5a5a;
              font-size: 12px;
            }
          }
        }
        .b3 {
          height: 23%;
          background-color: #f9f8f8;
          .s:hover {
            background-color: #e3e5e7;
          }
          .s {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 90%;
            height: 28px;
            padding-left: 10px;
            a {
              line-height: 28px;
              color: #5d5a5a;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .navbar {
    .active {
      color: #ffffff;
      background-color: #000000;
    }
    height: 70px;
    display: flex;
    justify-content: space-around;
    background-color: #242424;
    .left {
      flex: 0.8;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      div {
        cursor: pointer;
        margin-left: 10px;
        line-height: 70px;
        color: #e4e4e4;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 23px;

      }
      img {
        cursor: pointer;
        height: 40px;
        border-radius: 50%;
      }
    }

    .center{
      flex: 1;
      justify-content: space-between;
      align-items: center;
      color: #acacac;
      display: flex;
      div {
        flex: 1;
        text-align: center;
        height: 70px;
        line-height: 70px;
        cursor: pointer;
      }
      div:hover {
        color: #ffffff;
        background-color: #000000;
      }
    }
    .right {
      flex: 1;
      display: flex;
      color: #acacac;
      align-items: center;

      .search {
        width: 160px;
        border-radius: 20px;
        height: 30px;
        background-color: #ffffff;
        margin: 0 50px;
        i {line-height: 30px;
          color: #717171;
          margin: 0 4px;
        }
        input {
          color: #a9a9a9;
          letter-spacing: 1px;
          font-size: 12px;
          border: none;
          height: 25px;
          width: 130px;
        }
        input:focus {
        outline: none;
          color: #6e6e6e;
        }
      }
      .right-login {
        font-size: 12px;
        cursor: pointer;
      }
      .right-login2 {
        img {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
      .right-login:hover {
        color: #ffffff;
      }

    }
    .register {
      font-size: 12px;
      margin-right: 20px;
      a {
        color: #9999a6;
      }
    }
    .login-div {
      .el-input {
        width: 70%;
        transform: translateX(25%);
      }
      .register-reg {
        p {
          font-size: 12px;
          margin-top: 5px;
          margin-left: 80px;
        }
      }
    }
  }
</style>