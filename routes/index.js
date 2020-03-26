/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/users', require('./taskRoutes'));
    app.use('/tasks', require('./userRoutes'));
};
