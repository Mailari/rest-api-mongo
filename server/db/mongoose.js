
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://mailari:mailari123@ds157574.mlab.com:57574/testingdb`, { useNewUrlParser: true });

module.exports = { mongoose };