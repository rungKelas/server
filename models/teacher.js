'use strict';
const bcryptjs = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.hasMany(models.Student)
      Teacher.hasMany(models.Lesson)
    }
  };
  Teacher.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'name is required'
        },
        notEmpty: {
          args: true,
          msg: 'name is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'address is required'
        },
        notEmpty: {
          args: true,
          msg: 'address is required'
        }
      }
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'birthdate is required'
        },
        notEmpty: {
          args: true,
          msg: 'birthdate is required'
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
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teacher',
    hooks: {
      beforeCreate(teacher){        
        let salt = bcryptjs.genSaltSync(10)
        let hash = bcryptjs.hashSync(teacher.password, salt)
        teacher.password = hash
      },
      beforeValidate(teacher){
        if (teacher.role == null || teacher.role == ''){
          teacher.role = "teacher"
        }
      }
    }
  });
  return Teacher;
};