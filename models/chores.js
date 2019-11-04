module.exports = function (sequelize, DataTypes) {
  var Chores = sequelize.define("Chores", {
    chore_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      references: {
        model: 'Users', // Can be both a string representing the table name or a Sequelize model
        key: 'username'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      notEmpty: true,
      references: {
        model: 'Users', // Can be both a string representing the table name or a Sequelize model
        key: 'user_id'
      }
    },
    chore: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overview: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chore_state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    }

  });
  return Chores;
};
