const { Sequelize } = require("sequelize");
const db = require("../config/Database");
const Category =  require('./Category');

const { DataTypes } = Sequelize;

const Product = db.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
  },    
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Product.hasOne(Category, {
  foreignKey: 'id'
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId'
});

// (async () => {
//   await db.sync();
// })();

module.exports = Product;
