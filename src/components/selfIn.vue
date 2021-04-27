<template>
 <div class="intr">
   <div class="div1">

     <span>  <h2> <span class="line"></span>简介</h2></span>
     <p>{{desc}}</p>
   </div>
   <div v-if="!introduction.length==0" class="div2">
     <div> <h2>代表作品</h2></div>
     <p>{{introduction[0].txt}}</p>
   </div>
   <div v-if="!introduction.length==0" class="div3">

     <div> <h2>主要成就</h2></div>
     <p>{{introduction[1].txt}}</p>
   </div>
   <div v-if="!introduction.length==0" class="div4">
     <div> <h2>早年经历</h2></div>
     <p>{{introduction[2].txt}}</p>
   </div>
   <div v-if="!introduction.length==0" class="div5">
     <div> <h2>演艺经历</h2></div>
     <p>{{introduction[3].txt}}</p>
   </div>
 </div>
</template>

<script>
export default {
  name: "selfIn",
  data() {
    return {
      desc: '',
      introduction: []
    }
  },
  methods: {
    getDesc() {
      this.$http.get('/artist/desc?id=' + this.$store.state.songerId).then(res => {
        if(res.data.code == 200) {
          this.desc = res.data.briefDesc
          this.introduction = res.data.introduction
        } else {
          this.$message({
            type: 'error',
            message: '个人介绍数据请求失败',
            offset: 200,
            center: true
          })
        }
      })
    }
  },
  created() {
    this.getDesc()
  }
}
</script>

<style lang="less" scoped>
  .intr {
    div {
      h2 {
        font-size: 14px;
      }
      margin-top: 20px;
      p {
        text-indent: 2em;
        font-size: 12px;
        line-height: 24px;
      }
    }
    .div1 {
     span {
       h2 {
         .line {
           display: inline-block;
           width: 3px;
           height: 15px;
           transform: translateY(2px);
           background-color: #1b1a19;
           margin-right: 5px;
         }
       }
     }

    }
  }

</style>