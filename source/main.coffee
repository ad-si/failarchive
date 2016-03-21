path = require 'path'

express = require 'express'
errorHandler = require 'errorhandler'
favicon = require 'serve-favicon'
compression = require 'compression'
stylus = require 'stylus'
nib = require 'nib'
fails = require '../routes/fails'


app = express()
developmentMode = app.get('env') is 'development'

app.use favicon path.normalize('public/images/favicon.png'), {maxAge: 1000}
app.use compression()

app.use express.static path.join __dirname, '../public'

app.set 'views', path.join __dirname, '../views'
app.set 'view engine', 'jade'

app.use stylus.middleware {
	src: path.join __dirname, '../public/styles'
	compile: (stylString, filePath) ->
		return stylus stylString
			.set 'filename', filePath
			.set 'compress', not developmentMode
			.set 'force', developmentMode
			.set 'sourcemap', {
				comment: developmentMode
				inline: true
			}
			.use nib()
 }

app.get '/', fails

if developmentMode
	app.use errorHandler()



if not module.parent
	app.listen 3000
	console.log 'Failarachive listens on http://localhost:3000'
