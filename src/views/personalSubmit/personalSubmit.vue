<template>
  <div class="">
    <ts-header title="钻石信息" back></ts-header>
    <page>
      <div class="wrap">
        <Refresh off>
          <div class="tip-header border-1px">本平台只出售GIA分级的钻石</div>
          <edit-personal :info="info" :textinfo="textinfo"></edit-personal>
          <div class="autoHeight">
            <div class="content-item">
              <span class="name">添加照片</span>
              <span class="tip">请依照范例添加钻石照片</span>
              <div class="look" @click="previewImage">
                查看范例
              </div>
            </div>
            <ul class="content">
              <li class="img" v-for="(item,index) in localImage" :key="index">
                <div class="img-box">
                  <div class="img-item">
                    <icon font-name="icon-shanchu21" size="40" @click="deleteImg(index)"></icon>
                    <img :src="item.url" alt="">
                  </div>
                </div>
              </li>
              <li class="img">
                <div class="img-box">
                  <div class="img-item add" @click="prod===true?addImg($event):''">
                    <input v-if="!prod" ref="uload" type="file" id="upload"
                           style="position:absolute;width: 100%;height: 100%;opacity: 0"
                           accept="image/png, image/jpeg, image/gif, image/jpg"
                           @change="addImg($event,'image_all')">
                    <icon font-name="icon-jiahao" size="70" color="#c3c3c3"></icon>
                  </div>
                </div>
              </li>
            </ul>
            <div class="footer-tip">
              出售钻石时请将购买凭证及发票与钻石一同送检
            </div>
          </div>
          <div class="submit">
            <ds-button type="primary" size="large" @click="next()" :disabled="!valid">下一步</ds-button>
          </div>
        </Refresh>

      </div>
    </page>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</template>
<script>
import editPersonal from '../../components/uiModule/EditPersonal/EditPersonal'
import { SUB_DIAMONDS_INFO } from '../../store/mutations/mutations-types'
import { cloneObj } from '../../utils/currency'
import mxins from './uploadImg'

export default {
  data () {
    return {
      info: {
        cate_id: 560,
        cate_name: '珠宝手表 >钻石饰品 >裸钻',
        g_name: '1234阿萨德发送到123123',
        b_id: 0,
        g_price: 1234,
        g_marketprice: 1234,
        g_costprice: 1234,
        g_discount: 100,
        image_all: [],
        g_storage: 1,
        g_alarm: 1,
        g_body: 1234,
        m_body: 12345,
        starttime: '2017-03-27',
        starttime_H: '00',
        starttime_i: '05',
        province_id: 0,
        freight: 0,
        plate_top: 0,
        plate_bottom: 0,
        g_freight: 0,
        g_vat: 0,
        g_state: 1,
        g_commend: 1,
        is_gv: 0,
        g_vlimit: 0,
        g_vinvalidrefund: 0,
        sup_id: 0,
        type_id: 0,
        delivery_time: 15, //送检时间
        report_no: '', //GIA报告编号
        is_new: null,  //1新  0二手
        inclusion: null, //内涵物
        color_type: 0, //奶绿咖
        area: 1, // 地区  境内:1  境外:2
        city_id: '', //城市id
        is_inlay: null, //镶嵌  0未镶嵌 1镶嵌
        inlay_deal: 1, //镶嵌处理 0出售 1寄回
        voucher: null, //凭证 1境外发票 2境内发票 3其他
        bid: 1, //回收商出价 0不允许 1允许
        carat_weight: '',//重量
        shape: '',//钻石形状
        color: '',//颜色
        clarity: '',//净度
        cut: '',//切工
        symmetry: '', //对称
        polish: '',//抛光
        fluorescence: '',//荧光
        measurements: '0.1*0.1*0.1'
      },
      textinfo: {
        textData: {
          is_new: '',
          inclusion: '',
          delivery_time: '',
          color_type: '',
          is_inlay: '',
          inlay_deal: '',
          voucher: '',
          bid: '',
          city: '',
          cityYC: '',
          shape: '',
          color: '',
          clarity: '',
          cut: '',
          symmetry: '',
          polish: '',
          fluorescence: '',
        },
        report_no: ''
      },
      localImage: [],
    }
  },
  created () {
    if (this.$store.state.subDiamondsInfon) {
      let info = cloneObj(this.$store.state.subDiamondsInfon.info)
      let textinfo = cloneObj(this.$store.state.subDiamondsInfon.text)
      let img_str = this.$store.state.subDiamondsInfon.localImage
      let localImage = cloneObj(img_str);
      [this.info, this.textinfo, this.localImage] = [info, textinfo, localImage]
    }
  },
  mixins: [mxins],
  methods: {
    next () {
      this.$store.commit(SUB_DIAMONDS_INFO, {info: this.info, text: this.textinfo, localImage: this.localImage})
      setTimeout(this.$router.goBack(), 200)
    },
  },
  components: {
    editPersonal,
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/mixin";
@import "../../assets/css/variables";
@import "../../assets/css/upload";

.wrap {
  background: #fff;
  .tip-header {
    color: $themeColor;
    font-size: pxTorem(24);
    text-align: center;
    padding: 0.4rem 0.28rem;
    position: relative;
  }
  .submit {
    margin-top: 0.4rem;
    padding: 0 pxTorem(25) 0.6rem pxTorem(25);
  }
}

.autoHeight {
  padding: 0 pxTorem(25);
}

</style>
