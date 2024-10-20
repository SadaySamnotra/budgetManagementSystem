    const {DataTypes}= require('sequelize');


    module.exports=(sequelize)=>{
        const Expenses = sequelize.define('Expenses',{
            expenseID:{
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            userID:{
                type:DataTypes.INTEGER,
                references:{
                    model:'Users',
                    key:'id'
                },
                onDelete:'CASCADE',
                onUpdate:'CASCADE'  
            },
            amount:{
                type:DataTypes.FLOAT,
                allowNull:false
            },
            category:{
                type:DataTypes.STRING,
            },
            dateOfExpense:{
                type:DataTypes.DATE,
                allowNull:false
            }
        },{
            timestamps:true
        });
        
        Expenses.associate = (models) => {
            Expenses.belongsTo(models.User, {
                foreignKey: 'userID',
                onDelete: 'CASCADE',   
                onUpdate: 'CASCADE'
            });
        };
        return Expenses;
    }
