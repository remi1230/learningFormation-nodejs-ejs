module.exports = (sequelize, DataTypes) => {
  class Appointment extends DataTypes.Model {}

  Appointment.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    //schema: 'dentiste',
  });

  return Appointment;
}
