<template>
  <div>
    <van-swipe-cell ref="swipe" :right-width="120" v-for="(item,index) in list" :key="index" :on-close="onClose">
      <div class="slide-item" @click="goodsDetail(item.goods_id,index)" :class="{' border-1px':index<list.length-1}">
        <div v-if="edit" class="checkbox" @click.stop="">
          <ds-checkbox v-model="item.checked"></ds-checkbox>
        </div>
        <div class="slide-head">
          <img :src="item.affiliated.img_url" alt="">
        </div>
        <div class="slide-content">
          <div class="title">{{item.goods_name}}</div>
          <div class="moreny">RMB {{item.goods_price}}</div>
          <div class="tag" v-if="item.affiliated">
            <span>{{item.affiliated.is_new==='0'?'二手':'全新'}}</span>
            <span>{{item.affiliated.delivery_time}}日发货</span>
          </div>
          <div class="round" @click.stop.prevent="open(index)">...</div>
        </div>
      </div>
      <div class="btn-box" slot="right">
        <div class="item" @click="addordel(item.goods_id)">

          <i slot="icon" class="iconfont icon-jiahao"></i>
          <span class="title">对比</span>
        </div>
        <div class="item" @click="addCart(item.goods_id)">

          <i slot="icon" class="iconfont icon-jiarugouwuche"></i>
          <span class="title">购物车</span>
        </div>
      </div>
    </van-swipe-cell>
  </div>
</template>

<script>
import { SwipeCell } from 'vant'

const SWIPE_NATIVE_WIDTH = -120
export default {
  name: 'swipe-box',
  components: {'van-swipe-cell': SwipeCell},
  data () {
    return {}
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  created () {},
  mounted () {},
  methods: {
    onClose (clickPosition, instance) {
      switch (clickPosition) {
        case 'outside':
          instance.close()
          break
        case 'cell':
          instance.close()
          break
        case 'right':
          instance.close()
          break
        default:
          break
      }
    },
    goodsDetail (id, index) {
      let instance = this.$refs.swipe[index]
      if (instance.offset === SWIPE_NATIVE_WIDTH) {return}
      if (this.$route.name === 'diamondDetail') {
        this.$router.push({path: '/diamondDetailtwo', query: {goods_id: id}})
      } else {
        this.$router.push({path: '/diamondDetail', query: {goods_id: id}})
      }
    },
    open (index) {
      let instance = this.$refs.swipe[index]
      if (instance.offset === SWIPE_NATIVE_WIDTH) {
        instance.close()
      } else {
        instance.open()
      }
    },
    addordel (id) {
      this.$emit('addordel', id)
    },
    addCart (id) {
      this.$emit('addCart', id)
    },
  },

}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/mixin';
@import '../../../assets/css/icon';

.slide-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: pxTorem(10) 0;
  font-size: pxTorem(26);
  box-sizing: border-box;
  color: #2a2a2a;
  background: #fff;
  .checkbox {
    margin-left: pxTorem(20);
  }
  &:last-child::after {
    display: none;
  }
  .slide-head {
    width: pxTorem(90);
    height: pxTorem(90);
    overflow: hidden;
    margin: pxTorem(20);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .slide-content {
    padding: 0 pxTorem(20);
    line-height: 1.6;
    overflow: hidden;
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .moreny {
      font-size: pxTorem(30);
      color: #bd081c;
    }
    .tag {
      margin-top: pxTorem(5);
      span {
        padding: pxTorem(3) pxTorem(8);
        margin-right: pxTorem(10);
        border-radius: pxTorem(8);
        border: solid 1px #d8d8d8;
        color: #4b4b4b;
        font-size: pxTorem(22);
      }
    }
    .round {
      position: absolute;
      font-size: pxTorem(40);
      right: 0;
      bottom: 0;
      padding: pxTorem(20);
      color: #ababab;
    }
  }
}

.btn-box {
  width: pxTorem(240);
  height: 100%;
  @include fja();
  .item {
    height: 100%;
    flex: 1;
    @include fja();
    flex-direction: column;
    &:first-child {
      background-color: #f24618;
    }
    &:last-child {
      background-color: #bd081c;
    }
    .title {
      color: #fff;
      font-size: pxTorem(28);
      padding-top: pxTorem(14);
    }
    .iconfont {
      font-size: pxTorem(50);
      color: #fff;
    }
  }
}
</style>
