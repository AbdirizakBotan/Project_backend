const userModel = require ("../model/userModel")
const crypto = require('crypto')
const { sendPasswordResetEmail } = require('../services/emailService')
//register User
const  registerUser = async (req,res)=>{
 try{
   const newUser = userModel(req.body)
   const saveUser = await newUser.save()

   if(saveUser){
    res.send(saveUser)
   }
 }catch(error){
 console.log(error)
 }
}

//login user
 const loginUser = async (req,res)=>{
    try{
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({ error: "Email and password are required" });
        }

        // First check if user exists
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(401).json({ error: "Email does not exist" });
        }

        // Then check password
        if(password !== user.password){
            return res.status(401).json({ error: "Password is incorrect" });
        }

        // If both are correct, send user data (without password)
        const userLogin = await userModel.findOne({ email }).select("-password");
        res.send(userLogin);
        
    } catch(error){
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
 }

//forgot password user
const forgotPasswordUser = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send email
        const emailSent = await sendPasswordResetEmail(email, resetToken);
        
        if (emailSent) {
            res.status(200).json({ 
                message: "Password reset link sent to your email",
                email: email 
            });
        } else {
            // If email failed, remove the reset token
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            
            res.status(500).json({ message: "Failed to send email. Please try again." });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

//reset password user
const resetPasswordUser = async (req, res) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        // Find user with valid reset token
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Update password and clear reset token
        user.password = password;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {registerUser, loginUser, forgotPasswordUser, resetPasswordUser}