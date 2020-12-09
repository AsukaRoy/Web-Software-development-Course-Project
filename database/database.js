import { Client } from "../deps.js";
import { config } from "../config/config.js";
import { Pool } from "../deps.js";

const CONCURRENT_CONNECTIONS = 1;

const client = new Client(config.database);

const executeQuery = async(query, ...args) => {
    try {
        await client.connect();
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
        await client.end();
    }
}


export { executeQuery };