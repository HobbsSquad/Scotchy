const mongoose = require('mongoose');
const WishList = mongoose.model('WishList');
const Scotch = mongoose.model('Scotch');

function getErrorMessage (err) {
    if (err.errors) {
    for (let errName in err.errors) {
        if (err.errors[errName].message) return err.errors[errName].message;
    }
    } else {
        return 'Unknown server error';
    }
};

exports.renderWishLists = function(req, res, next) {
    WishList.find().sort('wishListName').populate('creator', '').exec((err, wishLists) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.render('wishlists/wishLists', {
                title: 'Wish Lists',
                pageTitle: 'Wish Lists',
                result: wishLists,
                messages: req.flash('error')
            });
        }
    });
};

exports.renderWishListDetails = function(req, res, next) {
    const wishList = req.wishList;

    Scotch.find({'wishLists' : wishList.wishListName}).sort('distillerName flavor age').populate('creator', '').exec((err, scotches) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.render('wishlists/wishListDetails', {
                title: 'Wish List',
                pageTitle: wishList.wishListName + " Wishlist",
                wishList: wishList,
                scotches: scotches,
                messages: req.flash('error')
            });
        }
    });
}

exports.renderNewWishList = function(req, res, next) {
    res.render('wishlists/newWishList', {
        title: 'New Wish List',
        pageTitle: 'New Wish List',
        messages: req.flash('error')
    });
}

exports.create = function(req, res) {
    const wishList = new WishList(req.body);
    wishList.creator = req.user;
    
    wishList.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.redirect('/wishlists');
        }
    });
};

exports.renderUpdate = function(req, res, next) {
    const wishList = req.wishList;
    res.render('wishlists/updateWishList', {
        title: 'Update Wish List',
        pageTitle: 'Update ' + wishList.wishListName,
        wishList: wishList,
        messages: req.flash('error')
    });
};

exports.update = function(req, res) {
    const wishList = req.wishList;

    wishList.wishListName = req.body.wishListName;

    wishList.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.redirect('/wishlists');
        }
    });
};

exports.renderDeleteWishList = function(req, res, next) {
    const wishList = req.wishList;
    
    res.render('wishlists/deleteWishList', {
        title: 'Delete Wish List',
        pageTitle: 'Delete ' + wishList.wishListName + '?',
        messages: req.flash('error')
    });
}

exports.delete = function(req, res) {
  const wishList = req.wishList;

  wishList.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.redirect('/wishlists');
    }
  });
};

exports.wishListByID = function(req, res, next, id) {
  WishList.findById(id).populate('creator', '').exec((err, wishList) => {
    if (err) return next(err);
    if (!wishList) return next(new Error('Failed to load wish list ' + id));

    req.wishList = wishList;
    next();
  });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.wishList.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};