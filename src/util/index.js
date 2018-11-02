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
  if (localStorage.getItem('fileQua')) { // 新建文件夹名字删除
    let delNewName = Number(name.replace(/[^\d]/ig, ''))
    let arr = JSON.parse(localStorage.getItem('fileQua'))
    if (name === '新建文件夹') {
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
    } else if (list[i].path === path && type === 'addFile') {
      let str = JSON.stringify(item)
      let obj = JSON.parse(str)
      if (obj.level) {
        obj.level = list[i].level + 1
      }
      list[i].childrens.push(obj)
    }
    util.delFile(list[i].childrens, path, type, item)
  }
  return list
}
util.copy = function (list, conditions) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].path === conditions) {
      copyItem = list[i]
      break
    }
    util.copy(list[i].childrens, conditions)
  }
  return copyItem
}
export default util
