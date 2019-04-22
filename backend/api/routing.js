const controllers = require('./controllers');

module.exports = (app) => {
  app.get('/api/*', [], controllers.static.apiError);

  // Render React page
  app.get('/*', [], controllers.static.getAll);
}