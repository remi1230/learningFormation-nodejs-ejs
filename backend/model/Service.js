module.exports = (sequelize, DataTypes) => {
  class Service extends DataTypes.Model {}

  Service.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    obsolete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    color: {
      type: DataTypes.STRING(7), // ex: "#ff0000"
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Service',
  });

  return Service;
}