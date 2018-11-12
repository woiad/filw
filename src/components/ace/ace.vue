<template>
  <div class="ace-containers">
    <div class="ace-editor" ref="ace"></div>
    <div class="right">
      <ul>
        <li><p>{{row + 1}}:{{cursor}}</p></li>
        <li><p>{{modeType}}</p></li>
        <li><p>Tables: 4</p></li>
      </ul>
    </div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/html'
import 'ace-builds/src-noconflict/snippets/css'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/text'
import 'ace-builds/src-noconflict/snippets/php'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/snippets/batchfile'
import 'ace-builds/src-noconflict/snippets/lua'
import 'ace-builds/src-noconflict/snippets/golang'
import 'ace-builds/src-noconflict/snippets/c_cpp'

const modeArray = [
  {name: 'javascript', path: 'ace/mode/javascript', type: ['js']},
  {name: 'HTML', path: 'ace/mode/html', type: ['htm', 'html']},
  {name: 'CSS', path: 'ace/mode/css', type: ['css']},
  {name: 'Java', path: 'ace/mode/java', type: ['java']},
  {name: 'Text', path: 'ace/mode/text', type: ['text']},
  {name: 'PHP', path: 'ace/mode/php', type: ['php']},
  {name: 'Python', path: 'ace/mode/python', type: ['py']},
  {name: 'Bat', path: 'ace/mode/batchfile', type: ['bat']},
  {name: 'Lua', path: 'ace/mode/lua', type: ['lua']},
  {name: 'Golang', path: 'ace/mode/golang', type: ['go']},
  {name: 'Cpp', path: 'ace/mode/c_cpp', type: ['cpp']}
]
export default {
  name: 'ace',
  mounted () {
    this.aceEditor = ace.edit(this.$refs.ace, {
      minLines: 10,
      fontSize: 14,
      value: this.value ? this.value : '',
      mode: this.modePath,
      tabSize: 4
    })
    // 激活代码自动补充
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    })
    for (let i = 0; i < this.modeArr.length; i++) {
      for (let j = 0; j < this.modeArr[i].type.length; j++) {
        if (this.modeArr[i].type[j] === this.fileType) {
          this.modePath = this.modeArr[i].path
          this.modeType = this.modeArr[i].name
          break
        }
      }
    }
    let _this = this
    this.row = this.aceEditor.session.getLength()
    this.aceEditor.getSession().setUseWrapMode(true) // 自动换行
    this.aceEditor.getSession().on('change', this.change)
    this.aceEditor.session.selection.on('changeCursor', this.handleChangeCursor) // 获取光标位置
    this.aceEditor.commands.addCommand({
      name: 'myCommand',
      bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
      exec: function (editor) {
        _this.$post('fileapi/operdir', {key: 'updatefile_w', dirname: _this.path, content: JSON.stringify(_this.value)})
          .then(res => {
            _this.$emit('save-complete')
            if (res[0] === 500) {
              _this.$Message.error('err' + res[2])
            } else if (res[0] === 200) {
              _this.$Message.success('保存成功')
            }
          })
      },
      readOnly: true // 添加新命令和键绑定
    })
  },
  data () {
    return {
      aceEditor: null,
      themePath: 'ace/theme/chrome',
      modePath: 'ace/mode/text',
      toggle: false,
      wrap: '',
      modeArr: modeArray,
      modeType: 'Text',
      cursor: 0,
      row: ''
    }
  },
  props: {
    value: {
      type: String
    },
    fileType: {
      type: String,
      default: 'text'
    },
    path: {
      type: String,
      default: ''
    }
  },
  methods: {
    change () {
      this.$emit('input', this.aceEditor.getSession().getValue())
    },
    handleChangeCursor () {
      this.cursor = this.aceEditor.selection.getCursor().column
      this.row = this.aceEditor.selection.getCursor().row
    }
  }
}
</script>

<style>
  .ace-containers{position: relative;width: 100%;height: 100%;}
  .ace-editor{width: 100%;height: 100%;}
  .ace-containers .right{position: absolute;bottom: 0; right: 10px;background: #ffffff;}
  .ace-containers .right ul li{float: left;height: 25px;line-height: 25px;padding: 0 10px;}
  .ace-containers .right ul li p{color: #222;}
  .ace_print-margin{display: none;}
</style>
