const { Sequelize } = require("sequelize");
const db = require("../config/Database");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const Category = db.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// (async () => {
//   await db.sync();
// })();

module.exports = Category;
