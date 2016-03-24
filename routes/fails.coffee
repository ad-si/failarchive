requestModule = require 'request'

module.exports = (request, response) ->
	categories = ['drunk', 'dating', 'tinder', 'compilation',
								'celeb', 'sport', 'people', 'gaming', 'sexy']
	currentCategory = request.query.categories
	search = ''
	if currentCategory?
		search = '?search=' + currentCategory
	requestModule(
		'https://api.mastermind.do/v1/216/1a98cc74-2e30-4d67-99f1-d67059ff5c5b' + search
		(error, apiResponse, body) ->
			if error
				return console.error 'error: ' + error

			if apiResponse.statusCode isnt 200
				console.error "Statuscode must be 200 and not " +
					apiResponse.statusCode

			fails = JSON.parse(body).result

			response.render 'index', {fails, categories, currentCategory}
	)
