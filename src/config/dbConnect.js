import mongoose from "mongoose";

async function conectaNaDatabase() {
    console.log('Todas as env:', JSON.stringify(process.env, null, 2));
    mongoose.connect(process.env.STRING_CONNECTION_DB);
                    
    return mongoose.connection;
};

export default conectaNaDatabase;