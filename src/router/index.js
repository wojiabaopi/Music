import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import("@/views/Home")
const Rank = () => import("@/views/rank")
const Songer = () => import("@/views/songer")
const MySong = () => import("@/views/mySong")
const SongSheet = () => import("@/views/songSheet")
const SongSheetDetail = () => import("@/views/songSheetDetail")
const Album = () => import("@/views/album")
const Crank = () => import("@/components/childRank")
const SongerDetail = () => import("@/views/songerDetail")


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: 'crank/:id',
        component: Crank
      },
      {
        path: '',
        redirect: 'crank/' + 19723756
      }
    ]
  },
  {
    path: '/songer',
    component: Songer

  },
  {
    path: '/mysong',
    component: MySong
  },
  {
    path: '/songSheet/:name',
    component: SongSheet
  },
  {
    path: '/songSheetDetail/:id',
    component: SongSheetDetail
  },
  {
    path: '/album/:id',
    component: Album
  },
  {
    path: '/songerDetail/:id',
    component: SongerDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to,from,savedPosition) {
    if(savedPosition){
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
const originalReplace = VueRouter.prototype.push
VueRouter.prototype.push = function push (location){
  return originalReplace.call(this,location).catch(err => err)
}



export default router
