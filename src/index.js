import axios from 'axios'

export default class Checker {
  constructor (config) {
    this.offset = 0
    this.axe = axios.create({ baseURL: config.telegram.baseURL })
  }

  listen () {
    setInterval(() => {
      this._getUpdates()
        .then(messages => {
          messages.forEach(m => {
            const to = m.message.from.id
            const text = `Your ID is: ${to}`

            this._sendReply({ to, text })
          })
        })
        .catch(err => console.error(err))
    }, 3000)
  }

  _sendReply ({ to, text }) {
    this.axe.post(`/sendMessage?chat_id=${to}&text=${text}`)
      .then(res => console.log('Reply was sent.'))
      .catch(err => console.error(err.message))
  }

  _getUpdates () {
    return new Promise((resolve, reject) => {
      this.axe.get(`/getUpdates?offset=${this.offset}`)
        .then(res => res.data)
        .then(res => {
          if (res.ok) {
            const messages = res.result

            if (messages.length > 0) this._updateOffset(messages)

            resolve(messages)
          } else {
            reject(new Error('Errored while requesting for updates.'))
          }
        })
        .catch(err => reject(err))
    })
  }

  _updateOffset (msgs) {
    const ids = msgs.map(msg => msg.update_id)

    this.offset = Math.max.apply(null, ids) + 1
  }
}
