const db = require('../db/connection')


const find = (schema) => {
    return db(schema);
}

const findById = (schema, id) => {
    return db(schema).where("id", id);
};

const findOne = (schema, query) => {
    return db(schema).where(query)
}

const addOne = (schema, insertValue, showData, includeTriggerModifications) => {
    return db(schema).insert(insertValue, showData, { includeTriggerModifications: includeTriggerModifications });
};

const addManyWithIgnore = (schema, insertValue, showData, onConflict) => {
    return db(schema).insert(insertValue, showData).onConflict(onConflict).ignore()
}

const addManyWithUpsert = (schema, insertValue, showData, onConflict) => {
    return db(schema).insert(insertValue, showData).onConflict(onConflict).merge()
}

const updateById = (schema, id, post) => {
    return db(schema)
        .where("id", id)
        .update(post);
};

const updateOne = (schema, query, insertValue) => {
    return db(schema).where(query).update(insertValue)
}

const removeById = (schema, id) => {
    return db(schema)
        .where("id", id)
        .del();
};

module.exports = {
    db,
    find,
    findById,
    findOne,
    addOne,
    addManyWithIgnore,
    addManyWithUpsert,
    updateById,
    updateOne,
    removeById
};