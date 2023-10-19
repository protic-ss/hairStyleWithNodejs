// const {DataType} = require("sequelize/types");
// const {sequelize} = require(".")

module.exports = (sequelize, DataType) => {
  const Review = sequelize.define("review", {
    rating: {
      type: DataType.INTEGER,
    },
    description: {
      type: DataType.TEXT,
    },
  });

  return Review;
};
