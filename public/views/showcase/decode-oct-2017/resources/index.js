var config = {
  host: 'playground.qlik.com',
  prefix: '/showcase/',
  port: '443',
  isSecure: true,
  rejectUnauthorized: false,
  appname: '0b0fc6d5-05ce-44d7-95aa-80d0680b3559'
}

const express = require('express')

let app = express()
app.use(express.static(__dirname))

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
