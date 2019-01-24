/**
 * Created by hw on 2018/3/21.
 */
import { Message, MessageBox } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
export function tip(text, type) {
  Message({
    message: text,
    type: type || 'success',
    duration: 3 * 1000
  })
}
export function deleteTip(text, func) {
  MessageBox.confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    func(() => {
      Message({
        message: '恭喜你，删除成功！',
        type: 'success'
      })
    })
  }).catch(() => {
    Message({
      type: 'info',
      message: '已取消删除'
    })
  })
}
export function xiaZai(url, arr, type) {
  let form = document.createElement("form"),
    input = document.createElement("input"),
    body = document.getElementsByTagName('body')[0];
    input.setAttribute("value", getToken())
  input.setAttribute("name", 'Authorization')

  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      let inputs = document.createElement("input")
      inputs.setAttribute('name', arr[i].key)
      inputs.setAttribute('value', arr[i].value)
      form.appendChild(inputs)
    }
  }
  form.appendChild(input)
  body.appendChild(form)
  form.setAttribute("action", url)
  form.setAttribute("method", 'get')
  form.submit()
}
export function baseUrl() {
  // let base = process.env.NODE_ENV == 'development' ? 'http://192.168.31.77:8880' : ''
  let base = process.env.NODE_ENV == 'development' ? 'http://39.108.247.181:8880' : ''

  return base
}
