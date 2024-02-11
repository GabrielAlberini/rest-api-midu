import { users } from '../users.js'

const exportUsers = async () => {
  return users
}

const findUserById = async (id) => {
  const users = await exportUsers()
  console.log(users)
  return users.find((user) => user.id === id)
}

const findIndexUser = async (id) => {
  const users = await exportUsers()
  return users.findIndex((user) => user.id === id)
}

export { exportUsers, findUserById, findIndexUser }
