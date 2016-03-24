requestModule = require 'request'
lodash = require 'lodash'
availableTags = require '../modules/tags'

module.exports = (request, response) ->
	currentTags = request.query.tag or lodash.sampleSize(availableTags, 2)

	requestModule(
		'https://api.mastermind.do/v1' +
			'/216/1a98cc74-2e30-4d67-99f1-d67059ff5c5b' +
			"?page=#{lodash.random 1, 10}" +
			"&search=#{currentTags}"
		(error, apiResponse, body) ->
			if error
				return console.error 'error: ' + error

			if apiResponse.statusCode isnt 200
				console.error 'Statuscode must be 200 and not ' +
					apiResponse.statusCode

			fails = lodash.shuffle JSON.parse(body).result

			response.render 'index', {fails, availableTags, currentTags}
	)
