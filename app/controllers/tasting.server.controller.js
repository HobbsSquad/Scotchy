const mongoose = require('mongoose');
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
