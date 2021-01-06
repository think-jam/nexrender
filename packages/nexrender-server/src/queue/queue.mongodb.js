const { MongoClient } = require("mongodb");
const Queue = require("./queue");

class MongoDBQueue extends Queue {
    constructor(mongoDBConnection) {
        super();
        this.client = new MongoClient(mongoDBConnection, {
            useUnifiedTopology: true,
        });
        this._connect();
        this.database = this.client.db("thinkjam");
        this.collection = this.database.collection("queue");
    }

    async _connect() {
        try {
            // Connect the client to the server
            await this.client.connect();
            // Establish and verify connection
            await this.client.db("admin").command({ ping: 1 });
            console.log("Connected successfully to server");
        } catch (e) {
            console.error(e);
        }
    }

    async _doFetch(key) {
        if (key !== undefined) {
            return this.collection.findOne({ uid: key }) || undefined;
        }

        const cursor = this.collection.find(
            { state: "queued" },
            { limit: 100 }
        );
        if ((await cursor.count()) === 0) {
            return [];
        }
        let data = [];
        await cursor.forEach((value) => {
            data.push(value);
        });

        return data;
    }

    async _doInsert(entry) {
        const now = new Date();

        entry.updatedAt = now;
        entry.createdAt = now;
        await this.collection.insertOne(entry);
    }

    async _doUpdate(key, entry) {
        await this.collection.updateOne(
            { uid: key },
            { $set: { ...entry, updatedAt: new Date() } }
        );

        return await this._doFetch(key);
    }

    async _doRemove(key) {
        return await this.collection.deleteOne({ uid: key });
    }

    async _doCleanUp() {
        return await this.collection.drop();
    }
}

module.exports = MongoDBQueue;
