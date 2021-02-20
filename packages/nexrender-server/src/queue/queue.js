/**
 * Queue interface to allow customs queue in nexrender
 * and should not be used
 */
class Queue {
    async fetch(key) {
        return await this._doFetch(key);
    }

    insert(entry) {
        if (entry === undefined || entry === null) {
            throw new Error("Invalid argument");
        }

        return this._doInsert(entry);
    }

    update(key, entry) {
        if (
            key === undefined ||
            key === null ||
            entry === undefined ||
            entry === null
        ) {
            throw new Error("Invalid argument");
        }

        return this._doUpdate(key, entry);
    }

    remove(key) {
        if (key === undefined || key === null) {
            throw new Error("Invalid argument");
        }

        return this._doRemove(key);
    }

    cleanup() {
        return this._doCleanUp();
    }

    // Must be overridden
    // _doFetch()
    // _doInsert()
    // _doUpdate()
    // _doRemove()
    // _doCleanUp()
}

module.exports = Queue