var controllers = require('../controllers');

var appRouter = function (app) {
  app.get("/", controllers.getPortfolio);
  app.get("/ticker/:symbol", controllers.getTicker);
};

module.exports = appRouter;