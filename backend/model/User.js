const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends DataTypes.Model {
    // Méthodes d'instance ou de classe éventuelles
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Patient', 'Professional'),
      allowNull: false
    },
    obsolete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      /**
       * Hachage du mot de passe avant la création
       */
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },

      /**
       * Hachage du mot de passe avant la mise à jour
       * (uniquement si le champ password a été modifié)
       */
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return User;
};