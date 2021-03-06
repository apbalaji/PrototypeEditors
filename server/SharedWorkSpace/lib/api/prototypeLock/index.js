'use strict';

var tp = require('norman-server-tp');
var express = tp.express;
var controller = require('./controller');
var router = new express.Router();
var commonServer = require('norman-common-server');
var registry = commonServer.registry;
var aclService = registry.getModule('AclService');
var authService = registry.getModule('AuthService');

/**
 *     GET      --> /api/project/:projectId/prototype/lock
 *     POST     --> /api/project/:projectId/prototype/lock
 *     PUT     --> /api/project/:projectId/prototype/lock
 */

router.get('/*/prototype/lock', aclService.checkAllowed(4, authService.getUserId), controller.getPrototypeLock);
router.post('/*/prototype/lock', aclService.checkAllowed(4, authService.getUserId), controller.createPrototypeLock);
router.put('/*/prototype/lock', aclService.checkAllowed(4, authService.getUserId), controller.updatePrototypeLock);
router.delete('/*/prototype/lock', aclService.checkAllowed(4, authService.getUserId), controller.deletePrototypeLock);


module.exports = router;
