const userRouter = require('./user');

function router(app) {
    app.use('/', userRouter);
}

module.exports = router;
