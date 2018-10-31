<script>

import Lv from '../../components/uiModule/DiamondsLv/DiamondsLv'
import Interval from '../../components/uiModule/Interval/Interval'
import { GoodsDetail, GoodsList, Price, CartAdd, CartCount, FavoritesAdd, FavoritesFel } from '../../assets/js/api'
import { shape } from '../../utils/currency'
import { mapMutations } from 'vuex'
import { CONTRASTLIST, ADD_CARTLIST, TEMPORARY_INFO } from '../../store/mutations/mutations-types'
import { Swipe, SwipeItem } from 'vant'
import SwipeBox from '../../components/module/SwipeCell'

export default {
  data () {
    return {
      headStatus: false,
      footerStatus: true,
      sectionStatus: true,
      posY: 0,
      off: false,
      List: [],
      goods_id: '',
      goodsList: [],
      affiliated: {},
      goods_info: {},
      inlay_commend_list: [],
      level: 0,
      cartListLength: '',
      is_favorate: false,
      store_info: {},
      goods_image: '',
      items: [],
      current_index: 0,
      opciton: {
        valSatus: true,
        clickable: false,
        width: '8rem',
        processStyle: {
          'display': 'none'
        },
        tooltip: 'always',
        formatter: '¥{value}',
        tooltipStyle: {
          'background': 'none',
          'border': 'none',
          'marginTop': '-18px',
          'color': '#bd081c',
          'fontSize': '0.36rem'
        },
        sliderStyle: {
          'top': '-0.74rem',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'background': 'none',
          'boxShadow': 'none'
        }
      },
      myScroll: null
    }
  },
  created () {
    let {goods_id} = this.$route.query
    this.goods_id = goods_id
  },
  mounted () {
    setTimeout(() => {
      this.goodDetail(this.goods_id)
      this.getGoddsList()
      if (this.$store.state.userinfo) {
        this.level = this.$store.state.userinfo.level
      }
      this.scrollInt()
    }, 200)
  },
  methods: {
    ...mapMutations([CONTRASTLIST, ADD_CARTLIST, TEMPORARY_INFO]),

    onChange (current) {
      this.current_index = current
    },
    linkre (url) {
      this.$router.replace({name: url})
    },
    link (name) {
      this.$router.push({
        name: name
      })
    },
    detail (url, report_no) {
      this.$router.push({path: url, query: {report_no}})
    },
    lnlayService () {
      this.$router.push({name: 'lnlayService'})
    },
    cutoffDetails (goodsId) {
      this.$router.push({path: '/cutoffDetails', query: {goods_id: goodsId}})
    },
    certificateQuery (num) {
      this.$router.push({path: '/certificateQuery', query: {num}})
    },
    async goodDetail (goods_id) {
      let json = await this.$http.get(GoodsDetail, {goods_id}, {show: true, type: 'mini'})
      let banners = json.datas.goods_image
      banners.forEach((item, index, arr) => {
        this.items.push({image: item})
      })
      let {affiliated, goods_info, store_info, goods_image, is_favorate} = json.datas;
      [this.affiliated, this.goods_info, this.store_info, this.goods_image, this.is_favorate] = [affiliated, goods_info, store_info, goods_image, is_favorate]
      this.inlay_commend_list = json.datas.inlay_commend_list
      this.goodsList.push(this.affiliated)
      this.sectionVal(this.affiliated.report_no)
    },
    async getGoddsList () {
      let json = await this.$http.get(GoodsList, {type: 'recommend'}, {})
      if (json.code === 200) {
        this.List = json.datas.goods_list
      }
    },
    async sectionVal (num) {
      let json = await this.$http.get(Price, {report_no: num, color_type: '', is_new: ''}, {})
      if (json.code === 200 && json.datas.low !== 0) {
        let low = parseInt(json.datas.low)
        let high = parseInt(json.datas.high)
        let val = parseInt((high - low) / 5)
        let min = low - val
        let max = high + val
        this.opciton.min = min
        this.opciton.max = max
        this.opciton.value = low + 200
        this.opciton.section = {
          minSectionVal: low,
          maxSectionVal: high
        }
      } else {
        this.sectionStatus = false
      }
    },
    async addCart (index) {
      if (!index) {return}
      let json = await this.$http.post(CartAdd, {
        post: {
          quantity: 1,
          goods_id: index
        }
      }, {show: true, type: 'mini'})
      if (json.code !== 200) {
        // this.$toast({
        //   message: json.datas.error,
        //   position: 'bottom'
        // })
      } else {
        this.$toast({
          message: '加入成功',
          position: 'bottom'
        })
        this.cartLength()
      }
    },
    async favorate () {
      let url = this.is_favorate ? FavoritesFel : FavoritesAdd
      let obj = this.is_favorate ? {fav_id: this.goods_id} : {goods_id: this.goods_id}
      let json = await this.$http.post(url, {post: obj}, {}, {
        show: true,
        type: 'mini'
      })
      if (json.code === 200) {
        this.is_favorate = !this.is_favorate
      }
    },
    addordel (id) {
      let item = this.goodsList.filter((i) => i.goods_id === id)[0]
      this[CONTRASTLIST](item)
    },
    linkList () {
      let {goods_name, goods_price, service_price, goods_id} = this.goods_info
      let {is_new, delivery_time, img_url} = this.affiliated
      let obj = {goods_name, img_url, goods_price, service_price, is_new, delivery_time, goods_id}
      this
      this[TEMPORARY_INFO](obj)
      this.$router.push({path: '/lnlayService'})
    },
    async cartLength () {
      if (this.$store.state.key) {
        let json = await this.$http.post(CartCount, {}, {})
        this.cartListLength = json.datas.cart_count
      }
    },
    shapeText (str) {
      return shape(str)
    },
    complaintAsk (goods_id) {
      this.$router.push({path: '/complaintAsk', query: {goods_id}})
    },
    boxStatus () {
      this.off = !this.off
    },
    kkc () {
      if (this.headStatus) {
        this.headStatus = false
      }
    },
    silderChange (val) {
      this.opciton.value = val
    },
    headOff () {
      this.headStatus = !this.headStatus
    },
  },
  components: {
    'vueSlider': () => import('../../components/module/Silder/Silder.vue'),
    'head-modal': () => import('../../components/uimodule/HeadModal/HeadModal.vue'),
    'van-swipe-item': SwipeItem,
    'van-swipe': Swipe,
    'swipe-box': SwipeBox,
    Lv,
    Interval,
  },
  computed: {
    contrastLength () {
      if (!this.$store.state.contrastList.list) return 0
      return this.$store.state.contrastList.list.length
    },
    favorateColor () {
      let is_favorate = this.is_favorate
      return is_favorate ? '#bd081c' : '#666'
    },
    favorateName () {
      let is_favorate = this.is_favorate
      return is_favorate ? 'icon-shoucang' : 'icon-xin-xian'
    }
  },
  watch: {
    is_favorate (val) {
      if (val) {
        let num = Number(this.goods_info.goods_collect)
        this.goods_info.goods_collect = num += 1
      } else {
        this.goods_info.goods_collect -= 1
      }
    }
  }
}
</script>

