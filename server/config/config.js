
var env = process.env.NODE_ENV || 'development';

if (env === 'test' || env === 'development' || env === 'production') {
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}



        // process.env.PORT = 3000;
        // process.env.MONGODB_URI = `################`;
        // process.env.JWT_SECRET = "###############";




// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 4000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// } else if (env === 'production') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = `mongodb://mailari:mailari123@ds157574.mlab.com:57574/testingdb` ||
//         'mongodb://vipin:vipin%40123@ds157574.mlab.com:57574/testingdb';
// }