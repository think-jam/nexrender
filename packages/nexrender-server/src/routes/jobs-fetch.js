const { send } = require("micro");
const { fetch } = require("../helpers/database");

module.exports = async (req, res) => {
    if (req.params.uid) {
        console.log(`fetching job ${req.params.uid}`);
        const job = await fetch(req.params.uid);
        if (job === null) {
            send(res, 404, { "message": "job not found"})
        }
        send(res, 200, job);
    } else {
        console.log(`fetching list of all jobs`);
        const jobs = await fetch();
        send(res, 200, jobs ? jobs : []);
    }
};
