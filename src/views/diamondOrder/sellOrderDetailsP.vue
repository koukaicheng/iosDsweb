<template>
  <div class="">
    <ts-header title="钻石信息" back :rightText="rightText" rightColor="#bd081c" @headerEvent="edit"></ts-header>
    <page>
      <div class="wrap">
        <edit-personal reportNumS :edit="editStatus" :info="info" :textinfo="textinfo"></edit-personal>
        <div class="autoHeight">
          <div class="content-item">
            <span class="name">添加照片</span>
            <span class="tip" v-show="editStatus">请依照范例添加钻石照片</span>
            <div class="look" v-show="editStatus">
              查看范例
            </div>
          </div>
          <ul class="content">
            <li class="img" v-for="(item,index) in localImage" :key="index">
              <div class="img-box">
                <div class="img-item">
                  <icon font-name="icon-shanchu21" size="40" color="#c3c3c3" @click="deleteImg(index)"
                        v-show="editStatus"></icon>
                  <img :src="item.url" alt="">
                </div>
              </div>
            </li>
            <li class="img">
              <div class="img-box">
                <div class="img-item add" v-show="editStatus" @click="prod===true?addImg($event):''">
                  <input v-show="!prod" ref="uload" type="file" id="upload"
                         style="position:absolute;width: 100%;height: 100%;opacity: 0"
                         accept="image/png, image/jpeg, image/gif, image/jpg"
                         @change="addImg($event,'image_all')">
                  <icon font-name="icon-jiahao" size="70" color="#c3c3c3"></icon>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="submit" v-show="editStatus">

          <ds-button type="primary" size="large" @click="next()" :disabled="!valid">下一步</ds-button>
        </div>
      </div>
    </page>
  </div>
</template>
<script>
  import editPersonal from '../../components/uiModule/EditPersonal/EditPersonal'
  import verify from '../../utils/verify'
  import { dataURLtoBlob, get_suffix } from '../../utils/currency'
  import { GetToken, HttpImgUrl, GoodsInfo, GoodsEdit } from '../../assets/js/api'

  export default {
    name: 'sellOrderDetailsP',
    data () {
      return {
        rightText: '编辑',
        editStatus: false,
        info: {
        },
        commonid: '',
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
            cityYC: ''
          }
        },
        localImage: [],
      }
    },
    created () {
      this.commonid = this.$route.query.id
      this.goodsInfo(this.commonid)
    },
    watch: {
      editStatus (val) {
        if (!val) {
          this.goodsInfo(this.commonid)
        }
      },
      localImage (val) {
        let arr = []
        val.forEach((i) => {arr.push(i.url)})
        this.info.image_all = arr.join()
      }
    },
    methods: {
      async next () {
        let json = await this.$http.post(GoodsEdit, {post: this.info}, {}, {})
        if (json.code === 200) {
          setTimeout(()=>{
            this.$router.goBack()
          },1000)
        }
      },
      edit () {
        this.editStatus = !this.editStatus
        this.rightText = this.editStatus ? '取消' : '编辑'
      },
      async goodsInfo (goods_commonid) {
        let json = await this.$http.post(GoodsInfo, {post: {goods_commonid}}, {}, {})
        if (json.code === 200) {
          this.localImage = []
          this.info = json.datas.goodscommon_info
          this.textinfo.textData = json.datas.goodscommon_info.map_str
          this.info.image_all.split(',').forEach((item, index) => {this.localImage.push({url: item})})
        }
      },
      deleteImg (index) {
        this.localImage.splice(index, 1)
      },
      async addImg (e) {
        let self = this
        if (this.prod) {
          plus.gallery.pick((p) => {
            plus.nativeUI.showWaiting()
            plus.zip.compressImage({
              src: p,
              dst: '_doc/kkc.jpg',
              overwrite: true,
              quality: 70,
              width: 'auto',
              height: 'auto',
              rotate: 0
            }, (i) => {
              plus.nativeUI.showWaiting()
              let reader = new window.plus.io.FileReader()
              reader.onloadend = function (e) {
                let blob = dataURLtoBlob(e.target.result)
                self.getGetTokenData(blob, p)
              }
              reader.readAsDataURL(i.target)
            })
          }, (e) => { plus.nativeUI.alert(e)}, {filter: 'image'})
        } else {
          let file = e.target.files[0]
          let filesName = file.name
          if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
            alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
            return false
          }
          let oFReader = new FileReader()
          oFReader.readAsDataURL(file)
          oFReader.onload = async (oFREvent) => {
            const noCropAvatar = oFREvent.target.result
            let blob = dataURLtoBlob(noCropAvatar)
            this.getGetTokenData(blob, filesName)
          }
        }
      },
      // 获取oss 信息
      async getGetTokenData (file, filesName) {
        let getGetTokenData = await this.$http.get(GetToken, {
          type: 'diamond'
        })
        if (getGetTokenData.code === 200) {
          this.plusUpload(getGetTokenData, file, filesName)
        }
      },
      // 上传操作
      async plusUpload (resData, file, filesName) {
        let suffix1 = get_suffix(filesName) //文件后缀  例如   .jpg
        await this.$http.post(resData.datas.host, {
          key: resData.datas.dir + suffix1,
          policy: resData.datas.policy,
          success_action_status: '200',
          OSSAccessKeyId: resData.datas.accessid,
          signature: resData.datas.signature,
          callback: resData.datas.callback,
          file,
        }).then((res) => {
          // this.info.image_all.push(res.filename)
          this.localImage.push({url: HttpImgUrl + res.filename})
          if ($prod) {
            plus.nativeUI.closeWaiting()
          }
        })
      },
    },
    beforeRouteLeave (to, from, next) {
      if (this.editStatus) {
        this.$modal({message: '是否保存', lock: true, cancel: true,}).then(async action => {
          let json = await this.$http.post(GoodsEdit, {post: this.info}, {}, {})
          if (json.code === 200) {
            this.editStatus = false
            this.$toast('提交成功')
            setTimeout(() => {
              next()
            }, 1000)
          }
        }, () => {
          next(false)
        })
      } else {
        next()
      }
    },
    components: {
      editPersonal
    },
    computed: {
      valid () {
        return verify.requiredObjProp(this.info).isValid
      },
      prod () {
        return $prod
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/mixin";
  @import "../../assets/css/variables";
  @import "../../assets/css/upload";

  .wrap {
    background: #fff;
    padding: 0 pxTorem(25);
    .tip-header {
      color: $themeColor;
      font-size: pxTorem(24);
      text-align: center;
      padding: 0.4rem 0.28rem;
      position: relative;
    }
    .submit {
      margin-top: 0.4rem;
      padding-bottom: 0.6rem;
    }
  }


</style>
