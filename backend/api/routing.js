const controllers = require('./controllers');

module.exports = (app) => {
  app.get('/api/*', [], controllers.static.apiError);

  app.get('/*', [], controllers.static.getAll);
}