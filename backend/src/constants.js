export const options = {
    
        httpOnly: true,
        secure: process.env.NODE_DEV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        
}