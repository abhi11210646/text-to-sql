import pg from 'pg'
const { Client } = pg
const client = new Client("pg://mobilesync:mobilesync@localhost/mobilesync")
await client.connect()

export default client;

export const get_Schema = () => {
    // SELECT table_name, column_name, data_type, is_nullable
    // FROM information_schema.columns
    // WHERE table_schema = 'public'
    // ORDER BY table_name, ordinal_position;
    
}