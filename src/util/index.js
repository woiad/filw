let util = {}

util.getId = function (_id) {
  return document.getElementById(_id)
}
util.compare = function (a, b) {
  if (a.name < b.name) {
    return -1
  } else if (a.name > b.name) {
    return 1
  } else {
    return 0
  }
}
let arr = []
let copyItem = ''
util.initArr = function () {
  arr = []
}
util.recursion = function (data, parent, lev) { // 递归服务器数据，进行数据重构，导航栏数据
  let level = lev || 0
  level++
  for (let i in data) {
    let obj = {}
    obj.childrens = []
    obj.level = level
    obj.name = i
    obj.check = false
    obj.expand = false
    obj.type = 'dir'
    if (parent) {
      obj.path = parent.path + '/' + i
      if (parent.level < level) {
        parent.childrens.push(obj)
      }
    } else {
      obj.path = '/' + i
    }
    if (level === 1) {
      arr.push(obj)
    }
    util.recursion(data[i], obj, level)
  }
  return arr
}
util.newFileNumber = function (type) { // 创建多个文件夹时，文件夹的初始名字
  let obj = {}
  console.log(localStorage.getItem('fileQua'))
  if (localStorage.getItem('fileQua') !== undefined && localStorage.getItem('fileQua') !== null) {
    let addItem = true
    let arr = JSON.parse(localStorage.getItem('fileQua'))
    if (arr.length === 0) {
      let fileQua = [0]
      localStorage.setItem('fileQua', JSON.stringify(fileQua))
      if (type !== 'dir') {
        obj.name = '新建文件' + '.' + type
      } else {
        obj.name = '新建文件夹'
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== i) {
          arr.splice(i, 0, i)
          addItem = false
          if (i === 0) {
            if (type !== 'dir') {
              obj.name = '新建文件' + '.' + type
            } else {
              obj.name = '新建文件夹'
            }
          } else {
            if (type !== 'dir') {
              obj.name = '新建文件' + '(' + i + ')' + '.' + type
            } else {
              obj.name = '新建文件夹' + '(' + i + ')'
            }
          }
          break
        }
      }
    }
    if (addItem) {
      arr.push(arr[arr.length - 1] + 1)
      if (type !== 'dir') {
        obj.name = '新建文件' + '(' + arr[arr.length - 1] + ')' + '.' + type
      } else {
        obj.name = '新建文件夹' + '(' + arr[arr.length - 1] + ')'
      }
    }
    localStorage.setItem('fileQua', JSON.stringify(arr))
  } else {
    let fileQua = [0]
    localStorage.setItem('fileQua', JSON.stringify(fileQua))
    if (type !== 'dir') {
      obj.name = '新建文件' + '.' + type
    } else {
      obj.name = '新建文件'
    }
  }
  return obj
}
util.recNewData = function (list, path, obj) { // 新建文件，往文件里面添加新文件夹
  for (let i = 0; i < list.length; i++) {
    if (list[i].path === path) {
      obj.level = list[i].level + 1
      obj.path = list[i].path + '/' + obj.name
      list[i].childrens.push(obj)
      list[i].expand = true
      break
    }
    util.recNewData(list[i].childrens, path, obj)
  }
  return list
}
util.delDirName = function (name) {
  let nameArr = name.split('/')
  if (localStorage.getItem('fileQua')) { // 新建文件夹名字删除
    let delNewName = Number(nameArr[nameArr.length - 1].replace(/[^\d]/ig, ''))
    let arr = JSON.parse(localStorage.getItem('fileQua'))
    if (nameArr[nameArr.length - 1] === '新建文件夹') {
      arr.splice(0, 1)
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === delNewName) {
          arr.splice(i, 1)
          break
        }
      }
    }
    localStorage.setItem('fileQua', JSON.stringify(arr))
  }
}
util.delFile = function (list, path, type, item) { // 删除导航栏文件
  for (let i = 0; i < list.length; i++) {
    if (list[i].path === path && type === 'del') {
      list.splice(i, 1)
      break
    } else if (list[i].path === path && type === 'addFile') { // 新建导航栏文件
      let str = JSON.stringify(item) // 传过来的item不转为stringify,会导致原item发生改变
      let obj = JSON.parse(str)
      if (obj.type === 'dir') { // 判断新增的文件是 dir 还是 file
        obj.level = list[i].level + 1
        obj.path = list[i].path + '/' + item.name
      }
      if (!obj.childrens) {
        obj.childrens = []
      }
      list[i].childrens.push(obj)
    } else if (list[i].path === path && type === 'error') {
      list[i].childrens.splice(list[i].childrens.length - 1, 1)
    }
    util.delFile(list[i].childrens, path, type, item)
  }
  return list
}
util.copy = function (list, conditions) { // 点击复制，获取复制的文件信息
  for (let i = 0; i < list.length; i++) {
    if (list[i].path === conditions) {
      copyItem = list[i]
      break
    }
    util.copy(list[i].childrens, conditions)
  }
  return copyItem
}
util.rightDataFea = function (listData) {
  let arr = []
  let showList = listData
  for (let i = 0; i < showList.length; i++) {
    if (showList[i].check) {
      arr[0] = i
      arr[1] = showList[i]
      return arr
    }
  }
}
util.pathModifer = function (name, path) {
  let pathArr = path.split('/')
  pathArr[pathArr.length - 1] = name
  return pathArr.join('/')
}
export default util
