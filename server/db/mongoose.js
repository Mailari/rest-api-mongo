/*
 * File: mongoose.js
 * Project: node-todo-api
 * Created: Saturday, 2nd March 2019 9:26:56 am
 * Author: Mailari (mailari.hulihond@altorumleren.com)
 * Description: 
 * -----
 * Last Modified: Tuesday, 5th March 2019 9:30:04 am
 * Modified By: Mailari (mailari.hulihond@altorumleren.com)
 * -----
 * Copyright - 2019 Altorum leren pvt ltd
 */

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://mailari:mailari123@ds157574.mlab.com:57574/testingdb`, { useNewUrlParser: true });

module.exports = { mongoose };