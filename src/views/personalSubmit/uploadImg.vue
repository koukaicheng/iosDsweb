<script>
import { Actionsheet } from 'mint-ui'
import { GetToken, HttpImgUrl } from '../../assets/js/api'
import { dataURLtoBlob, get_suffix } from '../../utils/currency'
import verify from '../../utils/verify'

export default {
  name: '',
  data () {
    return {
      sheetVisible: false,
      actions: [{
        name: '拍照',
        method: this.camera
      }, {
        name: '从相册选择',
        method: this.gallery
      }]
    }
  },
  created () {},
  mounted () {},
  methods: {
    previewImage () {
      if (!$prod) return
      let url = `${HttpImgUrl}static/example/report.jpg`
      plus.nativeUI.previewImage([url])
    },
    async addImg (e) {
      if (this.prod) {
        this.sheetVisible = true
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
    //原生图片压缩
    compressImage (src) {
      let u = navigator.userAgent
      if (u.indexOf('Android') > -1) {
        plus.zip.compressImage({
          src: src,
          dst: '_doc/kkc.jpg',
          overwrite: true,
          quality: 70,
          width: 'auto',
          height: 'auto',
          rotate: 0
        }, (i) => {
          plus.nativeUI.showWaiting()
          let reader = new window.plus.io.FileReader()
          reader.onloadend = (e) => {
            let blob = dataURLtoBlob(e.target.result)
            this.getGetTokenData(blob, src)
          }
          reader.readAsDataURL(i.target)
        })
      } else {
        let bitmap = new plus.nativeObj.Bitmap('test')
        bitmap.load(src, () => {
          let data = bitmap.toBase64Data()
          let blob = dataURLtoBlob(data)
          this.getGetTokenData(blob, src)
        })
      }
    },
    //从相册选取照片
    gallery () {
      plus.gallery.pick((p) => {
        plus.nativeUI.showWaiting()
        this.compressImage(p)
      }, (e) => { plus.nativeUI.alert(e)}, {filter: 'image'})
    },
    //调用相机拍照
    camera () {
      this.sheetVisible = false
      let cmr = plus.camera.getCamera()
      cmr.captureImage((p) => {
        plus.nativeUI.showWaiting()
        this.compressImage(p)
      }, (e) => {})
    },
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
        this.info.image_all.push(res.filename)
        this.localImage.push({url: HttpImgUrl + res.filename})
        if ($prod) {
          plus.nativeUI.closeWaiting()
        }
      })
    },
    async getGetTokenData (file, filesName) {
      let getGetTokenData = await this.$http.get(GetToken, {
        type: 'diamond'
      })
      if (getGetTokenData.code === 200) {
        this.plusUpload(getGetTokenData, file, filesName)
      }
    },
    deleteImg (index) {
      this.info.image_all.splice(index, 1)
      this.localImage.splice(index, 1)
    },
  },
  components: {'mt-actionsheet': Actionsheet},
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
