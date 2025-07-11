import express from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import { HealthResponseSchema, type HealthResponse } from 'api-types'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/health', (req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }

  const validatedResponse = HealthResponseSchema.parse(response)
  res.json(validatedResponse)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
