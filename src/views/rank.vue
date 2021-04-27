<template>
  <div class="rank">
    <div class="rank-content">
      <div class="content-left">
        <div class="title1">
          音乐特色榜
        </div>
        <div class="l1" :key="index" v-for="(item,index) in list1">
           <div :class="index==rankIndex? 'active' : ''" @click="crank(item.id,index)" class="l1-item">
             <div class="left-img">
               <img :src="item.coverImgUrl" alt="">
             </div>
             <div class="right-c">
               <div class="top">{{item.name}}</div>
               <div class="bot">{{item.updateFrequency}}</div>
             </div>
           </div>
        </div>

        <div class="title1">
          全球媒体榜
        </div>

        <div class="l1" :key="index+4" v-for="(item,index) in list2">
          <div :class="(index+4)==rankIndex? 'active' : ''" @click="crank(item.id,index+4)" class="l1-item">
            <div class="left-img">
              <img :src="item.coverImgUrl" alt="">
            </div>
            <div class="right-c">
              <div class="top">{{item.name}}</div>
              <div class="bot">{{item.updateFrequency}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <router-view/>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "rank",
  data() {
    return {
      topList: [],
      list1: [],
      list2: [],
      id: 0
    }
  },
  methods: {
    crank(id,index){
      this.$router.push('/rank/crank/' + id)
      this.$store.commit('setRankNavIndex',index)
      sessionStorage.setItem('rankId',id)
      sessionStorage.setItem('rankIndex',index)
     this.topList.forEach( item => {
       if(item.id == id){
         this.$store.commit('setDay',item.updateFrequency)
       }
     })
    },
    getTopList(){

      this.$http.get('/toplist').then( res => {
        if( res.data.code == 200){
          this.topList = res.data.list
          this.topList.forEach( item => {
            if(item.id == this.id){
              this.$store.commit('setDay',item.updateFrequency)
            }
          })
          this.list1 = this.topList.slice(0,4)
          this.list2 = this.topList.slice(4,this.topList.length)
        }
      })
    }
  },
  created() {
    this.getTopList()
    this.id  = sessionStorage.getItem('rankId')
    const index = sessionStorage.getItem('rankIndex')
    if( this.id == null){
      this.$router.push('/rank')
      this.rankIndex = 0
    } else {
      this.$router.push('/rank/crank/'+this.id)
      this.rankIndex = index
    }
  },
  computed: {
    rankIndex: {
      get(){
        return this.$store.state.rankNavIndex
      },
      set(v){
        this.$store.commit('setRankNavIndex',v)
      }
    }
  }

}
</script>

<style lang="less" scoped>
  .rank {
    background-color: #f5f5f5;
    min-height: 2300px;
    .rank-content {
      display: flex;
      width: 1000px;
      background-color: #ffffff;
      margin: 0 auto;
      height: 100%;
      .content-left {
        .active {
          background-color: #e6e6e6;
        }
        width: 250px;
        border: 1px solid #cccccc;
        background-color: #f9f9f9;
        .title1 {
          margin: 20px;
          font-size: 14px;
          font-family: simsun;
          font-weight: bolder;
        }
      .l1 {
        .l1-item:hover {
          background-color: #e6e6e6;
        }
        .l1-item {
          cursor: pointer;
          height: 62px;
          width: 100%;
          display: flex;
          .left-img {
            margin-left: 30px;
            img {
              margin-top: 11px;
              width: 40px;
              height: 40px;
            }
          }
          .right-c {

            .top {
              margin-top: 11px;

              font-size: 12px;
              margin-left: 10px;
            }
            .bot {
              margin-top: 6px;
              font-size: 12px;
              color: #999;
              margin-left: 10px;
            }
          }
        }
      }
      }
    }
  }
</style>