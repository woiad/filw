<template>
  <div class="list-arrang-container">
    <div class="descript">
      <div style="width: 100%" class="split-wrapper">
        <Split v-model="split_name" @on-moving="panelNameDrag">
          <div slot="left" class="name">
            <p>名称</p>
          </div>
          <div slot="right" id="right_type">
            <Split v-model="split_type" @on-moving="panelTypeDrag">
              <div slot="left" class="type">
                <p>类型</p>
              </div>
              <div slot="right" id="right_size">
                <Split v-model="split_size" @on-moving="panelSizeDrag">
                  <div slot="left" class="size" @click="size_icon_up = !size_icon_up">
                    <p>大小 <i class="fa" :class="[size_icon_up ? 'fa-chevron-up' : 'fa-chevron-down']"></i></p>
                  </div>
                  <div slot="right" class="time" @click="time_icon_up = !time_icon_up">
                    <p>修改时间 <i class="fa" :class="[time_icon_up ? 'fa-chevron-up' : 'fa-chevron-down']"></i></p>
                  </div>
                </Split>
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
    <div class="list-content">
      <div class="list" v-for="(item, index) in listData" :key="index">
        <div class="list-item-name" :style="{'width': split_name * 100 + '%'}">
          <i class="name-icon"></i>
          <p>{{item.name}}</p>
        </div>
        <div class="list-item-type" :style="{'width': type_width + 'px' || 'calc(19% - 3.5px)' }">
          <p>{{item.type}}</p>
        </div>
        <div class="list-item-size" :style="{'width': size_width + 'px' || '14%'}">
          <p>{{item.size}}M</p>
        </div>
        <div class="list-item-time">
          <p>{{item.time}}</p>
        </div>
        <div class="hover-show">
          <i class="chose fa fa-check-circle" aria-hidden="true"></i>
          <button class="more">
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../util/index'
export default {
  name: 'listArrang',
  data () {
    return {
      listData: [
        {name: 'Bmp', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'img', size: '1', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'html', size: '0.1', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'webp', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: '视频', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'music', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'data', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'Bmp', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'Bmp', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'Bmp', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'},
        {name: 'Bmp', size: '1.2', time: '2018-5-6 12:00:03', type: '文件夹'}
      ],
      size_icon_up: true,
      time_icon_up: true,
      split_name: 0.25,
      split_type: 0.25,
      split_size: 0.25,
      type_width: '',
      size_width: ''
    }
  },
  methods: {
    panelNameDrag (e) {
      console.log(this.split_name)
    },
    panelTypeDrag () {
      this.type_width = util.getId('right_type').clientWidth * this.split_type
    },
    panelSizeDrag () {
      this.size_width = util.getId('right_size').clientWidth * this.split_size
    }
  }
}
</script>

<style>
  .list-arrang-container{width: 100%;overflow: hidden}
  .list-arrang-container .descript{height: 25px;background: #fff;border-bottom: 1px solid #e3e3e3;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);}
  .list-arrang-container .descript .split-wrapper{width: 100%;height: 25px;overflow: hidden;}
  .split-wrapper .name, .split-wrapper .size, .split-wrapper .type, .split-wrapper .time{
    padding-left: 15px;box-sizing: border-box;cursor: pointer;border-right: 1px solid #eee;
  }
  .split-wrapper .ivu-split-trigger-bar-con.vertical{opacity: 0;height: 25px;}
  .split-wrapper .ivu-split-trigger-vertical{width: 1px;border-left: none;border-right: none;
    border-bottom: 1px solid #e3e3e3;background: #fff;box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);}
  .split-wrapper .name p, .split-wrapper .size p, .split-wrapper .type p, .split-wrapper .time p{
    height: 25px;line-height: 25px;font-size: 14px;color: #448;overflow: hidden;white-space: nowrap;
    text-overflow: ellipsis;
  }
  .split-wrapper .size p i, .split-wrapper .time p i{float: right;display: block;margin: 6px 6px 0 0;}
  .split-wrapper .name:hover, .split-wrapper .size:hover, .split-wrapper .type:hover, .split-wrapper .time:hover{
    background: #e5f3ff;
  }
  .list-arrang-container .list-content{width: 100%;padding: 5px 0 0 0px;}
  .list-arrang-container .list-content .list{display: flex;height: 28px;width: 100%;font-size: 12px;line-height: 28px;color: #335;position: relative;}
  .list-arrang-container .list-content .list:nth-child(2n){background: #fffbf1;}
  .list-arrang-container .list-content .list:hover{background: #e5f3ff;transition: all .2s;}
  .list .list-item-name, .list .list-item-type, .list .list-item-size, .list .list-item-time{padding-left: 10px;box-sizing: border-box;}
  .list-arrang-container .list-content .list .list-item-name{width: calc(25% - 0.5px);}
  .list-arrang-container .list-content .list .list-item-name i{float: left;width: 20px;height: 20px;margin-top: 4px;background-image: url('../../assets/image/menu_icon.png');
  background-position: 2px 310px;background-size: 100%;vertical-align: top;}
  .list-arrang-container .list-content .list .list-item-type{width: calc(19% - 3.5px);}
  .list-arrang-container .list-content .list .list-item-size{width: 14%;}
  .list .list-item-name p, .list .list-item-type p, .list .list-item-size p, .list .list-item-time p{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .list .hover-show{display: none;}
  .list:hover .hover-show{display: block}
  .list .hover-show .chose{position: absolute;display: block;top: 4px;right: 38px;width: 12px;height: 12px;cursor: pointer;
    color: rgba(0, 0, 0, 0.05);font-size: 16px;}
  .list .hover-show .chose:hover{color: rgba(0, 0, 0, 0.2)}
  .list .hover-show button.more{display: block;position: absolute;top: 5px;right: 8px;width: 14px;height: 14px;
    border: 1px solid #ddd;text-align: center;background: #fff;cursor: pointer;line-height: 14px;}
  .list .hover-show button.more i{font-size: 12px;color: #999;}
  .list .hover-show button.more:hover{border-color: #3399ff;}
  .list .hover-show button.more i:hover{color: #3399ff;}
</style>
