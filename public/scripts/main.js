/*global YT*/
var lastPlayer
var nextPlayer
var players = []
var currentId

$(window).scroll(function() {
	clearTimeout($.data(this, 'scrollTimer'))
	$.data(this, 'scrollTimer', setTimeout(isScrolledIntoView, 100))
})
// $('select.categories').chosen()

// gets called by YouTube SDK
function onYouTubeIframeAPIReady() {
	isScrolledIntoView();
}

function getPlayerForId (id) {
	var result
	players.forEach(function (player) {
		if (player.id == id) {
			result = player
		}
	})
	return result
}

function pauseAllPlayersBut (id) {
	players.forEach(function(player) {
		if (player.id !== id) {
			player.player.pauseVideo()
		}
	})
}

function stopPlayer(id) {
	players.forEach(function(player) {
		if (player.id == id) {
			player.player.stopVideo()
		}
	})
}

function playThis (elem) {
	if (!elem.find('iframe').length) {
		return
	}

    currentId = elem.data('id')
	pauseAllPlayersBut(elem.data('id'))
    var player = getPlayerForId(elem.data('id'))
    console.log('result ', player)
    var $image = $('#image-' + elem.data('id'))
    var fadeOutDuration = 500

    if (player) {
    	console.log('Player found, start play')
    	setTimeout(function () {
    		$image.fadeOut(fadeOutDuration, function () { $image.remove})
    	}, 100)
    	player.player.playVideo();
    }
    else {
    	console.log('Player not found', elem.data('id'))
    	if (YT) {
    		console.log('Create Player for id:', 'iframe-' + elem.data('id'))
	    	player = new YT.Player('iframe-' + elem.data('id'), {
		      events: {
		        'onReady': function () {
		        	setTimeout(function() {
			    		$image.fadeOut(fadeOutDuration, function () { $image.remove})
			    	}, 100)
		        	player.playVideo()
			    	console.log('Start Play')
		        	players.push({
		        		id: elem.data('id'),
		        		player: player
		        	})
		        }
		      }
		    })
    	} else {
    		console.log("YT not loaded yet")
    	}
    }
}

function bufferThis (elem) {
	if (!elem.find('iframe').length || currentId === elem.data('id')) {
		return
	}

	console.log('should buffer ', elem.data('id'))

	if (!getPlayerForId('iframe-' + elem.data('id'))) {
    	var player;
    	player = new YT.Player('iframe-' + elem.data('id'), {
	      events: {
	        'onReady': function() {
	        	player.playVideo()
	        	if (!getPlayerForId(elem.data('id'))) {
		        	players.push({
		        		id: elem.data('id'),
		        		player: player
		        	})
	        	}
	        },
	        'onStateChange': function(newState) {
	        	if (!getPlayerForId(elem.data('id'))) {
		        	players.push({
		        		id: elem.data('id'),
		        		player: player
		        	})
	        	}
        	 	if (newState.data == 3 && currentId !== elem.data('id')) {
        	 		console.log('pause', elem.data('id'))
			        player.pauseVideo()
			 	}
	        }
	      }
		})
	}
}

function isScrolledIntoView() {
	var frames = $('.fail .video')
	for (var i = 0; i < frames.length; i++) {
		var docViewTop = $(window).scrollTop()
		var docViewBottom = docViewTop + $(window).height()

		var elemTop = $(frames[i]).offset().top
		var elemHeight =  $(frames[i]).height()
		var elemBottom = elemTop + elemHeight

		createIframeForId($(frames[i]).data('id'));

		if ((elemTop + elemHeight/2) > docViewTop) {
			for (var j = 1; j < Math.min(frames.length - i, 4); j++) {
				createIframeForId($(frames[i+j]).data('id'));
			}
			playThis($(frames[i]))
			if (i < frames.length - 1) {
				bufferThis($(frames[i+1]))
				console.log('will buffer', $(frames[i+1]).data('id'))
			}
			break
		} else {
			stopPlayer($(frames[i]).data('id'))
		}

	}
}

function createIframeForId (id) {
	var $videoContainter = $('#video-' + id)
	var $iframe = $videoContainter.find('iframe')

	if ($iframe.length) {
		return
	}

	$videoContainter
		.find('div')
		.prepend($('<iframe ' +
			'src="https://www.youtube.com/embed/' + id + '?enablejsapi=1" ' +
			'frameborder=0 allowfullscreen ' +
			'data-id="' + id + '" ' +
			'id="iframe-' + id + '"/>'))
}

// playThis($($('.fail .video')[0]));
