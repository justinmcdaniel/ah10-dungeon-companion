'use strict';

var request = require('request-promise');
var Promise = require('bluebird');
var _lodash = require('lodash');

var defaultRoomID = '59614314cc91260440e4eaab'


module.exports = function(PlayerSession) {
	var newSessionTemplate = {
		userID: null,
		currentRoom: null,
		rooms: [],
		hasBarrel: false,
		hasKey: false,
		searchedTrap: false,
		disarmedTrap: false,
		openedChest: false
	}

	PlayerSession.debug = function(cb) {
		request.post(
			'http://angelhack-10-dungeon-companion.mybluemix.net/api/playersessions/greet',
			{ json: { userID: 'cdef123456' } },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {                }
				console.log(body.data[0].userID);
			}
		);

		cb(null, 'done');
	}

	
	PlayerSession.greet = function(userID, cb) {
		
		//var userID = 'cdef123456';
		
		PlayerSession.find({where:{userID: userID}})
			.then(function(mySessions) {

				console.log('got 1');
				if (mySessions && mySessions.length > 0) { //session already exists
					console.log('got exist session');
					cb(null, mySessions);		
				} else { // no session exists
					console.log('making session: ');
					console.log(userID);
					PlayerSession.app.models.Room.findById(defaultRoomID)
						.then(function(startingRoom) {
							console.log('cloning session template');
							
							var newSessionObj = _lodash.clone(newSessionTemplate);
							newSessionObj.userID = userID;
							newSessionObj.isNewSession = true;
							newSessionObj.currentRoom = startingRoom;

							console.log(newSessionObj);
							
							PlayerSession.create(newSessionObj).then(function(myNewSession) {
								cb(null, myNewSession);
							});
							
						});
				
				}
			})

		
		//Player
		
		
		
    }

    PlayerSession.remoteMethod('greet', {
		accepts: {arg: 'userID', type: 'string'},
          returns: {arg: 'data', type: 'string'}
		  //http: {path: '/sayhi', verb: 'get'}
    });

	PlayerSession.remoteMethod('debug', {
		//accepts: {arg: 'userID', type: 'string'},
          returns: {arg: 'data', type: 'string'},
		  http: {path: '/debug', verb: 'get'}
    });
	
	
	
	// PlayerSession.observe('loaded', function(context, next) {
		// console.log(context.data);
		
		// context.data = {
			// "test": "result"
		// };
		
	//});
	
	function fetch(url) {
		return request({uri: url, json: true});
	}
	
	
};
