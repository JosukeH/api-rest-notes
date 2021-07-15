const http = require('http')
const data = require('./post/post');
const PORT = 3001



const app = http.createServer((req,res) => {
    res.writeHead(200,{'contentType': 'application/json'})
    res.end(JSON.stringify(data))
})

console.log(`server running in the port ${PORT}`)
app.listen(PORT)


