const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcryptjs');



function createUser(name, username, email, password, profile, callback) {
    const cryptoPassword = bcrypt.hashSync(password, 10);
    global.db.collection("users").insertOne({ name, username, email, password: cryptoPassword, profile }, callback);
}

function resetPassword(email, callback) {
    const utils = require('./utils');
    const newPassword = utils.generatePassword();
    const cryptoPassword = bcrypt.hashSync(newPassword, 10);
    global.db.collection("users").updateOne({ email: email }, { $set: { password: cryptoPassword } }, (err, res) => {
        callback(err, res, newPassword);
    });
}

function countAll(callback) {
    global.db.collection("users").countDocuments(callback);
}

const TAMANHO_PAGINA = 5;
function findAllUsers(pagina, callback) {
    const totalSkip = (pagina - 1) * TAMANHO_PAGINA;
    global.db.collection("users").find().skip(totalSkip).limit(TAMANHO_PAGINA).toArray(callback);
}

function findUser(id) {
    const objectId = new ObjectId(id);
    return global.db.collection("users").findOne({ _id: objectId });
}

function updateUser(id, user) {
    const objectId = new ObjectId(id);
    return global.db.collection("users").updateOne({ _id: objectId }, { $set: user });
}

function deleteUser(id) {
    const objectId = new ObjectId(id);
    return global.db.collection("users").deleteOne({ _id: objectId })
}

module.exports = {
    createUser, resetPassword, findAllUsers, TAMANHO_PAGINA, countAll, deleteUser, updateUser, findUser
}