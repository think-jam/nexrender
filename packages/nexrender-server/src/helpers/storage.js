const LocalStorageQueue = require("../queue/queue.fs");
const MongoDBQueue = require("../queue/queue.mongodb");

class Storage {
    constructor() {
        throw "use getInstance to obtain a Storage Object";
    }

    static getInstance(mongoDBConnection) {
        if (!Storage.instance) {
            if (mongoDBConnection === undefined || mongoDBConnection === null) {
                Storage.instance = new LocalStorageQueue();
            } else {
                Storage.instance = new MongoDBQueue(mongoDBConnection);
            }
        }
        return Storage.instance;
    }
}

module.exports = Storage;
