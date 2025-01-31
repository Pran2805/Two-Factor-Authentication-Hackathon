import jwt from "jsonwebtoken"

export const generateToken = async(userID) =>{
    const token = jwt.sign({userID}, process.env.SECRET_KEY,
        {
            expiresIn: "7d"
            }
            );

            return token;
}