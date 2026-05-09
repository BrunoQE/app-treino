import mongoose from "mongoose";

async function conectaNaDatabase() {
    mongoose.connect(process.env.STRING_CONNECTION_DB);
                    
    return mongoose.connection;
};

export default conectaNaDatabase;