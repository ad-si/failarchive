express = require 'express'

app = express()

app.get '/', (request, response) ->
	response.send 'Hello World'


if !module.parent
	app.listen 3000
	console.log 'Express started on port 3000'
