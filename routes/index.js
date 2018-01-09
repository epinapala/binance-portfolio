var controllers = require('../controllers');

var appRouter = function (app) {
  app.get("/", controllers.getPortfolio);
}

module.exports = appRouter;