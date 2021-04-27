<template>
  <div id="app">
    <nav-bar></nav-bar>

    <router-view/>
    <div v-show="wordsShow"  class="words">
      <span @click="changeWordShow" class="el-icon-error icon1"></span>
      <div  class="father" ref="father">
        <div v-if="flagIndex===i" v-for="(item,i) in wordStr"   :key="item.uid" class="words-item">
          <span  :style="{color: flagIndex === i ? 'yellow' : 'white'}">{{item.lyric}}</span>
        </div>
      </div>
    </div>
    <div :class="this.$store.state.isView? 'view':'' " id="audio-play">
      <div class="play-content">
        <div id="play-list" :class="list? 'vo': ' '">
          <div class="list-title">
            <span class="count">播放列表({{this.$store.state.list.length}})</span>
            <span @click.stop="delall" class="el-icon-delete"><a class="delete" href="javascript:;">清除</a></span>
          </div>
          <div class="lists">
            <div class="list-item" @click="clickPlay(item.id)" :class="select===index?'dis':''"
                 v-for="(item,index) in this.$store.state.list" :key="index">
              <i :class="select===index?'vo2':''" class="el-icon-s-flag flag"></i>
              <span class="n">{{item.name}}</span>
              <span class="s"><a href="javascript:;">{{ item.ar[0].name }}</a></span>
              <span class="t">{{item.dt | timeFormat}}</span>
              <span @click.stop="del(index)" class="el-icon-delete d"></span>
            </div>
          </div>
        </div>


        <div :class="vo?'vo':' '" id="div-volume">
          <el-slider
            class="el-slider-2"
            v-model="volume"
            vertical
            @change="changeVolume"
            height="90px">
          </el-slider>
        </div>
        <div v-if="!vo" id="red-line">
        </div>
        <span @click.stop="prev" class="el-icon-d-arrow-left prev"></span>
        <span @click.stop="play" v-if="this.$store.state.isPlay" class="el-icon-video-pause play"></span>
        <span @click.stop="pause" v-else class="el-icon-video-play pause"></span>
        <span @click.stop="next" class="el-icon-d-arrow-right next"></span>
        <span class="lock">
            <i @click="changeLock" v-if="isLock" class="el-icon-lock"></i>
            <i @click="changeLock" v-else class="el-icon-unlock"></i>
          </span>
        <span class="pic">
          <img :src="this.$store.state.headurl" alt="">
        </span>
        <span class="name"><a href="javascript:;"> {{this.$store.state.headname}}</a> </span>
        <span class="songer"><a href="javascript:;">{{ this.$store.state.headsonger }}</a></span>
        <!--        <span id="jindutiao" @click="handler($event)"  class="jindutiao">-->
        <el-slider class="el-slider-1" :show-tooltip="false" @change="sliderChange"
                   v-model="value"></el-slider>
        <span class="playTime">{{this.$store.state.playTime | songTimeFormat}}</span>
        <span class="line">/</span>
        <span class="songTime">{{this.$store.state.songTime | songTimeFormat}}</span>


        <!--        <span @click="handler($event)" id="icon-jindu">-->
        <!--&lt;!&ndash;           <i id="i1"></i>&ndash;&gt;-->

        <!--        </span>-->
        <span v-if="this.$store.state.banVolume" @click="handler2" id="volume" class="el-icon-microphone"></span>
        <span v-else id="volume2" @click="handler2" class="el-icon-turn-off-microphone"></span>


        <el-tooltip class="item" effect="dark" content="播放列表" placement="top">
          <span @click="handlerList" class="el-icon-postcard list"></span>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="歌词" placement="top">
          <span @click="handlerList2" class="el-icon-sort list2"></span>
        </el-tooltip>
      </div>

      <audio id="audio1" src=""></audio>
    </div>

    <a v-if="flag ? 'vo':''" class="mao" href="#app">
      <div><span class="el-icon-arrow-up"></span></div>
      <div>TOP</div>
    </a>

    <div class="footer">
      <div class="foot-content">
        <div class="left">
          <div class="first">
            <span>服务条款</span>
            <span>|</span>
            <span>隐私政策</span>
            <span>|</span>
            <span>儿童隐私政策</span>
            <span>|</span>
            <span>版权指引</span>
            <span>|</span>
            <span>意见反馈</span>
            <span>|</span>
          </div>
          <div class="div2">
            <span>重庆科技学院版权所有@1980</span>
            <span>重庆科技学院版权所有@1980</span>
          </div>
          <div>
            <span>违法和不良信息举报电话:15151515</span>
            <span>违法和不良信息举报电话:15151515</span>
          </div>
          <div>
            <span>渝B2222222222</span>
            <span>重庆科技学院计算机科学与技术</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span class="el-icon-circle-check"></span>
            <div class="box">版权所有</div>
          </div>
          <div>
            <span class="el-icon-video-play"></span>
            <div class="box">播放音乐</div>
          </div>
          <div>
            <span class="el-icon-loading"></span>
            <div class="box">快速播放</div>
          </div>
          <div>
            <span class="el-icon-table-lamp"></span>
            <div class="box">高歌猛进</div>
          </div>
          <div>
            <span class="el-icon-turn-off"></span>
            <div class="box">自由开发</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import debounce from "lodash.debounce"
  import navBar from "./components/navBar";
  export default {
    components: {
      navBar,
    },
    data() {
      return {
        wordsShow: true,
        isLock: false,
        vo: true,
        list: true,
        speed: 0,
        flag: false,
        playTime: 0,
        words: '',
        lyricsObjArr: ['2222'],
      }
    },
    mounted() {
      window.addEventListener('mousewheel', debounce(this.scroll2), false)
    },
    computed: {
      flagIndex: {
        get() {
          return this.$store.state.flagIndex
        },
        set(v) {
          this.$store.commit('setFlagIndex',v)
        }
      },
      wordStr: {
        get() {
          return this.$store.state.words
        },
        set(v) {
          this.$store.commit('setWords',v)
        }
      },
      value: {
        get() {
          return this.$store.state.jinduValue
        },
        set(v) {
          this.$store.commit('setJinduValue', v)
        }
      },
      volume: {
        get() {
          return this.$store.state.volume
        },
        set(v) {
          this.$store.commit('setVolume', v)
        }
      },
      select: {
        get() {
          return this.$store.state.selected
        },
        set(v) {
          this.$store.commit('setSelected', v)
        }
      }
    },
    methods: {
      formatLyricTime (time) { // 格式化歌词的时间 转换成 sss:ms
        const regMin = /.*:/
        const regSec = /:.*\./
        const regMs = /\./
        const min = parseInt(time.match(regMin)[0].slice(0, 2))
        let sec = parseInt(time.match(regSec)[0].slice(1, 3))
        const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
        if (min !== 0) {
          sec += min * 60
        }
        return Number(sec + '.' + ms)
      },
      getWord(i) {
        this.lyricsObjArr = []
        this.$store.commit('setWords',null)
        this.$http.get('/lyric?id=' + i).then( res => {
          const data = res.data.lrc
          const arr = data.lyric.split('\n')
          const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
          arr.forEach(item => {
            if (item === '') return
            const obj = {}
            const time = item.match(regTime)
            obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
            obj.time = time ? this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
            obj.uid = Math.random().toString().slice(-6)
            if (obj.lyric === '') {
              obj.lyric = '没有歌词'
              this.lyricsObjArr.push(obj)
            } else {
              this.lyricsObjArr.push(obj)
            }
          })
          this.$store.commit('setWords',this.lyricsObjArr)
        })
      },
      changeWordShow() {
        this.wordsShow = false
      },
      scroll2(e) {
        if (e.pageY < 500) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      delall() {
        this.$store.commit('setList', [])
        const audio = document.getElementById('audio1')
        audio.setAttribute('src', '')
        this.$store.commit('setIndex', 0)
        this.$store.commit('setSelected', 0)
        this.$store.commit('setJinduValue', 0)
        this.$store.commit('setPlayTime', 0)
        this.$store.commit('setJinduValue', 0)
      },
      del(index) {
        let arr = this.$store.state.list
        const falg = this.$store.state.isPlay

        arr.splice(index, 1)
        this.$store.commit('setList', arr)
        if (index === this.$store.state.index) {
          if (this.$store.state.index < this.$store.state.list.length) {
            if (falg === true) {
              this.$store.commit('setIndex', index)
              this.$store.commit('setSelected', index)
              this.play2()
            } else {
              this.$store.commit('setIndex', index)
              this.$store.commit('setSelected', index)
            }

          } else {
            index = index - 1
            if (index < 0) {
              const audio = document.getElementById('audio1')
              audio.setAttribute('src', '')
              this.$store.commit('setIndex', 0)
              this.$store.commit('setSelected', 0)
              this.$store.commit('setJinduValue', 0)
              this.$store.commit('setPlayTime', 0)
              this.$store.commit('setJinduValue', 0)
            } else {
              if (falg === true) {
                this.$store.commit('setIndex', index)
                this.$store.commit('setSelected', index)
                this.play2()
              } else {
                this.$store.commit('setIndex', index)
                this.$store.commit('setSelected', index)
              }

            }

          }
        }

      },
      play2() {
        this.$store.commit('setIsplay', true)
        this.$store.commit('setHeadUrl', this.$store.state.list[this.$store.state.index].al.picUrl)
        this.$store.commit('setheadname', this.$store.state.list[this.$store.state.index].name)
        this.$store.commit('setheadsonger', this.$store.state.list[this.$store.state.index].ar[0].name)
        this.$store.commit('setJinduValue', 0)
        this.$store.commit('setPlayTime', 0)
        this.$store.commit('setJinduValue', 0)
        this.speed = 0
        clearInterval(this.$store.state.timer)
        this.$store.commit('setIsplay', true)
        this.$store.commit('setIsView', false)
        if (!this.$store.state.isLock) {
          setTimeout(() => {
            this.$store.commit('setIsView', true)
          }, 3000)
        }
        this.getWord(this.$store.state.list[this.$store.state.index].id)
        this.$http.get('/song/url?id=' + this.$store.state.list[this.$store.state.index].id).then(res2 => {
          if (res2.data.code === 200) {

            this.url = res2.data.data[0].url
            const audio = document.getElementById('audio1')
            audio.setAttribute('src', this.url)
            //重新加载
            audio.load()
            //返回当前音频的总长
            audio.oncanplay = () => {
              this.$store.commit('setSongTime', audio.duration)
              audio.play()
              audio.ontimeupdate = () => {
                if(this.wordStr) {
                  for(let i = 0; i < this.wordStr.length; i++) {
                    if(audio.currentTime > (parseInt(this.wordStr[i].time))) {
                      this.$store.commit('setFlagIndex',i)
                    }
                  }
                }
              }
              this.$store.commit('setVolume', audio.volume * 100)
              this.speed = (100 / Math.ceil(this.$store.state.songTime))
              this.speed = this.speed.toFixed(2)
              this.$store.commit('setTimer', setInterval(() => {
                if (audio.paused) {
                  this.$store.commit('setIsplay', false)
                  return
                }
                this.$store.commit('setJinduValue', this.speed * (audio.currentTime + 1))
                this.$store.commit('setPlayTime', audio.currentTime + 1)
                if (this.$store.state.playTime >= this.$store.state.songTime) {
                  this.$store.commit('setIndex', this.$store.state.index + 1)
                  setTimeout(() => {
                    this.$store.commit('setSelected', this.$store.state.selected + 1)
                    this.$store.commit('setIsplay', true)
                    this.$store.commit('setHeadUrl', this.$store.state.list[this.$store.state.index].al.picUrl)
                    this.$store.commit('setheadname', this.$store.state.list[this.$store.state.index].name)
                    this.$store.commit('setheadsonger', this.$store.state.list[this.$store.state.index].ar[0].name)
                    this.play2()
                  }, 2000)
                }
              }, 1000))

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
      clickPlay(id) {
        this.getWord(id)
        this.$store.state.list.forEach((item, index) => {
          if (item.id === id) {
            this.$store.commit('setIndex', index)
            this.$store.commit('setSelected', index)
          }
        })
        this.$store.commit('setIsplay', true)
        this.$store.commit('setHeadUrl', this.$store.state.list[this.$store.state.index].al.picUrl)
        this.$store.commit('setheadname', this.$store.state.list[this.$store.state.index].name)
        this.$store.commit('setheadsonger', this.$store.state.list[this.$store.state.index].ar[0].name)
        this.$store.commit('setJinduValue', 0)
        this.$store.commit('setPlayTime', 0)
        this.$store.commit('setJinduValue', 0)
        this.speed = 0
        clearInterval(this.$store.state.timer)
        this.$store.commit('setIsplay', true)
        this.$store.commit('setIsView', false)
        if (!this.$store.state.isLock) {
          setTimeout(() => {
            this.$store.commit('setIsView', true)
          }, 3000)
        }
        this.$http.get('/song/url?id=' + id).then(res2 => {
          if (res2.data.code === 200) {

            this.url = res2.data.data[0].url
            const audio = document.getElementById('audio1')
            audio.setAttribute('src', this.url)
            //重新加载
            audio.load()
            //返回当前音频的总长
            audio.oncanplay = () => {
              this.$store.commit('setSongTime', audio.duration)
              audio.play()
              audio.ontimeupdate = () => {
             if(this.wordStr !== null) {
               for(let i = 0; i < this.wordStr.length; i++) {
                 if(audio.currentTime > (parseInt(this.wordStr[i].time))) {
                   this.$store.commit('setFlagIndex',i)
                 }
               }
             }
              }
              this.$store.commit('setVolume', audio.volume * 100)
              this.speed = (100 / Math.ceil(this.$store.state.songTime))
              this.speed = this.speed.toFixed(2)
              this.$store.commit('setTimer', setInterval(() => {
                if (audio.paused) {
                  this.$store.commit('setIsplay', false)
                  return
                }
                this.$store.commit('setJinduValue', this.speed * (audio.currentTime + 1))
                this.$store.commit('setPlayTime', audio.currentTime + 1)
                if (this.$store.state.playTime >= this.$store.state.songTime) {
                  if (this.$store.state.index + 1 < this.$store.state.list.length) {
                    this.$store.commit('setIndex', this.$store.state.index + 1)

                    setTimeout(() => {
                      this.$store.commit('setSelected', this.$store.state.selected + 1)
                      this.$store.commit('setIsplay', true)
                      this.$store.commit('setHeadUrl', this.$store.state.list[this.$store.state.index].al.picUrl)
                      this.$store.commit('setheadname', this.$store.state.list[this.$store.state.index].name)
                      this.$store.commit('setheadsonger', this.$store.state.list[this.$store.state.index].ar[0].name)
                      this.play2()
                    }, 2000)
                  }
                }
              }, 1000))

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
      next() {
        if (this.$store.state.index + 1 < this.$store.state.list.length) {
          this.$store.commit('setIndex', this.$store.state.index + 1)
          this.$store.commit('setSelected', this.$store.state.selected + 1)
          this.play2()
        } else {
          this.$message({
            type: 'error',
            center: true,
            offset: 200,
            message: '已经是最后一首'
          })
        }
      },
      prev() {
        if (this.$store.state.index - 1 >= 0) {
          this.$store.commit('setIndex', this.$store.state.index - 1)
          this.$store.commit('setSelected', this.$store.state.selected - 1)
          this.play2()
        } else {
          this.$message({
            type: 'error',
            center: true,
            offset: 200,
            message: '已经是第一首'
          })
        }

      },
      handlerList2() {
        this.wordsShow = !this.wordsShow
      },
      handlerList() {
        this.list = !this.list
      },
      changeVolume() {
        if (this.volume === 0) {
          this.$store.commit('setBanVolume', false)
        } else {
          this.$store.commit('setBanVolume', true)
        }
        const audio = document.getElementById('audio1')
        audio.volume = this.volume / 100

      },
      sliderChange() {
        if (this.$store.state.songTime != 0) {
          clearInterval(this.$store.state.timer)
          const audio = document.getElementById('audio1')
          let speed = (100 / this.$store.state.songTime)
          speed = speed.toFixed(2)
          const time = (this.$store.state.jinduValue / speed)
          audio.currentTime = time
          this.$store.commit('setIsplay', true)
          this.$store.commit('setPlayTime', time)
        }

      },
      // redClick2(e){
      //   const red = document.getElementById('red-line')
      //   const h = Number(red.style.height.split('p')[0]) - e.offsetY
      //   const audio = document.getElementById('audio1')
      //   if(h >= 5){
      //     red.style.height = h + 'px'
      //   }
      //
      //  if(h <= 90 && h >=9){
      //    const volume = h / 90
      //    audio.volume = volume
      //    this.$store.commit('setVolume',audio.volume)
      //  }
      // },
      // redClick(e){
      //   const h = 90 - e.offsetY
      //   const red = document.getElementById('red-line')
      //   if(h <= 90){
      //     red.style.height = h + 'px'
      //   }
      //   const audio = document.getElementById('audio1')
      //   if(h <= 90 && h >= 9){
      //     const volume = h / 90
      //     audio.volume = volume
      //     this.$store.commit('setVolume',audio.volume)
      //   }
      // },
      handler2() {
        this.vo = !this.vo
      },
      // handler(e) {
      //   if(this.$store.state.songTime != 0){
      //     clearInterval(this.$store.state.timer)
      //     const jindu = document.getElementById('icon-jindu')
      //     this.$store.commit('setIsplay',true)
      //     jindu.style.paddingLeft = e.offsetX + 'px'
      //     const audio = document.getElementById('audio1')
      //     const speed = Math.round(400 / Math.round(this.$store.state.songTime))
      //     const time = Math.round(e.offsetX / speed)
      //     audio.currentTime = time
      //     this.$store.commit('setPlayTime',time)
      //   }
      // },
      changeLock() {
        this.$store.commit('setLock')
        this.isLock = !this.isLock
        if (this.isLock == true) {
          this.$store.state.isView = false
        } else {
          this.$store.state.isView = true
        }
      },
      play() {
        this.$store.commit('setIsplay', false)
        const audio = document.getElementById('audio1')
        audio.pause()

      },
      pause() {
        this.$store.commit('setIsplay', true)
        const audio = document.getElementById('audio1')
        audio.play()

      }
    },
    created() {
      const index = this.$store.state.navIndex
      if (index == null) {
        this.$store.commit('setNavIndex', 0)
      }
      if (index == 0) {
        this.$router.push('/home')
        this.$store.commit('setNavIndex', 0)
      }
      if (index == 1) {
        this.$router.push('/rank')
        this.$store.commit('setNavIndex', 1)
      }
      if (index == 2) {
        this.$router.push('/songSheet/' + '全部')
        this.$store.commit('setNavIndex', 2)
      }
      if (index == 3) {
        this.$router.push('/songer')
        this.$store.commit('setNavIndex', 3)
      }
      if (index == 4) {
        this.$router.push('/mysong')
        this.$store.commit('setNavIndex', 4)
      }


    }
  }
</script>


<style lang="less">


  .el-slider__bar {
    background-color: red !important;
  }

  * {

    margin: 0;
    padding: 0;
  }

  table, th, tr, td {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  #app {

    .words {
      width: 60vw;
      height: 50px;
      bottom: 100px;
      left: 20vw;
      border-radius: 10px;
      background-color: #1b1a19;
      position: fixed;
      opacity: 0.3;
      z-index: 99999;
      overflow: hidden;
      .icon1 {
        font-size: 15px;
        opacity: 1;
        color: #FFFFFF;
        position: absolute;
        right: 10px;
        z-index: 999999999;
        cursor: pointer;
        top: 5px;
      }
      .colorActive {
        color: yellow;
      }
      .father {
        width: 100%;
        height: 100%;
      }
      .words-item {
        height: 25%;
        width: 70%;
        color: #FFFFFF;
        text-align: center;
        margin-left: 7.5vw;
        margin-top: 2vh;
      }
    }


    .footer {
      height: 170px;
      padding-top: 20px;
      background-color: #f5f5f5;
      border-top: 1px solid #8e8e8e;

      .foot-content {

        display: flex;
        width: 1100px;
        height: 170px;
        margin-left: 220px;
        .left {
          flex: 1;
          div{
            margin-top: 10px;
          }
          span {
            font-size: 13px;
            color: #8e8e8e;
            margin-left: 18px;
          }

        }
        .right {
          margin-top: 30px;
          display: flex;
          flex: 1;
          div {
            .box {
              width: 60px;
              color: #8c939d;
              margin-top: 10px;
              font-size: 13px;
              transform: translateX(-20px);
            }

          }
          div {
            margin-left: 30px;
          }
          span {
            font-size: 60px;
            color: #cccccc;
          }
        }
      }

    }

    .mao {
      text-decoration: none;
      background-color: #f4f4f4;
      border: 1px solid #cccccc;
      padding: 5px;
      border-radius: 5px;
      position: fixed;
      z-index: 200;
      top: 550px;
      text-align: center;
      left: 1320px;
      font-size: 12px;
    }

    .mao:hover {
      background-color: #ededed;
    }

    min-width: 1200px;


  }

  #audio-play:hover {
    height: 53px !important;
  }

  #audio-play {

    opacity: 0.9;
    position: fixed;
    bottom: 0;
    color: #ffffff;
    z-index: 999999999999;
    width: 100%;
    height: 53px;
    background-color: #323232;
    transition: all 0.5s;
    box-shadow: 0 0 8px #acacac;

    #div-volume {
      width: 30px;
      height: 120px;
      z-index: 1000;
      background-color: #242424;
      left: 923px;
      bottom: 53px;
      border-radius: 5px 5px 0 0;
      position: absolute;

      .el-slider-2 {
        height: 10px;
        position: absolute;
        top: 20px;
        left: -3px;
      }

    }

    #play-list {
      border-radius: 5px;
      box-shadow: 0 0 5px #717171;
      height: 300px;
      width: 500px;
      opacity: .9;
      background-color: #1b1a19;
      position: absolute;
      z-index: 2000;
      top: -300px;
      left: 900px;

      .list-title {
        .count {
          margin-left: 20px;
        }

        .el-icon-delete {
          transform: translateX(300px);

          .delete {
            color: #9999a6;
            margin-left: 5px;
            font-size: 13px;
          }

          .delete:hover {
            color: #f7f7f7;
          }

        }
      }

      .lists::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #717171;
      }

      .lists::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px #9999a6;
        border-radius: 10px;
        background-color: #6e6e6e;
      }

      .lists::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 0px #e4e4e4;
        background-color: #e4e4e4;
      }

      .lists {
        height: 80%;
        width: 95%;
        overflow-y: scroll;

        margin: 0 auto;

        .list-item {
          line-height: 30px;
          margin-top: 2px;

          a {
            color: #9999a6;
          }

          a:hover {
            color: #f7f7f7;
          }

          .flag {
            opacity: 0;
            font-size: 18px;
            transform: translateY(-5px);
            color: red;
          }

          height: 30px;
          width: 100%;
          color: #9999a6;
          font-size: 13px;

          .n {
            transform: translateX(20px);
            width: 150px;
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .s {
            margin-left: 70px;
            display: inline-block;
            width: 80px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .t {
            display: inline-block;
            width: 40px;
            margin-right: 20px;
            transform: translateY(-8px);
          }

          .d {
            transform: translateY(-8px);
          }

          .d:hover {
            color: #f7f7f7;
            font-size: 14px;
          }

        }

        .list-item:hover {
          background-color: black;
          cursor: pointer;
          color: #f7f7f7;
        }
      }
    }

    .dis {
      background-color: black;

      span {
        color: #f7f7f7;

        a {
          color: #f7f7f7;
        }

      }

      a {
        color: #f7f7f7;
      }

    }


    .vo {
      display: none;
    }

    .vo2 {
      opacity: 1 !important;
    }

    .play-content {
      width: 1080px;
      margin: 0 auto;
      height: 53px;
      line-height: 53px;

      span {
        margin-right: 10px;
      }

      span:hover {
        color: #ffffff;
        cursor: pointer;
      }

      .prev {
        border-radius: 50%;
        padding: 1px;
        font-size: 15px;
        border: 2px solid #acacac;
        color: #acacac;
        position: absolute;
        top: 15px;
        left: 220px;

      }

      .play {
        position: absolute;
        top: 8px;
        left: 253px;
        color: #e4e4e4;
        font-size: 35px;
      }

      .pause {
        position: absolute;
        top: 8px;
        left: 253px;
        color: #e4e4e4;
        font-size: 35px;
      }

      .next {
        position: absolute;
        top: 15px;
        left: 300px;
        border-radius: 50%;
        padding: 1px;
        border: 2px solid #acacac;
        color: #acacac;
        font-size: 15px;
      }

      .lock {
        border-radius: 5px;
        display: inline-block;
        top: -20px;
        left: 1440px;
        z-index: 2000;
        position: absolute;

        height: 80px;
        width: 50px;
        background-color: #323232;
        color: #9999a6;

        i {
          font-size: 16px;
          transform: translateY(-90%) translateX(100%);
        }
      }

      .pic {
        position: absolute;
        top: 10px;
        left: 360px;

        img {
          width: 35px;
          height: 35px;
        }
      }

      .name {
        position: absolute;
        top: -15px;
        left: 420px;
        width: 120px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 12px;

        a {
          color: #ffffff;
        }
      }

      .songer {
        position: absolute;
        top: -15px;
        right: -20px;
        left: 550px;
        font-size: 12px;

        a {
          color: #9999a6;
        }

      }


      .el-slider-1 {

        position: absolute;
        z-index: 3000;
        top: 17px;
        left: 415px;
        width: 400px;

      }

      #icon-jindu {
        display: inline-block;
        position: absolute;
        width: 0px;
        height: 9px;
        left: 415px;
        top: 28px;
        transform: none;
        background-color: #C10D0C;
        border-radius: 5px;

        i {
          position: relative;
          display: inline-block;
          width: 5px;
          height: 5px;
          transform: translateY(-21px) translateX(-2px);
          border: 5px solid #ffffff;
          border-radius: 50%;
          background-color: #C10D0C;
        }
      }

      #volume {
        color: #8e8e8e;
        position: absolute;
        left: 930px;
        top: 18px;
        font-size: 17px;
        z-index: 2000;
      }

      #volume:hover {
        color: #d3d3d3;
      }

      #volume2:hover {
        color: #d3d3d3;
      }

      #volume2 {
        color: #8e8e8e;
        position: absolute;
        left: 930px;
        top: 18px;
        z-index: 2000;
        font-size: 17px;
      }

      .list {
        position: absolute;
        color: #9999a6;
        font-size: 20px;
        left: 960px;
        top: 15px;
      }
      .list2 {
        position: absolute;
        color: #9999a6;
        font-size: 20px;
        left: 1000px;
        top: 15px;
      }


      .line {
        position: absolute;
        top: 0px;
        left: 860px;
        color: #717171;
        font-size: 12px;
      }

      .playTime {
        font-size: 12px;
        position: absolute;
        top: 0px;
        left: 827px;
        color: #9999a6;
      }

      .songTime {
        font-size: 12px;
        position: absolute;
        top: 0px;
        left: 867px;
        color: #717171;
      }

    }


  }

  .view {
    height: 3px !important;
  }


</style>
