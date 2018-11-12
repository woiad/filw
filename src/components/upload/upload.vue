<template>
  <div class="up-container">
    <div class="up-wrapper">
      <div class="up-top">
        <p>文件上传</p>
        <div class="close" @click="closeUp">
          <i class="fa fa-close" style="font-size: 14px"></i>
        </div>
      </div>
      <div class="up-content">
        <div class="up">
          <form role="form" action="http://113.105.246.230:5107/fileapi/upload" method="post" enctype="multipart/form-data">
            <input type="file" class="default" ref="choseBtn" name="file" @change="readFile()" multiple>
            <Button type="primary" class="chose" @click="choseClick">文件选择</Button>
            <div class="files-outer-wrapper">
              <div class="files-inner-wrapper">
                <div class="files">
                  <ul>
                    <li v-for="(item, index) in fileArr" :key="index">
                      <p>{{item.name}}</p>
                      <p>{{filter(item.size)}}</p>
                      <p><i class="fa fa-close" style="cursor: pointer" @click="delUpFiles(index)"></i></p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <button @click.stop.prevent="submitData" class="submit">上传文件</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'upload',
  data () {
    return {
      fileArr: []
    }
  },
  mounted () {
    if (typeof FileReader === 'undefined') {
      alert('您的浏览器不支持FileReader，将无法上传文件，请更换浏览器！')
    }
  },
  methods: {
    closeUp () {
      this.$emit('close-up')
    },
    choseClick () {
      this.$refs['choseBtn'].click()
    },
    filter (size) {
      if (Math.floor(size / 1024) < 1024) {
        return Math.round((size / 1024) * 10) / 10 + 'KB'
      } else if (Math.round(size / 1024) > 1024) {
        return Math.round(((size / 1024) / 1024) * 10) / 10 + 'MB'
      }
    },
    readFile () {
      let imageData = this.$refs['choseBtn'].files
      for (let i = 0; i < imageData.length; i++) {
        this.fileArr.push(imageData[i])
      }
    },
    submitData () {
      if (this.fileArr.length === 0) {
        this.$Message.error('上传失败：未选择文件')
        return true
      }
      let myForm = new FormData()
      for (let i = 0; i < this.$refs['choseBtn'].files.length; i++) {
        myForm.append('files[]', this.$refs['choseBtn'].files[i])
      }
      const instance = axios.create({
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }
      })
      instance.post('http://113.105.246.230:5107/fileapi/upload', myForm)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    delUpFiles (index) {
      this.fileArr.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .up-container{width: 450px;height: 450px;position: absolute;top: 50%;margin-top: -225px;left: 50%;
  margin-left: -245px;border: 1px solid #eee;box-shadow: 0px 0px 20px rgba(0, 0, 0, .3);background: #fff;
  z-index: 1000;}
  .up-top{width: 100%;height: 40px;line-height: 40px;position: relative;border-bottom: 1px solid #eee;}
  .up-top p{color: #222; font-size: 14px;padding-left: 10px;}
  .up-top .close{width: 20px;position: absolute;right: 0;top: 0;height: 20px;text-align: center;
  line-height: 20px;cursor: pointer;}
  .up-top .close:hover{background: red;color: #fff;}
  .up-content{position: relative;width: 100%;padding: 5px;height: 400px;}
  .up-content form{width: 100%;height: 100%;}
  .up-content input.default{height: 30px;opacity: 0;width: 80px;}
  .files-outer-wrapper{position: relative;margin-top: 10px;width: 438px;height: 350px;overflow: hidden;border: 1px solid #ddd;}
  .files-inner-wrapper{position: absolute;overflow-y: scroll;left: 0;}
  .up-content .files{width: 438px;height: 300px;height: 357px;}
  .up-content .files li {display: flex;height: 30px;padding: 0 5px;border-bottom: 1px solid #e8eaec;background: #f8f8f9;line-height: 30px;
  justify-content: center;}
  .up-content .files li:nth-child(2n){background: #ffffff;}
  .up-content .files li p{width: 30%; margin-right: 10px;font-size: 12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .up-content .files li p:last-child{text-align: right}
  .up-content .chose{position: absolute;left: 10px;width: 80px; height: 30px;text-align: center;}
  .up-content button.submit{position: absolute;top: 5px;left: 100px;width: 80px; height: 30px;line-height: 30px;text-align: center;border-radius: 4px;
  cursor: pointer;}
  .up-content button.submit:hover{color: #57a3f3;border-color: #57a3f3;background-color: #fff;}
</style>
