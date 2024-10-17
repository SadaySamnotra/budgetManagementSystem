const {Expenses} = require('../models/index');

const getExpense = async(req,res)=>{
    try{
        const userID = req.user.id;
        const expense = await Expenses.findAll({where:{userID}});
        res.json(expense);
    }catch(error){
        console.log(error);
    }
}

module.exports=
{
    getExpense,
};