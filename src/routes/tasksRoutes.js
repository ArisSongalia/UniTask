import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  console.log("Task saved:", req.body)

  res.json({
    success: true,
    task: req.body
  })
})

export default router