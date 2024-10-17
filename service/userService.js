const {User} = require('../models/index');

const findByEmail = async(req)=>{
    const {email}=req.body;
    try{
        const result = await User.findOne({where:{email}});
        if(result){
            return result;
        }else{
            return null;
        }
    }catch(error){
        console.log(error);
    };
};

module.exports={
    findByEmail,
};