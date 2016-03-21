requestModule = require 'request'

module.exports = (request, response) ->
	requestModule(
		'https://api.mastermind.do' +
		'/v1/217/1a98cc74-2e30-4d67-99f1-d67059ff5c5b?id=' + request.params.id
		(error, apiResponse, body) ->
			if error
				return console.error 'error: ' + error

			if apiResponse.statusCode isnt 200
				console.error "Statuscode must be 200 and not" +
					apiResponse.statusCode

			fail = JSON.parse(body).result
			fail.id = request.params.id

			response.render 'fail', {fail}
	)
