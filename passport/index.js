const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const { Post } = require('../models');
const Like = require('../models/like');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }
      , {
        model: Post,
        attributes: ['id'],
        as: 'Likeys',
      }
    ], 
    })
      .then(user => {
        console.log(user)
        return done(null, user)})
      .catch(err => done(err));
  });

  local();
  kakao();
};
