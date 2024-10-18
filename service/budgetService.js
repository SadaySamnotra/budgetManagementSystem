const {Budget} = require('../models/index');

const getBudget = async(userID)=>{
    try{
        const budget = await Budget.findAll({where:{userID}});
        if(budget){
            return budget;
        }else return {};
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    getBudget,
}