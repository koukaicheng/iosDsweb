<template>
  <div class="group">
    <ds-cell theme="list" title="证书类型" isLink mode="edit" v-model="text" readonly="readonly" direction></ds-cell>

    <!--<ds-cell theme="list" type="number" title="证书编号" tip="请填写真实编号" @toBlur="reportNum"-->
    <!--v-model="info.report_no"></ds-cell>-->
    <!--<div class="report-data border-1px" :class="textinfo.SearchData.carat_weight!==''?'block':'none'">-->
    <!--<div class="item">-->
    <!--<div class="text">形状圆形</div>-->
    <!--<div class="text">重量{{textinfo.SearchData.carat_weight}}克拉</div>-->
    <!--<div class="text">净度 {{textinfo.SearchData.clarity}}</div>-->
    <!--</div>-->
    <!--<div class="item">-->
    <!--<div class="text">抛光{{textinfo.SearchData.polish}}</div>-->
    <!--<div class="text">对称{{textinfo.SearchData.symmetry}}</div>-->
    <!--<div class="text">切工{{textinfo.SearchData.cut}}</div>-->
    <!--</div>-->

    <!--<div class="item">-->
    <!--<div class="text">荧光{{textinfo.SearchData.fluorescence}}</div>-->
    <!--<div class="text">尺寸{{textinfo.SearchData.measurements}}</div>-->
    <!--</div>-->
    <!--</div>-->


    <div class="ts-cell-list_">
      <div class="ts-cell-title_">
        <label class="ts-label_">证书编号</label>
      </div>
      <div class="ts-cell-value_">
        <input class="inputVal_" :disabled="reportNumS" v-model="info.report_no" type="search" placeholder="请填写真实编号"/>
        <div v-if="!reportNumS" class="btn" @click="reportNum">确定</div>
      </div>
    </div>

    <div class="report-data border-1px" v-if="!reportNumS" :class="textinfo.textData.color!==''?'block':'none'">
      <div class="tip">{{report_tip}}</div>
      <div class="item">
        <div class="text border-1px">
          <span class="title">重量</span>
          <div class="value">
            <div class="val">
              <input type="number" v-model="info.carat_weight">
            </div>
            <div class="icon_left">
              <span>Ct</span>
            </div>
          </div>
        </div>
        <div class="text border-1px" @click="pickerStatus('shape')">
          <span class="title">形状</span>
          <div class="value">
            <div class="val">{{textinfo.textData.shape}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="text border-1px" @click="pickerStatus('color')">
          <span class="title">颜色</span>
          <div class="value">
            <div class="val">{{textinfo.textData.color}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
        <div class="text border-1px" @click="pickerStatus('clarity')">
          <span class="title">净度</span>
          <div class="value">
            <div class="val">{{textinfo.textData.clarity}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="text border-1px" @click="pickerStatus('cut')">
          <span class="title">切工</span>
          <div class="value">
            <div class="val">{{textinfo.textData.cut}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
        <div class="text border-1px" @click="pickerStatus('polish')">
          <span class="title">抛光</span>
          <div class="value">
            <div class="val">{{textinfo.textData.polish}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="text border-1px" @click="pickerStatus('symmetry')">
          <span class="title">对称</span>
          <div class="value">
            <div class="val">{{textinfo.textData.symmetry}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
        <div class="text border-1px" @click="pickerStatus('fluorescence')">
          <span class="title">荧光</span>
          <div class="value">
            <div class="val">{{textinfo.textData.fluorescence}}</div>
            <div class="icon_left">
              <icon font-name="icon-jiantou-copy"></icon>
            </div>
          </div>
        </div>
      </div>

    </div>
    <ds-cell theme="list" readonly="readonly" title="奶绿咖" isLink mode="edit" v-model="textinfo.textData.color_type"
             direction @click="pickerStatus('color_type')"></ds-cell>
    <ds-cell theme="list" readonly="readonly" title="内含物" isLink mode="edit" tip=" "
             v-model="textinfo.textData.inclusion" direction @click="pickerStatus('inclusion')"></ds-cell>
    <ds-cell theme="list" readonly="readonly" title="所在地" isLink mode="edit" tip=" " v-model="textinfo.textData.city"
             direction @click="sheetVisibleOff "></ds-cell>
    <ds-cell theme="list" readonly="readonly" title="送检时间" isLink mode="edit" tip=" "
             v-model="textinfo.textData.delivery_time" direction
             tipStatus @click="pickerStatus('delivery_time')"></ds-cell>
    <city-choice ref='choice'
                 :active-tab="activeTab"
                 @change="cityChange"></city-choice>
    <gender-picker @complete="setGender" v-model="genderVisible" :options="options"></gender-picker>
    <mt-actionsheet
      :actions="actions2"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>

</template>

<script>
import { AreaList } from '../../../assets/js/api'
import { Actionsheet } from 'mint-ui'
import { submitMixins } from '../../../utils/mixins'

export default {
  name: 'edit-enterprise',
  props: {
    edit: {
      type: Boolean,
      default: true
    },
    // info:Object,
  },
  data () {
    return {
      actions2: [
        {name: '境内', method: this.cityVal},
        {name: '境外', method: this.abroad}
      ],
      sheetVisible: false,
    }
  },
  mixins: [submitMixins],
  created () {
    this.abroadData()
  },
  methods: {
    sheetVisibleOff () {
      if (!this.edit) return
      this.sheetVisible = true
    },
    abroad () {
      this.pickerStatus('city_id')
    },
    async abroadData () {
      let json = await this.$http.get(AreaList, {foreign: '1'}, {})
      if (json.code === 200) {
        let {area_list} = json.datas
        area_list.forEach((item, index, arr) => {
          this.optiosTest.city_id.push({text: item.area_name, value: item.area_id})
        })
      }
    },
  },
  components: {
    'gender-picker': () => import('../../../components/module/GenderPicker/GenderPicker'),
    'cityChoice': () => import('../../../components/module/CityChoice/CityChoice'),
    'mt-actionsheet': Actionsheet
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/mixin";

.group {
  padding: 0 pxTorem(25);
}

.ts-cell-list_ {
  font-size: .30rem;
  padding: .1005rem .25rem;
  position: relative;
  transform: translate3d(0, 0, 0);
  color: #2E2E2E;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  transition: all .2s;
  &:before {
    height: 1px;
    left: 0;
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    display: block;
    border-bottom: 1px solid #E5E5E5;;
    transform-origin: 0 0;
    transform: scaleY(0.6);
  }
  .ts-cell-title_ {
    flex: none;
    width: 2rem;
    .ts-label_ {
      color: #333;
      display: block;
      white-space: nowrap;
      font-size: 0.38rem;
    }
  }
  .ts-cell-value_ {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      z-index: 50;
      color: #7a7a7a;
      width: 80%;
      text-align: left;
      text-indent: 0.4rem;
      direction: ltr;
      padding-right: .2rem;
      font-size: .30rem;
      height: 0.8rem;
      border: none;
      background: none;
    }
    .btn {
      padding: pxTorem(6) pxTorem(10);
      font-size: pxTorem(20);
      border: 1px #d8d8d8 solid;
      border-radius: 0.10667rem;
    }
  }
}

.report-data {
  padding: 0 pxTorem(22);
  overflow: hidden;
  transition: .2s ease-out;
  .tip {
    padding: pxTorem(8);
    @include fja();
    font-size: pxTorem(24);
  }
  .item {
    @include fja(space-between);
    padding: pxTorem(10) pxTorem(2);
    .text {
      min-width: pxTorem(240);
      padding: pxTorem(6) 0;
      @include fja();
      font-size: pxTorem(24);
      color: #a1a5a8;
      justify-content: space-between;
      .title {
        color: #333;
      }
      .value {
        display: flex;
        .val {
          padding-right: pxTorem(8);
          input {
            width: pxTorem(80);
            border: 1px solid #a6a6a6;
          }
        }
      }
    }
  }
}

.none {
  height: 0;
  border: none;
}

.block {
  height: pxTorem(320);
}
</style>
