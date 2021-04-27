<template>
 <div class="allAb">
   <div class="ab">
     <div  class="item" v-for="(item,index) in list" :key="index">
       <div class="img">
         <img @click="goAlbum(item.id)" :src="item.picUrl" alt="">
         <div @click="newPlay(item.id)" class="new-play"> <span class="el-icon-video-play"></span></div>
       </div>

       <div class="bg"></div>

       <div @click="goAlbum(item.id)" class="name"> <a>{{item.name}}</a></div>
       <div class="time"> <span>{{item.publishTime | dateFormat}}</span></div>
     </div>
   </div>

   <el-pagination
     background
     :current-page="currentPage"
     @current-change="handleCurrentChange"
     layout="prev, pager, next"
     page-size="12"
     :total="albums.length">

   </el-pagination>
 </div>
</template>

<script>
export default {
  name: "allAb",
  data() {
    return {
      currentPage: 1,
      albums: [],
      list: [],
      tracks2: [],
      speed: 0,
      url: ''
    }
  },
  methods: {
    handleCurrentChange(val){
      const start = (val-1) * 12
      const end = val * 12
      this.list = this.albums.slice(start,end)
    },
    goAlbum(id){
      this.$router.push('/album/'+id)
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
    newPlay(id) {
      this.$http.get('/album?id='+id).then( res => {
        console.log(res);
        if( res.data.code === 200) {

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
            message: '新碟歌曲获取失败'
          })
        }
      })
    },
    getAlbumes() {
      this.$http.get('/artist/album?id=' + this.$store.state.songerId).then( res => {
        if(res.data.code == 200) {
            this.albums = res.data.hotAlbums
          this.list = this.albums.slice(0,12)
        } else {
          this.$message({
            type: 'error',
            message: '专辑数据获取失败',
            offset: 200,
            center: true
          })
        }
      })
    }
  },
  created() {
    this.getAlbumes()
  }
}
</script>

<style lang="less" scoped>
  .allAb {
    .ab{
      display: flex;
      flex-wrap: wrap;
      .item {
        z-index: 10;
        position: relative;
        margin-top: 20px;
        margin-right: 40px;
        .bg {
          width: 120px;
          height: 120px;
          box-shadow: 0px 0px 10px #8e8e8e;
          border-radius: 50%;
          background-color: #1b1a19;
          position: absolute;
          top: 0px;
          left: 20px;
          z-index: -20;
        }
        .name {
          a {
            width: 100px;
            height: 20px;
            display: inline-block;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            font-size: 14px;
          }
        }


        .time {
          span {
            font-size: 12px;
            color: #8e8e8e;
          }
        }
        .img {
          img {
            cursor: pointer;
            width: 120px;
            height: 120px;
          }


          .new-play {

            position: absolute;
            top: 0px;
            span {
              cursor: pointer;
              font-size: 25px;
              opacity: 0;
              color: #8e8e8e;
              display: inline-block;
              transform: translate(80px,80px);
            }
            span:hover {
              color: #f4f4f4;
            }
          }
        }
        .img:hover {
          .new-play {
            span {
              opacity: 1;
            }
          }
        }


      }
    }
    .el-pagination {
      margin-top: 20px;
      margin-left: 240px;
    }

  }
</style>