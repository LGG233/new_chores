module.exports = function (sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      notEmpty: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      // },
      // family_status: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   notEmpty: true
    }
  });
  return Users;
};
