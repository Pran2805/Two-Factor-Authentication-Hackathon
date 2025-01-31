import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/two-factor-authentication`)
        console.log(`Database is running on ${connection.connection.host}`)
    } catch (error) {
        console.error("Error while connecting the database", error.message)   
        process.exit(1)
    }
}