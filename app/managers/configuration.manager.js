const loggerManager = require('./logger.manager');

const getConfigurationFromFile = (configuration = {}) => {
  return Promise.resolve(Object.assign(configuration, require('../../config/config.json')))
};

const getConfigurationFromDb = (configuration = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Object.assign(configuration, require('../../config/config_from_database.json')));
    }, 2000);
  });
};

module.exports = {
  getConfiguration: async () => {
    loggerManager.getLogger().debug('[ConfigurationManager] getConfiguration');
    return await getConfigurationFromFile()
      .then(getConfigurationFromDb);
  }
};
