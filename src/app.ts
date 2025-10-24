import express from 'express'
import nfeRoutes from './routes/nfe.routes'

const app = express()

app.use(express.json())
app.use('/nfe', nfeRoutes)

export default app
