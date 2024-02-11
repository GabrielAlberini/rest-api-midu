import express from 'express'
import { exportUsers, findIndexUser, findUserById } from './utils/users.js'
import { validatePartialUser, validateUser } from './validators/users.js'
import { hashPassword } from './utils/password.js'
import crypto from 'node:crypto'

const PORT = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')
app.use(express.json())

app.get('/users', async (req, res) => {
  try {
    const users = await exportUsers()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

app.get('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await findUserById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    const { name, age, email, city, state, role } = user
    return res.status(200).json({ name, age, email, city, state, role })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

app.post('/users', async (req, res) => {
  try {
    const response = await validateUser(req.body)

    if (response.error) {
      return res.status(400).json({ error: JSON.parse(response.error.message) })
    }

    response.data.password = Buffer.from(response.data.password, 'utf-8').toString('base64')
    response.data.id = crypto.randomUUID()

    return res.status(201).json(response.data)
  } catch (error) {
    console.error('Error in patching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.patch('/users/:id', async (req, res) => {
  try {
    const [response, indexUser, users] = await Promise.all([
      validatePartialUser(req.body),
      findIndexUser(req.params.id),
      exportUsers()
    ])

    if (response.error) {
      return res.status(400).json({ error: JSON.parse(response.error.message) })
    }

    if (indexUser === -1) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (response.data.password) {
      response.data.password = await hashPassword(response.data.password)
    }

    const updatedUser = { ...users[indexUser], ...response.data }

    users[indexUser] = updatedUser

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error in patching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [indexUser, users] = await Promise.all([
      findIndexUser(id),
      exportUsers()
    ])

    if (indexUser === -1) return res.status(404).json({ error: 'User not found' })

    users.splice(indexUser, 1)

    return res.status(200).json({ message: `User ${id} deleted successfully` })
  } catch (error) {
    console.error('Error in patching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
