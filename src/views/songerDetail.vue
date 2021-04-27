<template>
 <div class="songerDetail">
   <div class="content">
     <div class="c-left">
       <div class="name">
         <div>{{name}}</div>
         <img :src="cover" alt="">
       </div>
     </div>
     <div class="c-right">
       <div class="title">
         <em @click="goChild(index)" :class="active==index?'active':''" :key="index" v-for="(item,index) in title">{{item}}</em>
          <hot-song v-if="active==0"></hot-song>
         <all-ab v-if="active==1"></all-ab>
         <self-int v-if="active==2"></self-int>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
  import hotSong from '@/components/hotSong'
  import selfInt from '@/components/selfIn'
  import allAb from '@/components/allAb'
export default {
  components: {
    hotSong,
    selfInt,
    allAb
  },
  name: "songerDetail",
  data() {
    return {
      list: [],
      title: ['热门作品','所有专辑','艺人介绍'],
      active: 0,
      name: '',
      cover: ''
    }
  },
  methods: {
    goChild(index) {
      this.active = index
      this.$router.push('hotsong')
    },
    getSongerDetail() {
      this.$http.get('/artist/detail?id=' + this.$route.params.id).then( res => {
        if(res.data.code == 200) {
          this.list = res.data.data
          this.name = this.list.artist.name
          this.cover = this.list.artist.cover
        } else {
          this.$message({
            type: 'error',
            message: '歌手数据请求失败',
            center: true,
            offset: 200
          })
        }
      })
    }
  },
  created() {
    this.getSongerDetail()
  }
}
</script>

<style lang="less" scoped>
 .songerDetail {
   background-color: #f5f5f5;
   .content {
     background-color: #ffffff;
     margin-left: 150px;
     width: 1150px;
     padding: 40px;
     display: flex;
     .c-left {
       .name {
         div {
           font-size: 23px;

         }
         img {
           margin-top: 10px;
           border: 1px solid #8e8e8e;
           height: 320px;
         }
       }
     }
     .c-right {

       .title {
         .active {
           border-bottom: none;
           background-image: linear-gradient(#f7f7f7,#ffffff);
         }
         margin-left: 70px;
         margin-top: 40px;
         em {
           text-align: center;
           height: 37px;
           line-height: 37px;
           font-size: 18px;
           border: 1px solid #8e8e8e;
           display: inline-block;
           width: 124px;
           cursor: pointer;
           background-color: #f7f7f7;
         }
         em:nth-child(1) {
           border-right: none;
         }
         em:nth-child(2) {
           border-right: none;
         }
       }
     }
   }
 }
</style>