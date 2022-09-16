import bcrypt from 'bcryptjs'

const user = [
  {
    name: 'Admin Rohit',
    email: 'rohit.sah.631@gmail.com',
    password: bcrypt.hashSync('mko0mko0', 10),
    isAdmin: true,
  },
  {
    name: 'Sahr3',
    email: '10791345@gmail.com',
    password: bcrypt.hashSync('mko0mko0', 10),
  },
]

export default user
