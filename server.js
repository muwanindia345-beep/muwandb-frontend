const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')
const app = express()

app.use('/api', createProxyMiddleware({
  target: process.env.VITE_API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}))

app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(process.env.PORT || 3001, () => console.log('Frontend running'))
