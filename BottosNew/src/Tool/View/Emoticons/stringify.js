import emojiData from 'emoji-datasource-apple'

import _ from 'lodash'
require('string.fromcodepoint')

const stringify = text => {
  let result = ''
  const arr = _.toArray(text)
  _.each(arr, (value, key) => {
    if (value.length == 1) return (result += value)
    const index = _.findIndex(emojiData, function(o) {
      const emoji = String.fromCodePoint(
        ...o.unified.split('-').map(u => '0x' + u)
      )
      return emoji.codePointAt() == value.codePointAt()
    })
    if (index > -1) {
      result += '[' + emojiData[index]['unified'] + ']'
    } else {
      result += value
    }
  })

  return result
}

export default stringify
