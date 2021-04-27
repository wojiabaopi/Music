<template>
 <div v-loading="loading" class="hot">
     <div class="content-left">
       <div class="title">
         <span class="icon"></span>
         <span class="span2">热门推荐</span>
         <span @click="goDetail(index)" :key="index" v-for="(item,index) in catelist">
           <span  class="span3"><a href="javascript:;">{{item}}</a></span>
           <span class="Yx"></span>
         </span>

         <span @click="goDetail(-1)" class="span3 spanLast"><a href="javascript:;">更多 <i class="el-icon-d-arrow-right"></i> </a></span>
       </div>
       <div class="info">
         <div @click="goSheetDetail(item.id)" v-for="(item,index) in hotList" :key="index" class="info-item">
           <div  class="info-img">
             <img :src="item.picUrl" alt="">
             <div class="iconpaly">
               <span class="headset el-icon-headset"> <span>{{item.playCount|headFormat}}</span></span>
               <span @click.stop="toto(item.id)" class="play el-icon-video-play"></span>
             </div>
           </div>

           <div class="info-name">
             <a href="javascript:;">{{item.name}}</a>
           </div>
         </div>
       </div>



       <div style="margin-top: 50px" class="title">
         <span class="icon"></span>
         <span class="span2">新碟上架</span>
       </div>
       <span  @click="left" class="el-icon-arrow-left left"></span>
       <span  @click="right" class="el-icon-arrow-right right"></span>
       <div class="new-songs">

         <div class="song-item"  v-for="(item,index) in albums" :key="index">
           <div class="bg"></div>
           <img @click="goAlbum(item.id)" :src="item.picUrl" alt="">
           <div @click="newPlay(item.id)" class="new-play" > <span class="el-icon-video-play"></span></div>
           <div @click="goAlbum(item.id)"><a href="javascript:;">{{item.name}}</a></div>
           <div><a href="javascript:;">{{item.artist.name}}</a></div>
         </div>

       </div>


       <div style="margin-top: 220px" class="title">
         <span class="icon"></span>
         <span class="span2">榜单</span>
       </div>
       <div class="toplist">
         <div class="toplist-item" v-for="(item,index) in topList" :key="index">
          <div class="item">
            <div @click="goRank(index)" class="item-left">
              <img :src="item.coverImgUrl" alt="">
            </div>
            <div class="item-right">
              <div class="right-top">
                <h3>{{item.name}}</h3>

              </div>
              <div class="right-bottom">
                <span @click="toto(topList[index].id)" class="el-icon-video-play"></span>
              </div>
            </div>
          </div>

         </div>
         <div class="l">
           <div class="item2"  >
             <div v-for="(item1,index1) in list1" :key="index1" >
               <div id="div1"><span @click="to1(item1.id,0)" class="span1 el-icon-video-play"></span></div>
               <span :class="index1%2===0?'bg':''" class="s1">{{index1+1}}</span>
               <span :class="index1%2===0?'bg':''" class="s2"><a href="javascript:;">{{item1.al.name}}</a></span>

             </div>
             <div @click="goRank(0)" class="ib"><a href="javascript:;">查看全部></a></div>
           </div>
           <div class="item2" >
             <div v-for="(item2,index2) in list2" :key="index2" >
               <div id="div2"><span @click="to1(item2.id,1)" class="span2 el-icon-video-play"></span></div>
               <span :class="index2%2===0?'bg':''" class="s1">{{index2+1}}</span>
               <span :class="index2%2===0?'bg':''" class="s2 "><a href="javascript:;">{{item2.al.name}}</a></span>
             </div>
             <div @click="goRank(1)" class="ib"><a href="javascript:;">查看全部></a></div>
           </div>
           <div class="item2" >
             <div v-for="(item3,index3) in list3" :key="index3" >
               <div id="div3"><span @click="to1(item3.id,2)" class="span3 el-icon-video-play"></span></div>
               <span :class="index3%2===0?'bg':''" class="s1">{{index3+1}}</span>
               <span :class="index3%2===0?'bg':''" class="s2"><a href="javascript:;">{{item3.al.name}}</a></span>
             </div>
             <div @click="goRank(2)" class="ib"><a href="javascript:;">查看全部></a></div>
           </div>
         </div>
       </div>





     </div>


   <div class="content-right">
     <div class="div1">
       <p>登录午夜神话音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
       <button @click="loginVis = true">用户登录</button>
     </div>
     <div class="hotSonger">
       <div class="song-title">
         <span class="s1">热门歌手</span>
         <span @click="toSonger" class="s2"><a href="javascript:;">查看全部></a></span>
       </div>
       <div @click="goSongerDetail(item.id)" class="songer-item" v-for="(item,index) in songerDetail" :key="index">
         <div class="right">
           <img :src="item.cover" alt="">
         </div>
         <div class="left">
           <div class="songer-name">{{item.name}}</div>
           <div class="songer-detail">{{item.briefDesc}}</div>
         </div>
       </div>
     </div>
   </div>


 </div>
</template>

<script>
export default {
  name: "hot",
  data() {
    return {
      hotList: [],
      catelist: ['华语','流行','摇滚','民谣','电子'],
      url: '',
      tracks: [],
      loading: true,
      jindu: {},
      speed: 0,
      albums: [],
      flag: true,
      topList: [],
      list1: [],
      list2: [],
      list3: [],
      hotSonger: [],
      songerDetail: [],
      tracks2: [],
      lyricsObjArr: []
    }
  },
  computed: {
    wordStr: {
      get() {
        return this.$store.state.words
      },
      set(v) {
        this.$store.commit('setWords',v)
      }
    },
    loginVis: {
      get(){
        return this.$store.state.loginVis
      },
      set(v){
        this.$store.commit('setLoginVis',v)
      }
    },
  },
  created() {
    this.getHotList()
    this.getNewSongs()
    this.getTopList()
    this.getHotSonger()
    // this.gethot()
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
    goSongerDetail(id) {
      this.$store.commit('setSongerId',id)
      this.$router.push('/songerDetail/' + id)
    },
    toSonger() {
      this.$router.push('/songer')
      sessionStorage.setItem('songerIndex',0)
      this.$store.commit('setNavIndex',3)
    },
    goRank(index){
      this.$router.push('/rank/crank/'+this.topList[index].id)
      sessionStorage.setItem('rankIndex',index)
      sessionStorage.setItem('rankId',this.topList[index].id)
      this.$store.commit('setNavIndex',1)
    },
    newPlay(id) {
      this.$http.get('/album?id='+id).then( res => {
        if( res.data.code === 200) {
          if(res.data.songs[0].rurl != null){
            this.tracks2 = res.data.songs
            this.$store.commit('setList',this.tracks2)
            this.$store.commit('setHeadUrl',this.$store.state.list[this.$store.state.index].al.picUrl)
            this.$store.commit('setheadname',this.$store.state.list[this.$store.state.index].name)
            this.$store.commit('setheadsonger',this.$store.state.list[this.$store.state.index].ar[0].name)

            this.$store.commit('setJinduValue',0)
            this.$store.commit('setPlayTime',0)
            this.$store.commit('setJinduValue',0)
            this.$store.commit('setIndex',0)
            this.$store.commit('setSelected',0)
            this.play()
          } else {
            this.$message({
              type: 'error',
              center: true,
              offset: 200,
              message: '没有播放权限'
            })
          }
        } else {
          this.$message({
            type: 'error',
            center: true,
            offset: 200,
            message: '新碟歌曲获取失败'
          })
        }
      })
    },
    to1(id,i){
      this.flag = true
      // if(this.$store.state.list.length === 0){
      //   this.$store.commit('setList',this.tracks)
      // }

      this.$store.commit('setJinduValue',0)
      this.$store.commit('setSongTime',0)
      this.$store.commit('setPlayTime',0)
      this.speed = 0
      this.$store.commit('setJinduValue',0)
      clearInterval(this.$store.state.timer)
      this.tracks[i].forEach( (item,index) => {
        if(item.id === id){
          if(this.$store.state.list.length !=0){
            this.$store.state.list.forEach( (item2,index2) => {
              if(item.id === item2.id){
                this.$store.commit('setSelected',index2)
                this.$store.commit('setIndex',index2)
                this.flag = false
              }
            })
          }
          this.mark = index
          this.$store.commit('setHeadUrl',item.al.picUrl)
          this.$store.commit('setheadname',item.name)
          this.$store.commit('setheadsonger',item.ar[0].name)
          return
        }
      })

      if(this.flag){
        if(this.$store.state.list.length != 0){
          this.$store.state.list.forEach( (item,index)=> {
            if(this.tracks[i][this.mark].id === item.id){
              this.$store.commit('setSelected',index)
              this.$store.commit('setIndex',index)
              this.flag = false
              return
            }
          })
        }
        if(this.flag){
          let c = this.tracks[i][this.mark]
          let a = this.$store.state.list.push(c)
          this.$store.commit('setSelected',a-1)
          this.$store.commit('setIndex',a-1)
        }
      }

      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsView',false)
      if(!this.$store.state.isLock){
        setTimeout( () => {
          this.$store.commit('setIsView',true)
        },3000)
      }
      this.getWord(id)
      this.$http.get('/song/url?id='+id).then( res => {
        if(res.data.code == 200){
          this.url = res.data.data[0].url
          const audio = document.getElementById('audio1')
          audio.setAttribute('src',this.url)
          audio.load()
          audio.oncanplay = () => {
            this.$store.commit('setSongTime',audio.duration)
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
            this.$store.commit('setVolume',audio.volume*100)
            this.speed = (100 / Math.ceil(this.$store.state.songTime))
            this.speed = this.speed.toFixed(2)
            this.$store.commit('setTimer',setInterval( () => {
              if(audio.paused){
                this.$store.commit('setIsplay',false)
                return
              }
              if(audio.ended) {
                this.$store.commit('setJinduValue',0)
                clearInterval(this.$store.state.timer)
              }
              this.$store.commit('setJinduValue',this.speed*(audio.currentTime+1))
              this.$store.commit('setPlayTime',audio.currentTime+1)
              if(this.$store.state.playTime >= this.$store.state.songTime){
                if(this.$store.state.index+1 < this.$store.state.list.length){
                  this.$store.commit('setIndex',this.$store.state.index+1)

                  setTimeout(()=> {
                    this.$store.commit('setSelected',this.$store.state.selected+1)
                    this.$store.commit('setIsplay',true)
                    this.$store.commit('setHeadUrl',this.$store.state.list[this.$store.state.index].al.picUrl)
                    this.$store.commit('setheadname',this.$store.state.list[this.$store.state.index].name)
                    this.$store.commit('setheadsonger',this.$store.state.list[this.$store.state.index].ar[0].name)
                    this.play()
                  },2000)
                }
              }

            },1000))

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

    goAlbum(id){
      this.$router.push('/album/'+id)
    },
    getHotSonger(){
      this.$http.get('/top/artists?offset=0&limit=13').then( res => {

        if(res.data.code === 200){
          this.hotSonger = res.data.artists
          this.hotSonger.forEach( item => {
            this.$http.get('/artist/detail?id=' + item.id).then( res => {

              if(res.data.code === 200) {
                this.songerDetail.push(res.data.data.artist)
              } else {
                this.$message({
                  message: '获取歌手失败',
                  type: 'error',
                  center: true,
                  offset: 200
                })
              }
            })
          })
        } else {
          this.$message({
            message: '获取歌手失败',
            type: 'error',
            center: true,
            offset: 200
          })
        }
      })
    },
    getTopList(){
      this.$http.get('/toplist').then( res => {
        if(res.data.code === 200){
          this.topList = res.data.list.slice(0,3)
          this.$http.get('/playlist/detail?id='+this.topList[0].id).then( res => {
            this.list1 = res.data.playlist.tracks.slice(0,10)
            this.tracks[0] = this.list1

          })
          this.$http.get('/playlist/detail?id='+this.topList[1].id).then( res => {

            this.list2 = res.data.playlist.tracks.slice(0,10)
            this.tracks[1] = this.list2

          })
          this.$http.get('/playlist/detail?id='+this.topList[2].id).then( res => {

            this.list3 = res.data.playlist.tracks.slice(0,10)
            this.tracks[2] = this.list3


          })


        } else {
          this.$message({
            type: 'error',
            center: true,
            offset: 200,
            message: '榜单数据请求失败'
          })
        }
      })
    },
    play(){
      this.$store.commit('setJinduValue',0)
      this.$store.commit('setPlayTime',0)
      this.$store.commit('setJinduValue',0)
      this.speed = 0
      clearInterval(this.$store.state.timer)
      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsView',false)
      if(!this.$store.state.isLock){
        setTimeout( () => {
          this.$store.commit('setIsView',true)
        },3000)
      }
      this.getWord(this.$store.state.list[this.$store.state.index].id)
      this.$http.get('/song/url?id='+this.$store.state.list[this.$store.state.index].id).then( res2 => {
        if(res2.data.code == 200){
          this.url = res2.data.data[0].url
          const audio = document.getElementById('audio1')
          audio.setAttribute('src',this.url)
          //重新加载
          audio.load()
          //返回当前音频的总长
          audio.oncanplay = () => {
            this.$store.commit('setSongTime',audio.duration)
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
            this.$store.commit('setVolume',audio.volume*100)
            this.speed = (100 / Math.ceil(this.$store.state.songTime))
            this.speed = this.speed.toFixed(2)
            this.$store.commit('setTimer',setInterval( () => {
              if(audio.paused){
                this.$store.commit('setIsplay',false)
                return
              }
              this.$store.commit('setJinduValue',this.speed*(audio.currentTime+1))
              this.$store.commit('setPlayTime',audio.currentTime+1)
              if(this.$store.state.playTime >= this.$store.state.songTime){
               if(this.$store.state.index+1 < this.$store.state.list.length){
                 this.$store.commit('setIndex',this.$store.state.index+1)

                 setTimeout(()=> {
                   this.$store.commit('setSelected',this.$store.state.selected+1)
                   this.$store.commit('setIsplay',true)
                   this.$store.commit('setHeadUrl',this.$store.state.list[this.$store.state.index].al.picUrl)
                   this.$store.commit('setheadname',this.$store.state.list[this.$store.state.index].name)
                   this.$store.commit('setheadsonger',this.$store.state.list[this.$store.state.index].ar[0].name)
                   this.play()
                 },2000)
               }
              }
            },1000))

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
    left(){
      const item = document.getElementsByClassName('song-item')

      if(this.flag){
        for (let i = 0; i < 5; i++){
          item[i].style.display = 'none'
        }
        for(let i = 5; i < 10; i++){
          item[i].style.display = 'block'
        }
        this.flag = false
      } else {
        for (let i = 5; i < 10; i++){
          item[i].style.display = 'none'
        }
        for(let i = 0; i < 5; i++){
          item[i].style.display = 'block'
        }
        this.flag = true
      }

     },
    right(){
      const item = document.getElementsByClassName('song-item')
      if(this.flag){
        for (let i = 0; i < 5; i++){
          item[i].style.display = 'none'
        }
        for(let i = 5; i < 10; i++){
          item[i].style.display = 'block'
        }
        this.flag = false
      } else {
        for (let i = 5; i < 10; i++){
          item[i].style.display = 'none'
        }
        for(let i = 0; i < 5; i++){
          item[i].style.display = 'block'
        }
        this.flag = true
      }
    },
    getNewSongs() {
      this.$http.get('/album/newest').then( res => {
        if(res.data.code === 200){
          this.albums = res.data.albums.splice(0,10)
        } else {
          this.$message({
            type: 'error',
            message: '新碟数据获取失败',
            offset: 200,
            center: true
          })
        }
      })
    },
    toto(id) {
      this.$store.commit('setIndex',0)
      this.$store.commit('setSelected',0)
      this.$store.commit('setJinduValue',0)
      this.$store.commit('setPlayTime',0)
      this.$store.commit('setJinduValue',0)
      this.speed = 0
      clearInterval(this.$store.state.timer)
      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsView',false)
      if(!this.$store.state.isLock){
        setTimeout( () => {
          this.$store.commit('setIsView',true)
        },3000)
      }
      this.$http.get('/playlist/detail?id=' + id).then( res => {
        if(res.data.code === 200){
          this.$store.commit('setList',res.data.playlist.tracks)
          this.$store.commit('setHeadUrl',res.data.playlist.tracks[0].al.picUrl)
          this.$store.commit('setheadname',res.data.playlist.tracks[0].name)
          this.$store.commit('setheadsonger',res.data.playlist.tracks[0].ar[0].name)
          this.play()
        }
      })
    },
    // 获取热门推荐标签
    // gethot() {
    //   this.$http.get('/playlist/hot').then( res => {
    //     if( res.data.code == 200) {
    //       this.hot = res.data.tags
    //       this.$store.commit('sethot')
    //       console.log(this.hot);
    //     } else {
    //       this.$message({
    //         center: true,
    //         message: 'hot数据请求失败',
    //         type: 'error',
    //         offset: 200
    //       })
    //     }
    //   })
    // },
    //获取热门推荐歌单
    getHotList() {
      this.$http.get('/personalized').then( res => {

        if( res.data.code == 200){
          this.loading = false
          this.$store.commit('sethot',res.data.result)
          this.hotList = this.$store.state.hotList.slice(0,8)
        } else {
          this.$message({
            type: 'error',
            message: '热门推荐数据请求失败',
            offset: 200,
            enter: true
          })
        }
      })
    },
    goDetail(index) {
      this.$store.commit('setNavIndex',2)
      switch (index) {
        case -1: this.$router.push('/songSheet/' + '全部'); return;
        case 0: this.$router.push('/songSheet/' + '华语'); return;
        case 1: this.$router.push('/songSheet/' + '流行'); return;
        case 2: this.$router.push('/songSheet/' + '摇滚'); return;
        case 3: this.$router.push('/songSheet/' + '民谣'); return;
        case 4: this.$router.push('/songSheet/' + '电子'); return;
      }
    },
    goSheetDetail(id) {
      this.$router.push('/songSheetDetail/' + id)
    }

  }
}
</script>

<style lang="less" scoped>

  .hot {

    display: flex;
    width: 100%;
    height: 1500px;
    background-color: #f5f5f5;
      .content-left{
        height: 1390px;
        border: 1px solid #acacac;
        background-color: white;
        margin-left: 220px;
        padding-top: 10px;

        width: 750px;
        .title{
          width: 730px;
          border-bottom: 2px solid #C10D0C;
          margin: 10px;
          margin-top: 20px;
          .icon {
            cursor: pointer;
            margin-left: 30px;
            display: inline-block;
            width: 5px;
            height: 5px;
            background-color: #ffffff;
            border: 5px solid #C10D0C;
            border-radius: 50%;
          }
          .span2 {
            cursor: pointer;
            margin-left: 10px;
          }
          .span3 {
            font-size: 12px;
            margin: 0 15px;
            a {
              color: #667e85;
            }
          }
          .Yx {
            display: inline-block;
            width: 15px;
            height: 1.5px;

            transform: translateY(-3px) rotate(90deg);
            background-color: #ccd0d8;
          }
          .spanLast {
            margin-left: 180px;
          }
          height: 40px;
          line-height: 40px;
          font-size: 20px;
          background-color: #ffffff;

        }

        .info {
          display: flex;
          width: 730px;
          height: 400px;
          margin: 0 10px;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          .info-item {

            margin-top: 10px;
            height: 220px;
            margin-bottom: 0px;
            margin-left: 20px;
            flex: 1;
            .info-img {
              position: relative;

              .iconpaly{
                line-height: 25px;
                width: 88%;
                height: 25px;
                background-color: #323232;
                position: absolute;
                margin-left: 10px;
                z-index: 99;
                bottom: 3px;
                color: #e4e4e4;
                opacity: 0.6;
                font-size: 15px;
                .headset {
                  font-size: 14px;
                  position: absolute;
                  left: 10px;
                  top: 5px;
                 span {
                   margin-left: 5px;
                 }
                }
                .play {
                  font-size: 20px;
                  cursor: pointer;
                  color: #acacac;
                  margin-left: 100px;
                }
                .play:hover {
                  color: #ffffff;
                }

              }
              text-align: center;
              img {
                cursor: pointer;
                width: 143px;
                height: 143px;

              }
            }
          }
          .info-name {
            margin-left: 7px;
            a {
              overflow:hidden;
              margin-top: 5px;
              text-overflow:ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              letter-spacing: 1px;
              color: #717171;
              font-size: 14px;
            }
          }
        }

        .new-songs {

          width: 730px;
          margin-left: 10px;
          position: absolute;
          background-color: #f5f5f5;
          display: flex;
          height: 200px;
          justify-content: start;
          align-items: center;
          overflow: hidden;
          .song-item:hover {
            .new-play {
              display: block;
            }
          }
          .song-item {
            position: relative;
            z-index: 10;
            .bg {
              position: absolute;
              width: 90px;
              height: 90px;
              box-shadow: 0 0 10px #8e8e8e;
              background-color: #1b1a19;
              border-radius: 50%;
              z-index: -1;
              top: 40px;
              left: 30px;
            }
            .new-play {
              position: absolute;
              span {
                font-size: 25px;
                color: #cccccc;
                cursor: pointer;
              }
              left: 70px;
              top: 110px;
              display: none;
              z-index: 9999;
            }

            transition: all 1.5s;
            position: relative;

            height: 160px;
            width: 130px;
            flex: 0 0 130px;
            margin: 5px;
            text-align: center;

            img {
              box-shadow: 0 2px 3px #9999a6;
              border: 2px solid #9999a6;
              padding: 5px;
              margin: 15px;
              width: 100px;
              height: 100px;
              cursor: pointer;
            }
            div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              transform: translateY(-15px);
              font-size: 12px;
              text-align: left;
              margin-left: 20px;
              a {
                color: #6e6e6e;
              }
            }
          }


          .song-item:first-child{
            margin-left: 15px;
          }
          .song-item:nth-child(6){
            margin-left: 20px;
          }

        }
        .left {
          position: relative;
          top: 110px;
          left: 15px;
          z-index: 100;

          color: #ccc;

          font-size: 20px;
        }
        .right {
          position: relative;
          top: 110px;
          left: 700px;
          color: #ccc;
          z-index: 100;
          font-size: 20px;

        }
        .left:hover {
          cursor: pointer;
          color: #6e6e6e;

          box-shadow: 0 0 5px #9999a6;
        }
        .right:hover {
          cursor: pointer;
          color: #6e6e6e;

          box-shadow: 0 0 5px #9999a6;
        }




        .toplist {
          width: 730px;
          height: 465px;
          background-color: #f4f4f4;
          margin: 20px auto;
          display: flex;
          .toplist-item {
            flex: 1;
            border: 1px solid #9999a6;
            .item {
              display: flex;
              .item-left {

                margin: 20px;
                img {
                  cursor: pointer;
                  width: 80px;
                  height: 80px;
                  box-shadow:  0 5px 5px #6e6e6e;

                }
              }
              .item-right {
                .right-top {
                  margin-top: 27px;
                  h3 {
                    font-size: 14px;
                  }
                }
                .right-bottom {
                  margin-top: 10px;
                  span {
                    font-size: 25px;
                    color: #acacac;
                    cursor: pointer;
                  }
                  span:hover {
                    color: #323232;
                  }
                }
              }
            }
            //.item2{
            //  display: flex;
            //  .index {
            //    width: 40px;
            //    height: 200px;
            //    background-color: #e4e4e4;
            //  }
            //  ul {
            //    list-style: none;
            //    width: 200px;
            //    background-color: #9999a6;
            //  }
            //}

          }

          .toplist-item:nth-child(2){
            border-left: none;
          }
          .toplist-item:nth-child(3){
            border-left: none;
          }
        }
        .l {

          width: 730px;
          display: flex;
          position: absolute;
          margin-top: 120px;

          .item2 {
            flex: 1;
            span {
              height: 30px;
            }
            line-height: 30px;
           .s1 {
             border-left: 1px solid #9999a6;

             font-size: 13px;
             line-height: 30px;
             display: inline-block;
             width: 40px;
             text-align: center;

            }
            .bg {
              background-color: #e8e8e8;
            }
            .s2 {
              a {
                font-size: 12px;
                color: #6e6e6e;
              }
              white-space: nowrap;
              overflow: hidden;
              display: inline-block;
              width: 200px;
              text-overflow: ellipsis;
            }
            #div1 {
              position: absolute;
              z-index: 200;
              left: 50px;
              cursor: pointer;

              opacity: 0;

              width: 220px;
              text-align: center;
              .span1 {
                font-size: 20px;
                line-height: 30px;
                color: #acacac;
              }
              .span1:hover {
                color: #323232;
              }
            }
            #div1:hover {

              opacity: 1;
            }
            #div2 {
              position: absolute;
              z-index: 200;
              left: 300px;
              cursor: pointer;

              opacity: 0;
              width: 220px;
              text-align: center;
              .span2 {
                font-size: 20px;
                line-height: 30px;
                color: #acacac;
              }
              .span2:hover {
                color: #323232;
              }
            }
            #div2:hover {

              opacity: 1;
            }
            #div3 {
              position: absolute;
              z-index: 200;
              left: 540px;
              cursor: pointer;

              opacity: 0;
              width: 220px;
              text-align: center;
              .span3 {
                font-size: 20px;
                line-height: 30px;
                color: #acacac;
              }
              .span3:hover {
                color: #323232;
              }
            }
            #div3:hover {

              opacity: 1;
            }
            span {
              vertical-align: middle;
            }

            .ib {
              text-align: right;
              line-height: 30px;
              font-size: 13px;
              width: 221px;
              border-left: 1px solid #acacac;
              background-color: #e8e8e8;
              padding-right: 20px;
              a {
                color: #6e6e6e;
              }
            }
          }
        }

      }



    .content-right {
      border: 1px solid #acacac;
      border-left: none;
      width: 327px;
      height: 1400px;
      background-color: #ffffff;
      .div1 {
        font-size: 12px;

        line-height: 25px;
        height: 120px;
        width: 100%;
        background-image: linear-gradient(#ffffff,#e2e2e2);
        p {
          width: 70%;

          margin: 20px auto;
        }
        button {
          background-color: #cd0e15;
          width: 100px;
          height: 30px;
          border-radius: 5px;
          color: #ffffff;
          transform: translateX(100%);
        }
        button:hover {
          background-color: #e7262d;
          cursor: pointer;
        }

      }

      .hotSonger {
        .song-title {
          margin: 20px;
          line-height: 20px;
          border-bottom: 1px solid #6e6e6e;

          .s1 {
            margin-left: 10px;
            font-size: 12px;
          }
          .s2 {
            margin-left: 160px;
            a {
              font-size: 12px;
              color: #6e6e6e;
            }
          }
        }
        .songer-item {
          background-color: #fafafa;
          margin: 20px 20px;
          display: flex;
          .right {
            img {
              width: 62px;
              height: 62px;
            }
          }
          .left {
            .songer-name {
              font-size: 14px;
              font-weight: bold;
              margin: 10px;
            }
            .songer-detail {
              margin-left: 10px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 200px;
              font-size: 12px;
            }
          }
        }
        .songer-item:hover {
          background-color: #f4f4f4;
          cursor: pointer;
        }
      }
    }

  }
</style>