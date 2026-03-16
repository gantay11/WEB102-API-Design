const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err};
    error.message = err.message:

    // log to console for dev
    console.log(err);

    res.status(error.statuscode || 'server error'
});
};
module.exports = errorHandler;