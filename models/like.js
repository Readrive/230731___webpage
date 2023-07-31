const Sequelize = require('sequelize');

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      liker: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      postId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Like',
      tableName: 'likes',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.Post.belongsTo(db.User);
    db.User.belongsToMany(db.Post, {
      foreignKey: 'likerId',
      as: 'Likeys',
      through: 'Likeee',
    });
    db.Post.belongsToMany(db.User, {
      as: 'Likers',
      through: 'Likeee',
    });
  }
};