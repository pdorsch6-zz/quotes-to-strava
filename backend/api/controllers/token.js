const Token = require('mongoose').model('Token');


module.exports.get = (req, res) => {
  Token.findOne({"_id": req.params.id})
    .then(token => {
      if (!token) {
        return res.status(404).json({
          status: 404,
          message: 'Token not found',
        });
      }

      return res.status(200).json({
        status: 'ok',
        token: token,
      });
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: err,
        message: 'An unexpected internal server error has occurred!',
      });
    });
};

module.exports.create = (req, res) => {
  new Token({
    _id: req.body.type,
    token: req.body.token
  })
    .save()
    .then(token => {
      return res.status(200).json({
        status: 'ok',
        token: token,
      });
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        error: err,
        message: 'An unexpected internal server error has occurred!',
      });
    });
};

module.exports.update = (req, res) => {
  Token.findOne({"_id": req.params.id})
    .then(async token => {

      if (!token) {
        return res.status(404).json({
          status: 404,
          message: 'Token not found',
        });
      }

      token.token = req.body.token;

      const updated = await token.save();

      return res.status(200).json({
        status: 'ok',
        token: updated
      });

    }).catch(err => {
    return res.status(500).json({
      status: 'error',
      error: err,
      message: 'An unexpected internal server error has occurred!',
    });
  });
}