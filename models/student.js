'use strict';
const bcryptjs = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasMany(models.Score, {
        foreignKey: 'StudentId',
        sourceKey: 'id'
      })
      Student.belongsTo(models.Teacher, { foreignKey: 'id' })
      Student.hasMany(models.Score, { foreignKey: 'id' })
    }
  };
  Student.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'name is require'
        },
        notEmpty: {
          args: true,
          msg: 'name is require'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'address is require'
        },
        notEmpty: {
          args: true,
          msg: 'address is require'
        }
      }
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'birthdate is require'
        },
        notEmpty: {
          args: true,
          msg: 'birthdate is require'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isEmail: {
          args: true,
          msg: 'invalid email format'
        },
        notNull:{
          args: true,
          msg: 'email is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: {
          args: [5,32],
          msg: 'password should be 5 and 32 characters'
        },
        notNull:{
          args: true,
          msg: 'password is required'
        }
      }
    },
    role: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    teacherNote: DataTypes.STRING,
    TeacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
    hooks: {
      beforeCreate(teacher){        
        let salt = bcryptjs.genSaltSync(10)
        let hash = bcryptjs.hashSync(teacher.password, salt)
        teacher.password = hash
      },
      beforeValidate(teacher){
        if (!teacher.role){
          teacher.role = "student"
        }
      }
    }
  });
  return Student;
};