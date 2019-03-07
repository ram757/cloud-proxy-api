module.exports.buildPingResponseData = () => {
    let promise = new Promise(function (resolve, reject) {
        let pingResponseData = {
            status: 0,
            timestamp: new Date(),
            message: "Pong"
        };

        resolve(pingResponseData)
    });

    return promise;
}