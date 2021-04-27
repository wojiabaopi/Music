<template>
  <div class="album">

    <div class="content">
      <div class="content-left">
        <div class="left-top">
          <div class="img">
            <img :src="album.picUrl" alt="">
          </div>
          <div class="font">
            <div class="title">
              <span class="s1 el-icon-service">专辑</span>
              <span class="s2">{{album.name}}</span>
            </div>
            <div class="ct">
              <div>歌手: <a href="javascript:;">{{name}}</a></div>
              <div>发行时间: <span>{{album.publishTime | dateFormat}}</span></div>
              <div>发行公司: <span>{{album.company}}</span></div>
            </div>
            <div class="play">
              <el-button @click.stop="firstPlay" type="primary" icon="el-icon-video-play">播放</el-button>
            </div>
          </div>
        </div>
        <div class="left-bottom">
          <h6>专辑介绍：</h6>
          <div>
            <p v-for="(item,index) in desc">{{item}}</p>
          </div>

          <div class="table-title">
            <span class="sp1">包含歌曲列表  </span>
            <span class="sp2">{{songs.length}} 首歌</span>
          </div>

          <div class="song-table">
            <table  >
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

         <div class="el1">
           <el-pagination
             background
             :current-page="currentPage"
             @current-change="handleCurrentChange"
             layout="prev, pager, next"
             :total="songs.length">
           </el-pagination>
         </div>

        </div>
      </div>



      <div class="content-right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "album",
  created() {
    this.getAlbum()
  },
  data() {
    return {
      currentPage: 1,
      album: [],
      songs: [],
      desc: [],
      name: '',
      flag: true,
      speed: 0,
      url: '',
      tracks: []
    }
  },
  watch: {
    '$route'(to,from) {
      this.getAlbum()
    }
  },
  methods: {
    handleCurrentChange(val) {
      const start = (val - 1) * 10
      const end = (val * 10)
      this.tracks = this.songs.slice(start,end)
    },
    firstPlay(){
      if(this.tracks[0].rurl != null){
        this.$store.commit('setList',this.tracks)
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
    playAudio(id) {
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
      this.$http.get('/song/url?id='+id).then( res => {
        if(res.data.code == 200){
          if(res.data.data[0].url != null){
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
              type: 'error',
              center: true,
              message: '没有播放版权',
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
    getAlbum(){

      this.$http.get('/album?id='+this.$route.params.id).then( res => {
        if( res.data.code === 200){
          this.album = res.data.album
          this.songs = res.data.songs
          if(this.songs.length > 10){
            this.tracks = this.songs.slice(0,10)

          } else {
            this.tracks = this.songs
          }
          this.name = this.album.artist.name
          this.desc =  this.album.description.split(/[(\r\n)\r\n]+/)
          this.desc.forEach( (item,index) => {
            if(!item){
              this.desc.splice(index,1)
            }
          })

        } else {
          this.$message({
            type: 'error',
            offset: 200,
            center: true,
            message: '专辑数据获取失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .album {
    min-height: 1000px;
    background-color: #f5f5f5;
    .content {
      border: 1px solid #acacac;
      width: 1000px;
      margin: 0 auto;
      min-width: 1000px;
      background-color: #ffffff;
      display: flex;
      .content-left {
        border-right: 1px solid #6e6e6e;
        padding: 40px;
        .left-top {
          display: flex;
          .img {
            img {
              border: 2px solid #6e6e6e;
              padding: 2px;
              box-shadow: 0 0 3px #e4e4e4;
              width: 150px;
              height: 150px;
            }
          }
          .font {
            margin-left: 30px;
            .s1 {
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
            .s2 {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-left: 7px;
              font-size: 20px;
              display: inline-block;
              width: 120px;
              transform: translateY(20px);
              height: 40px;
              text-align: center;
            }
            .ct {
              div {
                font-size: 12px;
                margin-top: 5px;
                a {
                  margin-left: 5px;
                }
                span {
                  margin-left: 5px;
                }
              }
            }
            .play {
              margin-top: 10px;
            }
          }
        }
        .left-bottom {
          h6 {
            margin-top: 20px;
          }
          div{
            height: 190px;
            width: 630px;
            margin-top: 10px;
            margin-left: 20px;
            font-size: 13px;
            overflow: hidden;

            p {
              margin-bottom: 5px;
              color: #666;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .table-title {
            height: 30px;
            width: 710px;
            border-bottom: 2px solid #000000;
            .sp1 {
              font-size: 20px;
            }
            .sp2 {
              font-size: 12px;
              margin-left: 10px;
            }
          }

          .song-table {
            width: 700px;
            height: 100%;
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
          .el1 {
            text-align: center;
          }
        }

      }
    }
  }














</style>