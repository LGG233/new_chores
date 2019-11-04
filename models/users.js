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

// Users.beforeCreate((users, options) => {
//   const salt = bcrypt.genSaltSync();
//   users.password = bcrypt.hashSync(users.password, salt);
// });

// Users.prototype.validPassword = function (password) {
//   return bcrypt.compareSynch(password, this.password);
// };

// // create all defined tables in the specified db

// sequelize.sync()
//   .then(() => console.log("user tables has been successfully created if one does not exist"))
//   .catch(error => console.log("this error occured", error));

// module.exports = Users;
