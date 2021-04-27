<template>
  <div class="songer">
    <div class="content">
      <div class="content-left">
        <div @click="changeIndex(item,index)" :class="activeIndex == index ? 'active' : ''" :key="index" v-for="(item,index) in list" class="t1">
          <span class="fk"></span>
          {{item}}
        </div>
      </div>
      <div v-loading="loading" class="content-right">
        <div class="t2">
          {{list[activeIndex]}}歌手
        </div>
        <div @click="goSongerDetail(item.id)" class="songer-item" v-if="index < 10" v-for="(item,index) in hotSonger" :key="index">
          <div class="img">
            <img :src="item.picUrl" alt="">
          </div>
          <div class="name">
            <a href="javascript:;">{{item.name}}</a>
            <span class="el-icon-user"></span>
          </div>
        </div>


        <div class="line"></div>

        <div class="songer-item2">
          <div @click="goSongerDetail(item.id)" v-if="index > 9" v-for="(item,index) in hotSonger" :key="index" class="item">
            <a href="javascript:;">{{item.name}}</a>
            <span class="el-icon-user"></span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "songer",
  data() {
    return {
      hotSonger: [],
      list: ['热门','华语','欧美','韩国','日本'],
      loading: true
    }
  },
  computed: {
    activeIndex: {
      get() {
        return this.$store.state.songerIndex
      },
      set(v) {
        this.$store.commit('setSongerIndex',v)
      }
    }
  },
  created() {
    if(this.activeIndex == null || this.activeIndex == 0) {
      this.activeIndex = 0
      this.getHotSonger()
    } else {
      this.getSonger(this.activeIndex)
    }

  },
  methods: {
    goSongerDetail(id) {
      this.$router.push('/songerDetail/' + id)
      this.$store.commit('setSongerId',id)
    },
    getSonger(i) {
      sessionStorage.setItem('songerIndex',i)
      this.$http.get('/toplist/artist?type=' + i).then( res => {
        if( res.data.code == 200) {
          this.loading = false
          this.hotSonger = res.data.list.artists
        } else {
          this.$message({
            type: 'error',
            offset: 200,
            center: true,
            message: '歌手数据请求失败'
          })
        }
      })
    },
    changeIndex(item,index) {
      this.activeIndex = index
     if( index == 0) {
       this.getHotSonger()
     } else {
       this.getSonger(index)
     }
    },
    getHotSonger() {
      sessionStorage.setItem('songerIndex',0)
      this.$http.get('/top/artists?offset=0&limit=100').then( res => {
        if( res.data.code == 200) {
          this.loading = false
          this.hotSonger = res.data.artists
        } else {
          this.$message({
            type: 'error',
            offset: 200,
            center: true,
            message: '热门歌手数据请求失败'
          })
        }
      })
    }
  }

}
</script>

<style lang="less" scoped>
  .songer {
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
    .content {
      height: 1400px;
      margin: 0 auto;
      width: 1000px;
      display: flex;
      .content-left {
        border: 1px solid #d3d3d3;
        background-color: #f9f9f9;
        width: 200px;
        height: 1240px;
        .t1 {
          padding: 5px;
          border-bottom: 1px solid #cccccc;
          text-align: center;
          margin: 60px 20px;
          .fk {
            width: 5px;
            height: 5px;
            display: inline-block;
            background-color: #afafaf;
            transform: translate(0,-50%);
          }
        }
        .active {
          background-image: linear-gradient(#ffffff,#f7f7f7);
          border: 1px solid #cccccc;
          padding: 5px;
          border-radius: 7px;
          .fk {
            background-color: #c20c0c;
          }
        }
        .t1:hover {
          background-image: linear-gradient(#ffffff,#f7f7f7);
          border: 1px solid #cccccc;
          padding: 5px;
          border-radius: 7px;
          .fk {
            background-color: #c20c0c;
          }
          cursor: pointer;
        }
      }
      .content-right {
        border-right: 1px solid #d3d3d3;
        border-bottom: 1px solid #d3d3d3;
        width: 800px;
        height: 1240px;
        background-color: #ffffff;
        .t2 {
          font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
          font-weight: normal;
          font-size: 24px;
          margin: 40px 30px;
          padding-bottom: 5px;
          border-bottom: 2px solid #1b1a19;
        }
        .songer-item {
          margin-left: 24px;
          margin-bottom: 20px;
         float: left;
          position: relative;
          .img {
            img {
              border: 1px solid #cccccc;
              width: 130px;
              height: 130px;
              cursor: pointer;
            }
          }
          .name {
            a {
              font-size: 12px;
              color: #000;
            }
            span {
              position: absolute;
              left: 100px;
              background-color: #c20c0c;
              top: 138px;
              color: #f4f4f4;
              padding: 1px;
              cursor: pointer;
              border-radius: 50%;
            }
          }
        }

        .line {
          width: 760px;
          left: 480px;
          height: 1px;
          background-color: #8e8e8e;
          position: absolute;
          top: 550px;

        }
        .songer-item2 {
          width: 800px;
          position: absolute;
          top: 580px;
          margin-left: 30px;
          display: flex;
          flex-wrap: wrap;
          .item {
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            height: 24px;
            margin-top: 10px;
            margin-left: 25px;
            width: 120px;
            a {
              font-size: 12px;
              color: #1b1a19;
            }
            span {
              color: #f4f4f4;
              background-color: #c20c0c;
              border-radius: 50%;
              margin-left: 2px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>