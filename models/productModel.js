// const {DataType} = require("sequelize/types");
// const {sequelize} = require(".")

module.exports = (sequelize, DataType) => {
  const Product = sequelize.define("product", {
    title: {
      type: DataType.STRING,
      allowNull: false,
    },
    price: {
      type: DataType.INTEGER,
    },
    description: {
      type: DataType.TEXT,
    },
    published: {
      type: DataType.BOOLEAN,
    },
  });

  return Product;
};
