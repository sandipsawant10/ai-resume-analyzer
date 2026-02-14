import express from 'express'
import resumeRoutes from "./src/routes/resume.route.js"

const app = express()

app.use(express.json())
app.use("/resume", resumeRoutes)
const PORT = process.env.PORT || 5000

app.get('/', (req,res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})