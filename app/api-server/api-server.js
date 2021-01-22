const { version } = require('../../package-lock.json');
const loggerManager = require('../managers/logger.manager');
const express = require('express');

const apiServer = express();
let logger;

apiServer.initialize = async (configuration) => {   
  logger = loggerManager.getLogger();
  logger.debug('[ApiServer] Initialize');

  // Middleware
  apiServer.use(express.json());
  apiServer.use(express.urlencoded({ extended: false }));
  apiServer.use(loggerManager.logApiServerRequests);
  
  // Endpoints
  apiServer.get('/', (req, res, next) => {
    res.send({ status: 200, message: 'Express is working' });
  });

  apiServer.get('/error', (req, res, next) => {
    next(Error('An error in an existing endpoint'));
  });

  // No Endpoint found
  apiServer.use(function(req, res, next) {
    next({ status: 404, message: 'Content not found' });
  });
  
  // error handler
  apiServer.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ status: err.status || 500, message: err.message });
    res.end();
  });

  // start listening
  const port = (configuration && configuration.port) || '3000';
  const host = (configuration && configuration.host) || 'localhost';
  const server = apiServer.listen(port, host);
  server.on('listening', () => {
    let message = "[ApiServer] Start listening\n"
    message += "  ********************************************\n";
    message += `  * Node Express Boilerplate POC v${version}\n`;
    message += `  * API Server listening on ${port}\n`;
    message += "  * Ctrl-C to shutdown API Server\n";
    message += "  *";
    logger.info(message);
  });
};

module.exports = apiServer;
