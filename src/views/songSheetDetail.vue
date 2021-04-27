<template>
  <div v-loading="loading" class="songList">
    <div class="head">
      <div class="left-head">
        <img :src="songList.coverImgUrl" alt="">
      </div>
      <div class="right-head">
          <div class="div1">
             <span class="el-icon-service">歌单</span> {{songList.name}}
          </div>
        <div class="div2">
          <img v-if="creator" :src="creator.avatarUrl" alt="">
          <span class="span1"><a href="javascript:;">{{creator.nickname}}</a></span>
          <span class="el-icon-medal span2"></span>
          <span class="span3"> {{songList.createTime | dateFormat}} 创建</span>
        </div>
        <div class="div3">
          <el-button @click.stop="firstPlay" type="primary" icon="el-icon-video-play">播放</el-button>
        </div>
        <div class="div4">
          <span>标签:</span>
          <el-tag v-for="(item,index) in tags" :key="index" >{{item}}</el-tag>
        </div>
        <div class="div5">
          <p>介绍: <p class=".ppp" v-for="item in str2">{{item}}</p> <br>
        </div>
      </div>

    </div>
    <div class="song-content">
      <div class="title">
        <span class="span1">歌曲列表</span>
        <span class="span2">{{songList.trackCount}}首歌</span>
        <span  class="span3">播放 <span>{{songList.playCount}}</span> 次</span>
      </div>
      <div class="song-table">
        <table v-loading="tableloading" >
          <thead>
          <tr>
            <th class="th1"></th>
            <th class="th2">歌曲标题</th>
            <th class="th3">时长</th>
            <th class="th4">歌手</th>
            <th class="th5">专辑</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="index" v-for="(item,index) in tracks">
            <td class="td1 ">{{index+1}} <span @click.stop="playAudio(item.id)" class="el-icon-video-play"></span></td>
            <td style="width: 238px" class="td2">{{item.name}}</td>
            <td class="td3">{{item.dt|timeFormat}}</td>
            <td class="td4">{{item.ar[0].name}}</td>
            <td class="td5">{{item.al.name}}</td>
          </tr>
          </tbody>
        </table>
      </div>


      <el-pagination
        background
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="songList.trackCount">
      </el-pagination>


    </div>

    <div class="related">
      <div class="like">
        <div class="title">喜欢这个歌单的人</div>
        <div class="title-img" >
            <div class="image" :key="index" v-for="(item,index) in subscribers">
              <img  :src="item.avatarUrl" alt="">
            </div>
        </div>
      </div>
      <div class="tj">
         <div class="tj-title">相关推荐</div>
        <div class="tj-content">
           <div class="content-item" @click.stop="goDetail(item.id)" :key="index" v-for="(item,index) in related">
             <div class="left">
               <img :src="item.coverImgUrl" alt="">
             </div>
             <div class="right">
                <div class="top"><a href="javascript:;">{{ item.name }}</a></div>
               <div class="bottom"> <span>by</span> <a href="javascript:;">{{item.creator.nickname}} </a></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "songSheetDetail",
  data() {
    return {
      tableloading: false,
      loading: true,
      songList: [],
      creator: {},
      tags: [],
      str: '',
      str2: [],
      tracks: [],
      url: '',
      subscribers: [],
      related: [],
      isLog: this.$store.state.isLog,
      jindu: {},
      speed: 0,
      tracksid: [],
      ids: [],
      currentPage: 1,
      num: 1,
      flag: true,
      mark: 0,
      songs: [],
    }
  },
  watch: {
    '$route'(to,from) {
      this.getSongList()
    }
  },
  created() {
    this.getSongList()
  },
  methods: {
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
    handleCurrentChange(val) {
      this.tableloading = true
      this.tracks = []
      const start = (val-1)*10
      const end = val*10
      const id = this.ids.slice(start,end)
      id.forEach( (item,index) => {
        this.$http.get('/song/detail',{params:{
          ids: item
          }}).then(res=> {
          this.tracks.push(res.data.songs[0])
          if(val===Math.ceil((this.songList.trackCount) / 10)){
              this.tableloading = false

          } else {
            if(index === 9){
              this.tableloading = false
            }
          }
        })
      })
    },
    goDetail(id){
      this.$router.push('/songSheetDetail/' + id)
      this.getSongList()
    },
    firstPlay(){
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
      this.$http.get('/playlist/detail?id=' + this.$route.params.id).then( res => {
        if(res.data.code === 200){
          this.$store.commit('setList',res.data.playlist.tracks)
          this.$store.commit('setHeadUrl',res.data.playlist.tracks[0].al.picUrl)
          this.$store.commit('setheadname',res.data.playlist.tracks[0].name)
          this.$store.commit('setheadsonger',res.data.playlist.tracks[0].ar[0].name)
          this.play()
        }
      })
    },
    getSongList() {
      this.$http.get('/playlist/detail?id=' + this.$route.params.id).then( res => {
        if( res.data.code === 200) {
          this.tracksid = res.data.playlist.trackIds
          this.tracksid.forEach(item=> {
            this.ids.push(item.id)
          })
          this.loading = false
          this.$store.commit('setprivlist',res.data.privileges)
          this.songList = res.data.playlist
          this.creator = this.songList.creator
          this.tags = this.songList.tags
          this.subscribers = this.songList.subscribers

          this.str = this.songList.description
          this.tracks = this.songList.tracks
          this.songs = this.tracks
          this.str2 = this.str.split(/['，','。',' ']/)
          this.$store.commit('setprivlist',res.data.privileges)
          this.$http.get('/related/playlist?id=' + this.songList.id).then( res2 => {

            if(res2.data.code === 200) {
              this.related = res2.data.playlists
            } else {
              this.$message({
                type: 'error',
                message: '相关推荐数据请求失败',
                offset: 200,
                center: true
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '歌单列表请求失败',
            offset: 200,
            center: true
          })
        }
      })
    },
    playAudio(id) {
      this.flag = true
      // if(this.$store.state.list.length === 0){
      //   this.$store.commit('setList',this.tracks)
      // }
      clearInterval(this.$store.state.timer)
      this.$store.commit('setJinduValue',0)
      this.$store.commit('setSongTime',0)
      this.$store.commit('setPlayTime',0)
      this.speed = 0
      this.tracks.forEach( (item,index) => {
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
            if(this.tracks[this.mark].id === item.id){
              this.$store.commit('setSelected',index)
              this.$store.commit('setIndex',index)
              this.flag = false
              return
            }
          })
        }
        if(this.flag){
          let c = this.tracks[this.mark]
          let a = this.$store.state.list.push(c)
          this.$store.commit('setIndex',a-1)
          this.$store.commit('setSelected',a-1)
        }
      }

      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsView',false)
      if(!this.$store.state.isLock){
        setTimeout( () => {
          this.$store.commit('setIsView',true)
        },3000)
      }
      this.$http.get('/song/url?id='+id).then( res => {
        if(res.data.code == 200){
          this.url = res.data.data[0].url
          const audio = document.getElementById('audio1')
          audio.setAttribute('src',this.url)
          audio.load()


          audio.oncanplay = () => {
            this.$store.commit('setSongTime',audio.duration)
            audio.play()
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


    }
  }

}
</script>

<style lang="less" scoped>
  .songList {
    width: 100%;
    position: relative;
    min-height: 1000px;
    background-color: #f5f5f5;
    .head {
      border: 1px solid #e4e4e4;
      border-bottom: none;
      display: flex;
      margin-left: 220px;
      width: 750px;
      background-color: #ffffff;
      .left-head {
        width: 230px;
        padding-left: 30px;
        padding-top: 40px;
        img {
          height: 200px;
          width: 200px;
          border: 1px solid #acacac;
          padding: 3px;
        }
      }
      .right-head {
        margin-left: 20px;
        padding-top: 40px;
        .div1 {
          span {
            text-align: center;
            display: inline-block;
            width: 60px;
            height: 30px;
            line-height: 30px;
            border-radius: 10px;
            letter-spacing: 1px;
            background-color: #d61c1c;
            color: #ffffff;
            font-size: 14px;
          }
        }
        .div2 {
          margin-top: 20px;
          img {
            width: 30px;
            height: 30px;
          }
          .span1 {
            margin-left: 10px;
            a {
              color: #0c89d4;
              font-size: 10px;
            }
          }
          .span3 {
            margin-left: 10px;
            color: #acacac;
            font-size: 12px;
          }
        }
        .div3 {
          margin-top: 10px;

        }
        .div4 {
          margin-top: 10px;
          span {
            color: #acacac;
            font-size: 12px;
            margin-right: 10px;
          }
          .el-tag {
            border-radius: 10px;

          }
        }
        .div5 {
          width: 230px;
          max-height: 130px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;

          margin-top: 10px;
          font-size: 12px;
          color: #acacac;
        ;
        }
      }
    }

    .song-content {
      .el-pagination {
        margin-top: 20px;
        margin-left: 230px;

      }
      width: 750px;
      background-color: #ffffff;
      margin-left: 220px;

      .title {
        margin-left: 28px;
        margin-right: 28px;
        line-height: 30px;
        border-bottom: #c20c0c 2px solid;
        .span1 {
          font-size: 20px;

        }
        .span2 {
          font-size: 12px;
          margin-left: 20px;
        }
        .span3 {
          margin-left: 400px;
          font-size: 12px;
          span {
            font-family: "Arial Black";
          }
        }
      }

      .song-table {

        margin-left: 28px;
        table {
          table-layout: fixed;
          tr:nth-child(odd) {
            background-color: #f7f7f7;
          }
          width: 694px;
          max-width: 694px;
          border-collapse: collapse;
          border: 1px solid #acacac;
          thead {
            text-align: left;
            tr {
              .th5 {
                width: 128px;
                height: 35px;
              }
              .th4 {
                width: 88px;
              }
              .th3 {
                width: 110px;
              }
              .th2 {
                width: 238px;
              }
              .th1 {
                width: 74px;
              }
              th {
                padding-left: 10px;
                height: 38px;
                line-height: 38px;
                background-image: linear-gradient(#ffffff,#f6f6f6);
                border: 1px solid #acacac;
                font-size: 12px;
                color: darkgrey;

                -moz-text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
          }
          tbody {
            tr {
              .td1 {
                width: 85px;
                span {
                  padding-left: 20px;
                  font-size: 18px;
                  color: #acacac;
                }
                span:hover {
                  cursor: pointer;
                  color: #C10D0C;
                }
                color: #acacac;
                padding-left: 20px;
              }
               td {
                 font-size: 12px;
                 color: #717171;
                 height: 38px;
                 line-height: 38px;
                 text-overflow: ellipsis;
                 overflow: hidden;
                 white-space: nowrap;
               }
              .td5 {
                width: 139px;
              }
              .td4 {
                width: 99px;
              }
              .td3 {
                width: 129px;
              }
              .td2 {
                width: 247px;
              }
            }
          }
        }

      }
      .more {
        margin-top: 15px;
        margin-left: 320px;
        .more-title {
          font-size: 12px;
        }
      }
    }

    .related {
      width: 270px;

      background-color: #ffffff;
      position: absolute;
      left: 970px;
      top: 0px;
      border: 1px solid #e4e4e4;
      .like {
        margin: 20px;
        .title{
          font-size: 12px;
          font-weight: bold;
          border-bottom: 1px solid #acacac;
          line-height: 30px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .title-img {
          width: 230px;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          .image {
            cursor: pointer;
            margin: 5px;
            flex: 1;
            img{
              width: 40px;
              height: 40px;
            }
          }
        }
      }
      .tj {
        margin: 20px;
        .tj-title {
          font-size: 12px;
          font-weight: bold;
          border-bottom: 1px solid #acacac;
          line-height: 30px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .tj-content {
          margin-top: 20px;
          .content-item {
            display: flex;
            margin-bottom: 12px;
            .left {
              margin-left: 10px;
              img {
                width: 45px;
                cursor: pointer;
                height: 45px;
              }
            }
            .right {
              div {
                margin-left: 10px;
              }
              .top {
                width: 130px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 14px;
                a {
                  color: #356458;
                }
              }
              .bottom {
                line-height: 30px;
                span {
                  color: #acacac;
                  font-size: 12px;
                }
              a {
                color: #717171;
              }
                font-size: 12px;
              }
            }
          }
        }
      }


    }

  }
</style>