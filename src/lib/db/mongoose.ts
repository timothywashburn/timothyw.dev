import mongoose from 'mongoose'

interface DbConfig {
    uri: string
    options?: mongoose.ConnectOptions
}

interface ConnectionState {
    isConnected: boolean
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

class DatabaseConnection {
    private static instance: DatabaseConnection
    private state: ConnectionState = {
        isConnected: false,
        conn: null,
        promise: null
    }

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection()
        }
        return DatabaseConnection.instance
    }

    private getConfig(): DbConfig {
        const uri = process.env.MONGODB_URI
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables')
        }

        return {
            uri,
            options: {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            }
        }
    }

    public async connect(): Promise<typeof mongoose> {
        if (this.state.isConnected && this.state.conn) {
            return this.state.conn
        }

        if (this.state.promise) {
            return this.state.promise
        }

        try {
            const config = this.getConfig()
            this.state.promise = mongoose.connect(config.uri, config.options)
            const conn = await this.state.promise
            this.state.isConnected = true
            this.state.conn = conn

            mongoose.connection.on('connected', () => {
                console.info('successfully connected to mongodb')
            })

            mongoose.connection.on('error', (err) => {
                console.error('mongodb connection error:', err)
                this.state.isConnected = false
            })

            mongoose.connection.on('disconnected', () => {
                console.info('mongodb disconnected')
                this.state.isConnected = false
            })

            return conn
        } catch (error) {
            this.state.promise = null
            this.state.isConnected = false
            console.error('failed to connect to mongodb:', error)
            throw error
        }
    }
}

export async function dbConnect(): Promise<typeof mongoose> {
    try {
        const db = DatabaseConnection.getInstance()
        return await db.connect()
    } catch (error) {
        console.error('database connection failed:', error)
        throw error
    }
}

export default dbConnect