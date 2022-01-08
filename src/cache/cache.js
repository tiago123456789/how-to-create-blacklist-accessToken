const redis = require("ioredis");


class Cache {

    constructor() {
        this._cacheClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    }

    sadd(key, values, timeExpiration) {
        values = values.map(value => JSON.stringify(value));
        return new Promise((resolve, reject) => {
            this._cacheClient.sadd(key, values, async (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                await this.setExpirationTimeInKey(key, timeExpiration);
                resolve(values);
            });
        });
    }

    smembers(key) {
        return new Promise((resolve, reject) => {
            this._cacheClient.smembers(key, (error, values) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (values == null) {
                    resolve(null);
                    return;
                }

                values = values.map(value => JSON.parse(value));
                resolve(values);
            });
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this._cacheClient.get(key, (error, values) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(values);
            });
        });
    }

    setExpirationTimeInKey(key, timeExpiration) {
        return new Promise((resolve, reject) => {
            this._cacheClient.expire(key, timeExpiration, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    set(key, values, timeExpiration = 10) {
        return new Promise((resolve, reject) => {
            this._cacheClient.set(key, values, async (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                await this.setExpirationTimeInKey(key, timeExpiration);
                resolve(values);
            });
        });
    }

}

const cache = new Cache;

module.exports = cache;