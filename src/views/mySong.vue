<template>
  <div class="my">
     <div class="box1">
       <div >私人音乐空间，听我想听的歌</div>
       <el-button @click="loginVis = true" style="background-color: #31c27c;color: #ffffff;margin-left: 300px">立即登陆</el-button>
     </div>
    <img style="width: 98.9vw;height: 100vh;" src="@/assets/img/m.jpg" alt="">
  </div>
</template>

<script>
export default {
name: "mySong",
  computed: {
    loginVis: {
      get(){
        return this.$store.state.loginVis
      },
      set(v){
        this.$store.commit('setLoginVis',v)
      }
    },
  },
}
</script>

<style lang="less" scoped>

  .box1 {
    font-size: 50px;
    color: #ffffff;
    position: absolute;
    left: 450px;
    top: 50%;
    transform: translateY(-10vh);
  }

  .my {
    min-height: 63vh;
  }
</style>