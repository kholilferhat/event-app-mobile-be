const db = require('../db/connection')


const find = () => {
    return db('users');
}

const findById = id => {
    return db("users").where("id", id);

};

const addUser = user => {
    return db("users").insert(user, '*', { includeTriggerModifications: true });
};

const updateUser = (id, post) => {
    return db("users")
        .where("id", id)
        .update(post);
};

const removeUser = id => {
    return db("users")
        .where("id", id)
        .del();
};

module.exports = {
    find,
    findById,
    addUser,
    updateUser,
    removeUser
};