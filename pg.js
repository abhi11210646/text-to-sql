import pg from 'pg'
const { Client } = pg
const client = new Client("pg://mobilesync:mobilesync@localhost/mobilesync")
await client.connect()

export default client;