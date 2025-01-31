import bcrypt from "bcrypt"

export const hashingPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;

}