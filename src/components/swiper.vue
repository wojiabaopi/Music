<template>
  <div v-loading="loading"  res="swiper" class="swiper">
    <div class="swiper-item">
      <el-carousel height="350px"  :autoplay="true" arrow="always" @change="colorChange" trigger="click">
        <el-carousel-item  v-for="(item,index) in imgList" :key="index">
          <img :src="item.imageUrl" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>

  </div>
</template>

<script>

export default {
  name: "swiper",
  data() {
    return {
      imgList: [],
      loading: true
    }
  },
    created() {
    this.$http.get('/banner').then(res => {
      if (res.data.code == 200) {
        this.loading = false
        this.imgList = res.data.banners
      } else {
        this.$message({
          center: true,
          message: 'banner数据请求失败',
          type: 'error',
          offset: 200
        })
      }
    })
    // const res = await this.$http.get('/banner')
    //  console.log(res);
   },
  methods: {
    colorChange() {
      const swiper = document.getElementsByClassName('swiper-item')[0]

    }
  }
}
</script>


<style lang="less" scoped>
.swiper {
  width: 100%;
  display: flex;
  z-index: 1;
  margin: 0 auto;
  height: 350px;
  background-image: linear-gradient(#9999a6,#f5f5f5);

  .swiper-item {
    height: 400px;
    width: 1080px;
    margin: 0 auto;

    .el-carousel {
      /deep/ .el-carousel-item {
        img {
          height: 350px;
        }


      }

      /deep/ .el-carousel__button {
        height: 10px !important;
        background-color: #ffffff;
        border: 2px solid #356458;
      }
    }

  }
}


</style>