require("dotenv").config()
const express = require("express")
const app = express()
const connectDB = require("./db/connect")

const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

const productRouter = require("./routes/products")

app.use(express.json())
app.use("/api/v1/products", productRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`server is listening on port: ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
