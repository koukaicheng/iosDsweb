<template>
  <div class="">
    <ts-header back title="足迹" :right-text="list.length >0?(isEdit?'完成':'编辑'):''" right-color="#030303"
               @headerEvent="headerEvent"></ts-header>
    <page>
      <div class="wrapper">
        <Refresh @refresh="refresh" @loadmore="loadmore($event)">
          <swipe-box :edit="isEdit" :list="list" @addordel="addordel" @addCart="addCart">
          </swipe-box>
          <no-data v-show="list.length===0" tip="您还没有足迹，先去看看钻石吧"></no-data>
        </Refresh>
      </div>
    </page>
    <div v-if="isEdit" class="footer">
      <div class="checkbox" @click="selection">
        <ds-checkbox v-model="checked"></ds-checkbox>
        <span class="word">全选</span>
      </div>
      <div class="button" @click="deletes">
        <button>删除</button>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadMixins } from '../../utils/mixins.js'
import { BrowseList, BrowseDel, CartAdd } from '../../assets/js/api'
import NoData from '../../components/uiModule/NoData/noData'
import SwipeBox from '../../components/module/SwipeCell'
import { CONTRASTLIST } from '../../store/mutations/mutations-types'
import { mapMutations } from 'vuex'

export default {
  name: 'footprint',
  data () {
    return {
      list: [],
      isEdit: false,
    }
  },
  created () {},
  mixins: [uploadMixins],
  methods: {
    ...mapMutations([CONTRASTLIST]),
    addordel (id) {
      let item = this.list.filter((i) => i.goods_id === id)[0]
      let obj = Object.assign({store_name: item.store_name}, item.affiliated)
      this[CONTRASTLIST](obj)
    },
    async addCart (index) {
      let json = await this.$http.post(CartAdd, {
        post: {
          quantity: 1,
          goods_id: index
        }
      }, {show: true, type: 'mini'})
      if (json.code !== 200) {
        this.$toast({
          message: json.datas.error,
          position: 'bottom'
        })
      } else {
        this.$toast({
          message: '加入成功',
          position: 'bottom'
        })
      }
    },
    async requestUploadData (type) {
      let getBrowseList = await this.$http.post(BrowseList, {
        get: {
          page: 10,
          curpage: this.a_page // 必须
        }
      })
      // 必须
      this._mixinsRequestData(
        type,
        getBrowseList,
        getBrowseList.datas.goodsbrowse_list
      )
    },
    // 删除足迹
    async getBrowseDel (ids) {
      let getBrowseDel = await this.$http.post(BrowseDel, {
        post: {
          ids
        }
      })
      if (getBrowseDel.code !== 200) {
        return
      }
      this.$toast('删除成功')
      this.list = this.list.filter((d, i) => d.checked !== true)
      if (this.list.length === 0) {
        this.isEdit = false
      }
    },
    selection () {
      if (this.checked) {
        this.list.forEach((item) => (item.checked = false))
      } else {
        this.list.forEach((item) => (item.checked = true))
      }
    },
    headerEvent () {
      if (this.isEdit) {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
    },
    deletes () {
      let orderList = []
      let list = this.list.filter((d, i) => d.checked === true)
      list.forEach((item) => {
        orderList.push(item.goods_id)
      })
      this.$modal({
        title: '提示',
        message: `是否删除足迹？删除后不可恢复。`
      }).then(res => {
        if (res === 'confirm') {
          this.getBrowseDel(orderList)
        }
      })
    }
  },
  computed: {
    checked: {
      get () {
        return this.list.length > 0 && this.list.every(i => i.checked === true)
      },
      set (val) {}
    }
  },
  watch: {},
  components: {
    NoData,
    'swipe-box': SwipeBox
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin';

.wrapper {
  background: #fff;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 pxTorem(30);
  width: 100%;
  height: pxTorem(100);
  .checkbox {
    display: flex;
    align-items: center;
    font-size: pxTorem(26);
    color: #2a2a2a;
    .word {
      padding-left: pxTorem(10);
    }
  }
  .button button {
    width: pxTorem(152);
    height: pxTorem(60);
    border: none;
    border-radius: pxTorem(8);
    background: #bd081c;
    color: #fff;
    font-size: pxTorem(34);
  }
}
</style>
