const os = require("os");
const fs = require("fs");
const path = require("path");
const Queue = require("./queue");

/* initial data */
const defaultPath = path.join(os.homedir(), "nexrender");
const defaultName = "database.js";

class LocalStorageQueue extends Queue {
    constructor() {
        super();
        this.database = process.env.NEXRENDER_DATABASE
            ? process.env.NEXRENDER_DATABASE
            : path.join(defaultPath, defaultName);

        this.data =
            fs.existsSync(this.database) &&
            fs.readFileSync(this.database, "utf8")
                ? JSON.parse(fs.readFileSync(this.database, "utf8"))
                : [];

        // Private Methods
        this._save = () =>
            fs.writeFileSync(this.database, JSON.stringify(this.data));
        this._indexOf = (value) => {
            for (var i = this.data.length - 1; i >= 0; i--) {
                const entry = this.data[i];
                if (entry.uid == value) {
                    return i;
                }
            }
            return -1;
        };
    }

    _doFetch(key) {
        return key ? this.data[this._indexOf(key)] : this.data;
    }

    _doInsert(entry) {
        const now = new Date();

        entry.updatedAt = now;
        entry.createdAt = now;

        this.data.push(entry);
        setImmediate(this._save);
    }

    _doUpdate(key, entry) {
        const value = this._indexOf(key);

        if (value == -1) {
            return null;
        }

        const now = new Date();

        this.data[value] = Object.assign({}, this.data[value], entry, {
            updatedAt: now,
        });

        setImmediate(this._save);
        return this.data[value];
    }

    _doRemove(key) {
        const value = this._indexOf(key);

        if (value === -1) {
            return null;
        }

        this.data.splice(value, 1);
        setImmediate(this._save);
        return true;
    }

    _doCleanUp() {
        this.data = [];
        this._save();
    }
}
module.exports = LocalStorageQueue;
