<template>
  <div class="songSheet">

    <div :class="show? 'show':''"  class="sheetlist">
      <div class="top-title">
        <a @click="goDe" href="javascript:;">全部分类</a>
      </div>
      <div class="bottom-info" >
        <div class="left">
          <div :key="index" v-for="(item,index) in categories"> <i :class="c[index]"></i> {{item}}</div>
        </div>
        <div class="right">
          <div><a  :class="cate===item.name?'bg':''"  @click="goSheet(item.name)" :key="index" v-for="(item,index) in catelist" v-if="item.category===0" href="javascript:;">{{item.name}} <span>|</span> </a></div>
          <div><a :class="cate===item.name?'bg':''"  @click="goSheet(item.name)" :key="index" v-for="(item,index) in catelist" v-if="item.category===1" href="javascript:;">{{item.name}} <span>|</span> </a></div>
          <div><a :class="cate===item.name?'bg':''"  @click="goSheet(item.name)" :key="index" v-for="(item,index) in catelist" v-if="item.category===2" href="javascript:;">{{item.name}} <span>|</span> </a></div>
          <div><a :class="cate===item.name?'bg':''"  @click="goSheet(item.name)" :key="index" v-for="(item,index) in catelist" v-if="item.category===3" href="javascript:;">{{item.name}} <span>|</span> </a></div>
          <div><a :class="cate===item.name?'bg':''"  @click="goSheet(item.name)" :key="index" v-for="(item,index) in catelist" v-if="item.category===4" href="javascript:;">{{item.name}} <span>|</span> </a></div>

        </div>
      </div>
    </div>

    <div class="icon">歌单分类</div>
    <div class="info">
      <div class="title">
        <div class="cate"><span>{{ this.$route.params.name }}</span>
          <a @click="isShow" href="javascript:;" class="clickcate">选择分类 <i class="el-icon-arrow-down"></i></a>
        </div>

      </div>

      <div v-loading="loading" class="content">
        <div @click="gotoDetail(item.id)" class="content-item" v-for="(item,index) in songsheet" :key="index">
          <img :src="item.coverImgUrl" alt="">
          <div class="iconpaly">
            <span class="headset el-icon-headset"> <span>{{item.playCount|headFormat}}</span></span>
            <span @click.stop="toto(item.id)" class="play el-icon-video-play"></span>
          </div>
          <div class="a1"><a href="javascript:;">{{ item.name }}</a></div>
          <div class="a2"><a href="javascript:;"><span>by</span>{{ item.creator.nickname }} <i
            class="el-icon-medal"></i> </a></div>
        </div>
      </div>

      <el-pagination
        background
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>

    </div>


  </div>
</template>

<script>
export default {
  name: "songSheet",
  data() {
    return {
      songsheet: [],
      cate: this.$route.params.name,
      total: 0,
      offset: 1,
      url: '',
      show: false,
      categories: {},
      catelist: [],
      c: ['el-icon-chat-line-round','el-icon-reading','el-icon-coffee-cup','el-icon-coordinate','el-icon-headset'],
      currentPage: 1,
      loading: true,
      speed: 0
    }
  },
  created() {
    this.getSongSheet()
    this.getCateList()
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
          console.log(res2);
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
    handleCurrentChange(page){
      this.offset = page
      this.getSongSheet()
    },
    goSheet(name){
      this.$router.push('/songSheet/' + name)
      this.show = !this.show
      this.cate = this.$route.params.name
      this.getCateList()
      this.getSongSheet()
    },
    goDe(){
      this.$router.push('/songSheet/' + '全部')
      this.show = !this.show
      this.cate = this.$route.params.name
      this.getCateList()
      this.getSongSheet()

    },
    getCateList(){
      this.$http.get('/playlist/catlist').then( res => {
        if( res.data.code === 200){

          this.categories = res.data.categories
          this.catelist = res.data.sub
        } else {
          this.$message({
            type: 'error',
            message: '分类数据获取失败',
            center: true,
            offset: 200
          })
        }
      })
    },
    isShow(){
      this.show = !this.show
    },
    getSongSheet() {

      this.$http.get('/top/playlist?cat=' + this.cate + '&limit=35&offset=' + this.offset).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.songsheet = res.data.playlists
          this.total = res.data.total
        } else {
          this.$message({
            type: 'error',
            offset: 200,
            center: true,
            message: '歌单数据请求失败'
          })
        }
      })
    },
    gotoDetail(id) {
      this.$router.push('/songSheetDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.songSheet {


  .sheetlist {
    width: 650px;
    position: absolute;
    z-index: 1000;
    left: 300px;
    top: 200px;
    height: 300px;
    background-color: #ffffff;
    border: 2px solid #acacac;
    display: none;
    box-shadow:  1px 1px 5px #9999a6;
    .top-title {
      height: 50px;
      border-bottom: 1px solid #acacac;
      padding-left: 20px;
      a {
        line-height: 50px;
        color: #6e6e6e;
        border: 1px solid #acacac;
        background-color: #f7f7f7;
        font-size: 13px;
        padding: 3px 7px;
        border-radius: 3px;
      }
    }
    .bottom-info {
      .bg{
        background-color: #a7a7a7;
        color: #ffffff !important;
      }
      .left {
        width: 80px;
        border-right: #acacac 1px solid;
        height: 300px;
        float: left;
        div:nth-child(1){
          margin-top: 15px;
        }
        div:nth-child(2){
          margin-top: 20px;
        }
        div:nth-child(3){
          margin-top: 38px;
        }
        div:nth-child(4){
          margin-top: 15px;
        }
        div:nth-child(5){
          margin-top: 15px;
        }
        div {
          font-weight: 400;
          font-size: 14px;
          text-align: center;
        }
      }

      .right {
        div:nth-child(1){
          padding-top: 15px;
        }
        div:nth-child(2){
          padding-top: 15px;
        }
        div:nth-child(3){
          padding-top: 15px;
        }
        div:nth-child(4){
          padding-top: 15px;
        }
        div:nth-child(5){
          padding-top: 15px;
        }
        div {
        }
        a {
          padding-left: 7px;
          font-size: 12px;
          color: #6e6e6e;
          span {
            color: #acacac;
            padding-left: 5px;
          }
        }
      }

    }
  }
  .show {
    display: block;
  }


  width: 100%;
  height: 1800px;
  background-color: #f5f5f5;

  .icon {
    width: 980px;
    height: 50px;
    margin: 0 auto;
    border-radius: 5px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #ffffff;
    background-color: #9b0909;
  }

  .info {
    border: 1px solid #acacac;
    width: 900px;
    margin: 0 auto;
    padding: 20px 40px 40px 40px;
    background-color: #ffffff;

    .title {
      width: 100%;

      .cate {
        width: 100%;
        font-size: 25px;
        line-height: 40px;
        border-bottom: 2px solid #c20c0c;

        span {
          color: #5d5a5a;
        }
      }

      .clickcate {
        text-decoration: none;
        font-size: 12px;
        margin-left: 10px;
        border: 1px solid #acacac;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
        display: inline-block;
        transform: translateY(-5px);
        background-color: #f7f7f7;
        color: #226db0;
        padding: 0 10px;
      }
      .clickcate:hover {
        background-color: #fdfdfd;
      }
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .content-item {
        position: relative;
        .iconpaly{
          line-height: 25px;
          width: 100%;
          height: 25px;
          background-color: #323232;
          position: absolute;
          z-index: 99;
          bottom: 53px;
          color: #e4e4e4;
          opacity: 0.6;
          font-size: 15px;
          .headset {
            font-size: 14px;
            left: 10px;
            position: absolute;
            top: 5px;
            span {
              margin-left: 5px;
              color: #e4e4e4;
            }
          }
          .play {
            font-size: 20px;
            padding-left: 105px;
            cursor: pointer;
            color: #acacac;
          }
          .play:hover {
            color: #ffffff;
          }

        }
        cursor: pointer;
        margin: 20px;
        flex: 1;

        img {
          width: 140px;
          height: 140px;
        }

        .a1 {
          a {
            color: #356458;
            font-size: 14px;
            display: inline-block;
            width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .a2 {
          a {
            font-size: 12px;
            color: #356458;
            display: inline-block;
            width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            span {
              margin-right: 5px;
              color: #9999a6;
            }

            i {
              font-size: 20px;
              color: blue;
            }
          }
        }
      }
    }


    .el-pagination {
      margin-top: 20px;
      margin-left: 230px;
    }
  }



}
</style>