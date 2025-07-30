module.exports = (sequelize, DataTypes) => {
  class News extends DataTypes.Model {}

  News.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    publishedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    obsolete: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  }, {
    sequelize,
    modelName: 'News',
    //schema: 'dentiste',
  });

  return News;
}
