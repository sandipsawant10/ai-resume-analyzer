import express from 'express'
import resumeRoutes from "./src/routes/resume.route.js"

const app = express()

app.use(express.json())
app.use("/resume", resumeRoutes)

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})