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
export default util
