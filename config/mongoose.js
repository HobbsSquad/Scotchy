const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {
    const db = mongoose.connect(config.db);
    require('../app/models/user.server.model');
    require('../app/models/scotch.server.model');
    require('../app/models/wishlist.server.model');
    //require('../app/models/tasting.server.model');

    return db;
};
