const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
  const Budget = sequelize.define('Budget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    budgetAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    month: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true
  });

Budget.associate=(model)=>{
    Budget.belongsTo(model.User,{
        foreignKey:'userID',
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })
};
  return Budget;
}


  