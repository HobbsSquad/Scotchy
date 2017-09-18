const users = require('../../app/controllers/users.server.controller');
const scotches = require('../../app/controllers/scotch.server.controller');

module.exports = function(app) {
    app.route('/scotches')
        .get(scotches.renderCatalog)
    
    app.route('/scotches/:scotchId')
        .get(scotches.renderScotchDetails)

    app.route('/scotches/new')
        .post(scotches.renderNewScotch)
        
    app.route('/scotches/create')
        .post(users.requiresLogin, scotches.create);
    
    app.route('/scotches/update/:scotchId')
        .get(scotches.renderUpdateScotch)
        .post(users.requiresLogin, scotches.hasAuthorization, scotches.update)
    
    app.route('/scotches/newScotchNote/:scotchId')
        .get(scotches.renderNewScotchNote)
        .post(users.requiresLogin, scotches.addNote);

    app.route('/scotches/newScotchTasting/:scotchId')
        .get(scotches.renderNewScotchTasting)
        .post(users.requiresLogin, scotches.addTasting);

    app.route('/scotches/newScotchWishList/:scotchId')
        .get(scotches.renderNewScotchWishList)
        .post(users.requiresLogin, scotches.addWishList);

    app.route('/scotches/delete/:scotchId')
        .get(scotches.renderDeleteScotch)
        .post(users.requiresLogin, scotches.hasAuthorization, scotches.delete);

    app.route('/tastings')
        .get(scotches.renderTastings);
    
    
  app.param('scotchId', scotches.scotchByID);
};