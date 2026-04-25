module.exports.generateOtp = () =>{

    
    const otp = (Math.floor(Math.random() * 999999) + 1).toString();
    return otp;

}
