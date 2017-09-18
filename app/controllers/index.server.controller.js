exports.render = function(req, res) {
  res.render('index', {
    title: 'Home',
    pageTitle: 'Scotchy',
    userFullName: req.user ? req.user.fullName : ''
  });
};
 