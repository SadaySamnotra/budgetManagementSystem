const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: true,
        hooks: {
            beforeCreate: async (user, options) => {
                user.firstName = user.firstName.toLowerCase();
                user.lastName = user.lastName.toLowerCase();
                user.password = await bcrypt.hash(user.password, 10);
            },
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Expenses, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        User.hasMany(models.Budget, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return User; 
};