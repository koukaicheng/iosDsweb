<template>
  <div class="">
    <ts-header back title="估价" rightIcon="icon-fenxiang" @headerEvent="share"></ts-header>
    <page>
      <div class="wrapper-box">
        <refresh off>
        <div class="box-top-list">
          <div class="top-list-item">
            <span>证书类型</span>
            <div class="top-list-right">
              <span class="list-right-tag red">GIA</span>
            </div>
          </div>
          <div class="top-list-item">
            <span style="flex-shrink: 0">证书编号</span>
            <div class="top-list-right color" style="flex: 1">
              <input type="number" maxlength="10" v-model="fromData.report_no" placeholder="请输入证书编号">
              <div class="btn" @click="serach" style="flex-shrink: 0">确定</div>
            </div>
          </div>
          <ul class="center-list-item" :class="isBlock?'block':'none'">

             <div class="tip">{{report_tip}}</div>
            <li>
              <span>形状</span>
             <div @click="pickerStatus('shape')">
               <span>{{textInfo.shape}}</span>
               <icon font-name="icon-jiantou-copy"></icon>
             </div>
            </li>
            <li>
              <span>重量</span>
              <div>
                <input type="number" v-model="fromData.carat_weight">ct
              </div>
            </li>
            <li>
              <span>颜色</span>
              <div @click="pickerStatus('color')">
                <span>{{textInfo.color}}</span>
                <icon font-name="icon-jiantou-copy"></icon>
              </div>
            </li>
            <li>
              <span>净度</span>
              <div @click="pickerStatus('clarity')">
                <span>{{textInfo.clarity}}</span>
                <icon font-name="icon-jiantou-copy"></icon>
              </div>
            </li>
            <li>
              <span>切工</span>
              <div @click="pickerStatus('cut')">
                <span>{{textInfo.cut}}</span>
                <icon font-name="icon-jiantou-copy"></icon>
              </div>
            </li>
            <li>
              <span>抛光</span>
              <div @click="pickerStatus('polish')">
                <span>{{textInfo.polish}}</span>
                <icon font-name="icon-jiantou-copy"></icon>
              </div>
            </li>
            <li>
              <span>对称</span>
              <div @click="pickerStatus('symmetry')">
                <span>{{textInfo.symmetry}}</span>
                <icon font-name="icon-jiantou-copy"></icon>
              </div>
            </li>
            <li>
              <span>荧光</span>
              <div @click="pickerStatus('fluorescence')">
                <span>{{textInfo.fluorescence}}</span>
                <icon font-name="icon-jiantou-copy"></icon>
              </div>
            </li>
          </ul>
          <div class="top-list-item" @click="pickerStatus('color_type')">
            <span>奶绿咖</span>
            <div class="top-list-right color">
              {{textInfo.color_type}}
            </div>
            <i class="iconfont icon-jiantou"></i>

          </div>
          <div class="top-list-item" @click="pickerStatus('is_new')">
            <span>新旧</span>
            <div class="top-list-right color">
              {{textInfo.is_new}}
            </div>
            <i class="iconfont icon-jiantou"></i>
          </div>
          <div class="button-box">
            <ds-button type="primary" size="large" :disabled="!valid"  @click="submit">估价</ds-button>
            <!--<button @click="submit"></button>-->
            <span class="little-button" @click="link">证书查询》</span>
          </div>
        </div>


        <div v-if="isShow" class="slide-box">
          <span>估价结果</span>
          <ul class="slide-wrap">
            <li class="slide-item">
              <div class="slide-left">
                <span>￥{{list.low}}</span>
              </div>
              <div class="slide-left-bottom"></div>
            </li>
            <li class="slide-item">
              <div class="slide-right">
                <span>￥{{list.high}}</span>
              </div>
              <div class="slide-right-bottom"></div>
            </li>
          </ul>
          <span class="explain">估价结果包含交易产生的税费</span>
        </div>

        <div v-if="isShow" class="share-button-box">
          <button class="share-button" @click="share">分享 (积分+1)</button>
        </div>
        <!--<p v-if="isShow" class="explain">结果不正确，-->
          <!--<span>反馈</span>-->
        <!--</p>-->
        <!--<ds-head name="估价参考" :more="false" moreName="" tcolor="#2c2c2c"></ds-head>-->
        <!--<slide :list="goodsList"></slide>-->
        </refresh>
      </div>
      <gender-picker @complete="setGender" v-model="genderVisible" :options="options"></gender-picker>
      <!--<picker ref="naikalv" :values="chukou" @confirm="confirmChukou"></picker>-->
      <!--<picker ref="xinjiu" :values="ershou" @confirm="confirmErshou"></picker>-->
    </page>
  </div>
</template>
<script>
import Picker from '../../components/module/Picker/Picker'
import { EvaluatePrice, GoodsList,Search } from '../../assets/js/api'
import { shape } from '../../utils/currency.js'
import {shareMixins} from '../../utils/mixins'
import verify from '../../utils/verify'
export default {
  name:'evaluation',
  data() {
    return {
      fromData: {color_type: 0, is_new: 0, report_no: '',carat_weight:'',shape:'',color:'',clarity:'',cut:'',symmetry:'',polish:'',fluorescence:''},
      list: {},
      isShow: false,
      isBlock:false,
      report_tip:'请核对证书信息',
      genderVisible:false,
      pickerKey:'',
      goodsList: [],
      textInfo:{
        shape:'',
        color:'',
        clarity:'',
        cut:'',
        symmetry:'',
        polish:'',
        fluorescence:'',
        color_type:'无',
        is_new:'二手'
      },
      options: [],
      optiosTest:{
        color_type:[{value: 0, text: '无'}, {value: 1, text: '奶'},{value: 2, text: '绿'}, {value: 3, text: '咖'},{value: 4, text: '多项'}],
        is_new: [{value: 0, text: '二手'},{value: 1, text: '全新'}],
        shape: [{text: '圆形', value: 'round'}, {text: '公主方', value: 'princess'}, {text: '祖母绿', value: 'emerald'}, {text: '阿斯切', value: 'asscher'}, {text: '马眼形', value: 'marquise'}, {text: '椭圆', value: 'oval'}, {text: '雷迪恩', value: 'radiant'}, {text: '梨形', value: 'pear'}, {text: '心形', value: 'heart'}, {text: '垫形', value: 'cushion'}, {
          text: '其他',
          value: 'other'
        }],
        color: [{text: 'L', value: 'L'}, {text: 'K', value: 'K'}, {text: 'J', value: 'J'}, {
          text: 'I',
          value: 'I'
        }, {text: 'H', value: 'H'}, {text: 'G', value: 'G'}, {text: 'F', value: 'F'}, {
          text: 'E',
          value: 'E'
        }, {text: 'D', value: 'D'}],
        clarity: [{text: 'SI2', value: 'SI2'}, {text: 'SI1', value: 'SI1'}, {text: 'VS2', value: 'VS2'}, {
          text: 'VS1',
          value: 'VS1'
        }, {text: 'VV2', value: 'VV2'}, {text: 'VV1', value: 'VV1'}, {text: 'IF', value: 'IF'}, {
          text: 'FL',
          value: 'FL'
        }],
        cut: [{text: 'F', value: 'F'}, {text: 'G', value: 'G'}, {text: 'VG', value: 'VG'}, {
          text: 'EX',
          value: 'EX'
        }, {text: '其他', value: 'other'}],
        symmetry: [{text: 'F', value: 'F'}, {text: 'G', value: 'G'}, {text: 'VG', value: 'VG'}, {
          text: 'EX',
          value: 'EX'
        }, {text: '其他', value: 'other'}],
        polish: [{text: 'F', value: 'F'}, {text: 'G', value: 'G'}, {text: 'VG', value: 'VG'}, {
          text: 'EX',
          value: 'EX'
        }, {text: '其他', value: 'other'}],
        fluorescence: [{text: 'VS', value: 'VS'}, {text: 'S', value: 'S'}, {text: 'M', value: 'M'}, {
          text: 'F',
          value: 'F'
        }, {text: 'N', value: 'N'}, {text: '其他', value: 'other'}],
      }
    }
  },
  mixins:[shareMixins],
  created() {
    let {report_no} = this.$route.query
    if(report_no){
      this.fromData.report_no = report_no
    }
    this.getGoddsList()
  },
  mounted() {},
  computed:{
    valid () {
      return verify.requiredObjProp(this.fromData).isValid
    },
  },
  methods: {
    share(){
      if($prod){
        this.shareHref()
      }
    },
    link(){
      this.$router.push({path:'/certificateQuery',query:{num:this.fromData.report_no}})
    },
    shapeData(str) {
      return shape(str)
    },
    pickerFn(type) {
      if (type === 0) {
        this.$refs.naikalv.open()
      } else {
        this.$refs.xinjiu.open()
      }
    },
    // confirmChukou(val) {
    //   this.fromData.color_type = val
    // },
    // confirmErshou(val) {
    //   this.fromData.is_new = val
    // },
    pickerStatus(key){
      this.pickerKey = key
      this.options=this.optiosTest[key]
      setTimeout(() => {
        this.genderVisible = true
      }, 200)
    },
    setGender(val){
      this.textInfo[this.pickerKey] = val.text
      this.fromData[this.pickerKey] = val.value
    },
   async serach(){
      if(this.fromData.report_no&&this.fromData.report_no.length===10){
        let json = await this.$http.get(Search, {report_no: this.fromData.report_no}, {show: true})
        if(json.code===200){
          let {color, carat_weight, shape, clarity, cut, symmetry, polish, fluorescence,report_no,measurements} = json.datas
          let obj = {color, shape, clarity, cut, symmetry, polish, fluorescence}
          let textObj = {}
          for(let key in obj){
            textObj[key] = this.optiosTest[key].filter((i)=>i.value===obj[key])[0].text
          }
          Object.assign(this.fromData,obj,{carat_weight})
          Object.assign(this.textInfo,textObj)
          this.isBlock= true
        }else{
          this.isBlock= true
          this.report_tip = '未查询到该证书信息，请填写信息'
        }
      }else{
        this.$toast('请正确填写证书编号')
      }
    },
    submit() {
      this.getEvaluatePrice()
    },
    async getEvaluatePrice() {
      let EvaluatePriceData = await this.$http.post(EvaluatePrice, {post:this.fromData},{show:true,type:'mini'})
      if (EvaluatePriceData.code === 200) {
        this.list = EvaluatePriceData.datas
        this.isShow = true
        if(typeof EvaluatePriceData.datas==='string'){
          this.$toast(EvaluatePriceData.datas)
        }
      }
    },
    // DOTO 估价参考  ，缺少参数
    async getGoddsList() {
      let goodsList = await this.$http.get(GoodsList, {})
      this.goodsList = goodsList.datas.goods_list
    }
  },
  components: {
    Picker,
    'gender-picker': () => import('../../components/module/GenderPicker/GenderPicker'),
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin';
@import '../../assets/css/icon.css';
.wrapper-box {
  background: #f5f5f5;
  .box-top-list {
    font-size: pxTorem(28);
    margin: pxTorem(16);
    padding: 0 pxTorem(10);
    color: #2c2c2c;
    background: #fff;
    border-radius: pxTorem(6);
    .top-list-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: pxTorem(44);
      padding-right: pxTorem(65);
      line-height: pxTorem(95);
      border-bottom: 1px #e0e0e0 solid;
      .icon-jiantou {
        position: absolute;
        right: pxTorem(16);
        top: 0;
        bottom: 0;
        margin: auto;
        transform: rotate(-90deg);
        font-size: pxTorem(32);
      }
      .top-list-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        input {
          border: none;
          text-align: right;
          padding-right: pxTorem(20);
        }
        .btn{
          padding: pxTorem(6) pxTorem(10);
          text-align: center;
          height: pxTorem(40);
          line-height: pxTorem(34);
          font-size: pxTorem(20);
          border: 1px #d8d8d8 solid;
          border-radius: 0.10667rem;
        }
        .list-right-tag {
          display: block;
          width: pxTorem(132);
          height: pxTorem(48);
          line-height: pxTorem(48);
          text-align: center;
          border-radius: pxTorem(8);
          border: 1px #bcbcbc solid;
          font-size: pxTorem(26);
          color: #666;
          margin-left: pxTorem(30);
          &.red {
            color: #bd081c;
            border-color: #bd081c;
          }
          &.color {
            color: #2c2c2c;
          }
        }
      }
    }
    .button-box {
      position: relative;
      padding: pxTorem(15) 0;
      text-align: center;
      button {
        width: pxTorem(280);
        height: pxTorem(80);
        margin: 0 auto;
        border-radius: pxTorem(8);
        font-size: pxTorem(30);
        color: #fff;
        border: none;
      }
      .little-button {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        padding-right: pxTorem(41);
        font-size: pxTorem(24);
        color: #bd081c;
        text-decoration: underline;
        line-height: pxTorem(115);
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .4s;
  }

  .fade-enter, .fade-leave-to {
    height: 0;
  }
  .center-list-item {
    .tip{
      height: pxTorem(46);
      line-height: pxTorem(46);
      text-align: center;
      font-size: pxTorem(24);
    }
    font-size: pxTorem(24);
    margin: 0  pxTorem(48);
    color: #999;
    background: #fff;
    transform: translate3d(0, 0, 0);
    border-top-left-radius: pxTorem(6);
    border-top-right-radius: pxTorem(6);
    overflow: hidden;
    position: relative;
    transition: all .2s;
    &.block{
      height: pxTorem(526);
    }
    &.none{
      height: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: pxTorem(60);
      line-height: pxTorem(60);
      border-bottom: 1px #e0e0e0 solid;
      box-sizing: border-box;
      &:last-child {
        border: none;
      }
      span:last-child {
        color: #2c2c2c;
      }
      input{
        width: pxTorem(80);
        border: none;
        font-size: pxTorem(20);
      }
    }
  }
  .slide-box {
    text-align: center;
    padding: 0 pxTorem(60);
    background: #fff;
    margin: 0 pxTorem(16);

    .explain {
      font-size: pxTorem(24);
      color: #a3a3a3;
      font-weight: 100;
    }
    span {
      font-size: pxTorem(36);
      color: #bd081c;
      font-weight: bold;
    }
    .slide-wrap {
      display: flex;
      width: 100%;
      height: pxTorem(10);
      background: #cfcfcf;
      margin-top: pxTorem(22);
      margin-bottom: pxTorem(50);
      .slide-item {
        position: relative;
        width: 100%;
        height: 100%;
        .slide-left,
        .slide-right {
          position: absolute;
          width: 50%;
          height: 100%;
          background: #bd081c;
          z-index: 10;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            width: pxTorem(20);
            height: pxTorem(20);
            border-radius: 50%;
            background: #bd081c;
          }
          span {
            position: absolute;
            display: flex;
            justify-content: center;
            width: 1px;
            top: pxTorem(26);
            font-size: pxTorem(28);
            font-weight: 100;
          }
          &.slide-left {
            right: 0;
            span {
              left: 0;
            }
            &:after {
              left: pxTorem(-10);
            }
          }
          &.slide-right {
            left: 0;
            span {
              right: 0;
            }
            &:after {
              right: pxTorem(-10);
            }
          }
        }
        .slide-left-bottom,
        .slide-right-bottom {
          position: absolute;
          width: 60%;
          height: 100%;
          //   background: blue;
          &.slide-left-bottom {
            right: 0;
          }
          &.slide-right-bottom {
            left: 0;
          }
        }
      }
    }
  }
  .share-button-box {
    padding: 0 pxTorem(25);
    padding-top: pxTorem(31);
    text-align: center;
    background: #fff;
    margin: 0 pxTorem(16);
    padding-bottom: pxTorem(16);
    .share-button {
      width: 100%;
      height: pxTorem(80);
      background: none;
      border: 2px #bd081c solid;
      border-radius: pxTorem(8);
      font-size: pxTorem(28);
      color: #bd081c;
    }
  }
  .explain {
    font-size: pxTorem(26);
    padding: pxTorem(20);
    text-align: center;
    span {
      color: #bd081c;
    }
  }
}
</style>
