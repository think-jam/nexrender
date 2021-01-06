const os = require("os");
const fs = require("fs");
const path = require("path");
const Storage = require("./storage");

let _storage = undefined;

const initStorage = (storage) => {
    if (_storage === undefined) _storage = storage;
    else throw "Storage Already initialized"
};

const insert = async (entry) => { 
    checkStorage(); 
    return await _storage.insert(entry);
 }
const fetch = async (key) => await _storage.fetch(key);
const update = (key, entry) => _storage.update(key, entry);
const remove = (key, entry) => _storage.remove(key, entry);
const cleanup = () => _storage.cleanup();

const checkStorage = () => {
    if (_storage === undefined) {
        throw new "Storage not initialized"
    }
};

module.exports = {
    insert,
    fetch,
    update,
    remove,
    cleanup,
    initStorage,
};
