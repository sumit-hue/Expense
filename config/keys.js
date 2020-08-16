const username = require("../config/appConfig").username;
const password = require("../config/appConfig").password;
const dbName = require("../config/appConfig").dbName;

//module.exports = `mongodb+srv://${username}:${password}@cluster0-tewas.mongodb.net/${dbName}?retryWrites=true&w=majority`
//module.exports = `mongodb://${username}:${password}@cluster0-shard-00-00-tewas.mongodb.net:27017,cluster0-shard-00-01-tewas.mongodb.net:27017,cluster0-shard-00-02-tewas.mongodb.net:27017/${dbName}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
module.exports = `mongodb://${username}:${password}@cluster0-shard-00-00-kopre.mongodb.net:27017,cluster0-shard-00-01-kopre.mongodb.net:27017,cluster0-shard-00-02-kopre.mongodb.net:27017/${dbName}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`