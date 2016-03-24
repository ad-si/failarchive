path = require 'path'

express = require 'express'
errorHandler = require 'errorhandler'
favicon = require 'serve-favicon'
compression = require 'compression'
stylus = require 'stylus'
nib = require 'nib'
fail = require '../routes/fail'
fails = require '../routes/fails'

publicDirectory = path.join __dirname, '../public'


app = express()
developmentMode = app.get('env') is 'development'

app.use compression()
app.use favicon path.join(publicDirectory, 'images/favicon.ico'), {maxAge: 1000}

app.use stylus.middleware {
	src: path.join publicDirectory, 'styles'
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

app.use express.static publicDirectory

app.set 'views', path.join __dirname, '../views'
app.set 'view engine', 'jade'

app.get '/', fails
app.get '/fail/:id', fail


if developmentMode
	app.use errorHandler()

if not module.parent
	port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000
	ip = process.env.OPENSHIFT_NODEJS_IP  || process.env.IP || '127.0.0.1'
	app.listen port, ip
	console.log 'Failarchive listens on http://' + ip + ':' + port
