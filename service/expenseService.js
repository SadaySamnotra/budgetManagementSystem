const {Expenses} = require('../models/index');

const getExpense = async(userID)=>{
    try{
        const expense = await Expenses.findAll({where:{userID}});
        return expense;
    }catch(error){
        console.log(error);
    }
}

module.exports=
{
    getExpense,
};