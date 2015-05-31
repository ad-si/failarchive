path = require 'path'

express = require 'express'
errorHandler = require 'errorhandler'

dummyFails = [
	{
		title: 'Fail 1'
	},
	{
		title: 'Fail 2'
	}
]

app = express()

app.use express.static path.join __dirname, '../public'

app.set 'views', path.join __dirname, '../views'
app.set 'view engine', 'jade'

app.get '/', (request, response) ->
	response.render 'index', {fails: dummyFails}

if app.get 'env' is 'development'
	app.use errorhandler()



if not module.parent
	app.listen 3000
	console.log 'Express started on port 3000'
