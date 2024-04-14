const functions = require('firebase-functions');
const users = require('./crud/users')
const stays = require('./crud/stays')
const posts = require('./crud/posts')
const userReqs = require('./requests')

exports.users = functions.https.onRequest(users.users)
exports.stays = functions.https.onRequest(stays.stays)
exports.posts = functions.https.onRequest(posts.posts)
exports.userReqs = functions.https.onRequest(userReqs.userReqs)