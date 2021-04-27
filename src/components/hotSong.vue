<template>
 <div class="hotsong">
   <el-button @click.stop="firstPlay" style="margin-top: 10px" type="primary" icon="el-icon-video-play">播放</el-button>
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
 </div>

</template>

<script>
export default {
  name: "hotSong",
  data() {
    return {
      tracks: [],
      speed: 0,
      url: '',
      flag: true,
      mark: 0
    }
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
      this.$store.commit('setList',this.tracks)
      this.$store.commit('setHeadUrl',this.tracks[0].al.picUrl)
      this.$store.commit('setheadname',this.tracks[0].name)
      this.$store.commit('setheadsonger',this.tracks[0].ar[0].name)
      this.play()
    },
    getHotSong() {
      this.$http.get('/artist/top/song?id=' + this.$store.state.songerId).then( res => {
        if(res.data.code == 200) {
          this.tracks = res.data.songs
        }
      })
    }
  },
  created() {
    this.getHotSong()
  }
}
</script>

<style lang="less" scoped>
  .hotsong {
    .song-table {
      margin-top: 15px;
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
  }
</style>