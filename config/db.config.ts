import { MongoClient } from "mongodb"

const connection_url = process.env.DB_CONNECTION_URL || ''

export const client = new MongoClient(connection_url)