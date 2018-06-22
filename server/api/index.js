require('dotenv').config()

const express = require('express')
const {mongoose} = require('data')

const router = require('./routes')
const cors = require('cors')


const { env: { PORT, DB_URL } } = process

console.log(PORT, DB_URL)
mongoose.connect(DB_URL)
 .then(() => {
   const port = PORT || process.argv[2] || 5000

   const app = express()
   app.use(cors())
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  //  });
   
   app.use('/api', router)

   app.use('/api/uploads', express.static('uploads/'))

   app.listen(port, () => console.log(`server running in port ${port}`))

   process.on('SIGINT', () => {
     console.log(`stopping server`)

     mongoose.connection.close(() => {
       console.log('db connection closed')

       process.exit()
     })
   })
 })
 .catch(console.error)