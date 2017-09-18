const mongoose = require('mongoose');
const Scotch = mongoose.model('Scotch');
const WishList = mongoose.model('WishList');

function getErrorMessage (err) {
    if (err.errors) {
    for (let errName in err.errors) {
        if (err.errors[errName].message) return err.errors[errName].message;
    }
    } else {
        return 'Unknown server error';
    }
};

exports.renderCatalog = function(req, res, next) {
    Scotch.find().sort('distillerName flavor age').populate('creator', '').exec((err, scotches) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.render('scotches/catalog', {
                title: 'Cabinet',
                pageTitle: 'Cabinet',
                result: scotches,
                messages: req.flash('error')
            });
        }
    });
};

exports.renderScotchDetails = function(req, res) {
    const scotch = req.scotch;
    console.log(scotch.inStock);
    res.render('scotches/scotchDetails', {
        title: scotch.dramName,
        pageTitle: scotch.dramName,
        scotch: scotch,
        messages: req.flash('error')
    });
};

exports.renderNewScotch = function(req, res, next) {
    res.render('scotches/newScotch', {
        title: 'New',
        pageTitle: 'New Scotch',
        messages: req.flash('error')
    });
}

exports.create = function(req, res) {
    const scotch = new Scotch(req.body);
    scotch.creator = req.user;
    
    scotch.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            //res.status(200).json(scotch);
            res.redirect('/scotches');
        }
    });
};


exports.renderNewScotchNote = function(req, res, next) {
    res.render('scotches/newScotchNote', {
        title: 'New Note',
        pageTitle: 'New Scotch Note',
        scotch: req.scotch,
        messages: req.flash('error')
    });
}

exports.addNote = function(req, res) {
    const scotch = req.scotch;
    scotch.notes.push(req.body);
    scotch.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            //res.status(200).json(scotch);
            res.redirect('/scotches/' + scotch._id);
        }
    });
};

exports.renderNewScotchTasting = function(req, res, next) {
    res.render('scotches/newScotchTasting', {
        title: 'New Tasting',
        pageTitle: 'New Tasting',
        scotch: req.scotch,
        messages: req.flash('error')
    });
}

exports.addTasting = function(req, res) {
    const scotch = req.scotch;
    scotch.tastings.push(req.body);
    scotch.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            //res.status(200).json(scotch);
            res.redirect('/scotches/' + scotch._id);
        }
    });
};

exports.renderNewScotchWishList = function(req, res, next) {
    res.render('scotches/newScotchWishList', {
        title: 'Add to Wish List',
        pageTitle: 'Add to Wish List',
        scotch: req.scotch,
        messages: req.flash('error')
    });
}

exports.addWishList = function(req, res) {
    const scotch = req.scotch;
    
    scotch.wishLists.push(req.body.wishListName);
    console.log(scotch);
    scotch.save((err) => {
        if (err) {
            return res.status(400).send({
                message: 'addWishList: ' + getErrorMessage(err)
            });
        } else {
            res.redirect('/scotches/' + scotch._id);
        }
    });
}

exports.renderUpdateScotch = function(req, res, next) {
    const scotch = req.scotch;
    res.render('scotches/updateScotch', {
        title: 'Update Scotch',
        pageTitle: 'Update ' + scotch.dramName,
        scotch: scotch,
        messages: req.flash('error')
    });
};

exports.update = function(req, res) {
    const scotch = req.scotch;

    scotch.distillerName = req.body.distillerName;
    scotch.flavor = req.body.flavor;
    scotch.age = req.body.age;
    scotch.inStock = req.body.inStock;
    scotch.region = req.body.region;
    scotch.style = req.body.style;
    scotch.comment = req.body.comment;

    scotch.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.redirect('/scotches');
            //res.redirect('back');
        }
    });
};

exports.renderDeleteScotch = function(req, res, next) {
    const scotch = req.scotch;
    res.render('scotches/deleteScotch', {
        title: 'Delete Scotch',
        pageTitle: 'Delete ' + scotch.dramName +'?',
        scotch: scotch,
        messages: req.flash('error')
    });
};


exports.delete = function(req, res) {
  const scotch = req.scotch;

  scotch.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.redirect('/scotches');
    }
  });
};

exports.renderTastings = function(req, res, next) {
    Scotch.find().sort('tasting.dateAdded').populate('creator', 'tastings').exec((err, tastings) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.render('scotches/tastings', {
                title: 'Tastings',
                pageTitle: 'Tastings',
                tastings: tastings,
                messages: req.flash('error')
            });
        }
    });
};

exports.scotchByID = function(req, res, next, id) {
  Scotch.findById(id).populate('creator', '').exec((err, scotch) => {
    if (err) return next(err);
    if (!scotch) return next(new Error('Failed to load scotch ' + id));

    req.scotch = scotch;
    next();
  });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.scotch.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};