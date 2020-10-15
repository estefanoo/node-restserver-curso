//===============================
// puerto
//===============================

process.env.PORT = process.env.PORT || 3000;


//===============================
// Entorno
//===============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================
// Vencimiento del Token
//===============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===============================
// SEED de autenticación
//===============================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo';


//===============================
// Base de datos
//===============================
let urlDB;

if(process.env.NODE_ENV === 'dev'){

    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//===============================
// Google Client ID
//===============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '693998346741-8go6v64oe1t0qes9to2muitqljie6s3c.apps.googleusercontent.com'