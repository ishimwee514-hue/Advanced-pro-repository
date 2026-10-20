import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import apiRoutes from './routes/index.js'
const app=express()
app.use(cors({origin(origin,callback){if(!origin||env.webOrigins.includes(origin))return callback(null,true);return callback(new Error('Origin is not allowed by Ruta API CORS configuration'))}}))
app.use(express.json({limit:'100kb'}))
app.use('/api',apiRoutes)
app.use(notFoundHandler)
app.use(errorHandler)
export default app
