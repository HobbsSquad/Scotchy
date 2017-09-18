const users = require('../../app/controllers/users.server.controller');
const wishLists = require('../../app/controllers/wishList.server.controller');

module.exports = function(app) {
    app.route('/wishLists')
        .get(wishLists.renderWishLists)
        .post(users.requiresLogin, wishLists.create);
    
    app.route('/wishLists/:wishListId')
        .get(wishLists.renderWishListDetails)

    app.route('/wishLists/new')
        .post(wishLists.renderNewWishList);
    
    app.route('/wishLists/update/:wishListId')
        .get(wishLists.renderUpdate)
        .post(users.requiresLogin, wishLists.hasAuthorization, wishLists.update)
    
    app.route('/wishLists/delete/:wishListId')
        .post(users.requiresLogin, wishLists.hasAuthorization, wishLists.delete);

        
  app.param('wishListId', wishLists.wishListByID);
};