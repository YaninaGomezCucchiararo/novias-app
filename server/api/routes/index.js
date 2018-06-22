const express = require('express')
const bodyParser = require('body-parser')
const logic = require('logic')
const jwt = require('jsonwebtoken')
const jwtValidation = require('./utils/jwt-validation')
const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: 'drnwaftur',
  api_key: '946871761846266',
  api_secret: 'BtBn8SZYFg_5z6Q5phLsCIYMdxg'
});

const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const upload = multer({
  storage: storage
});

const router = express.Router()

const { env: { TOKEN_SECRET, TOKEN_EXP } } = process

const jwtValidator = jwtValidation(TOKEN_SECRET)

const jsonBodyParser = bodyParser.json()

router.post('/users', jsonBodyParser, (req, res) => {
  const { body: { username, location, email, password } } = req
  logic.registerUser(username, location, email, password)
    .then(() => {
      res.status(201)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.post('/auth', jsonBodyParser, (req, res) => {
  const { body: { email, password } } = req

  logic.authenticateUser(email, password)
    .then(id => {
      const token = jwt.sign({ id }, TOKEN_SECRET, { expiresIn: TOKEN_EXP })

      res.status(200)
      res.json({ status: 'OK', data: { id, token } })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.get('/users/:userId', jwtValidator, (req, res) => {
  const { params: { userId } } = req

  return logic.retrieveUser(userId)
    .then(user => {
      res.status(200)
      res.json({ status: 'OK', data: user })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.patch('/users/:userId', [jwtValidator, jsonBodyParser], (req, res) => {
  const { params: { userId }, body: { username, location, email, password, newEmail, newPassword } } = req
  console.log(userId, username)

  logic.updateUser(userId, username, location, email, password, newEmail, newPassword)
    .then(() => {
      res.status(200)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.delete('/users/:userId', [jwtValidator, jsonBodyParser], (req, res) => {
  const { params: { userId }, body: { email, password } } = req

  logic.unregisterUser(userId, email, password)
    .then(() => {
      res.status(200)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.post('/users/:userId/products', [jwtValidator, upload.single('image')], (req, res) => {

  const { params: { userId }, body: { price, size, color, description } } = req
  const image = req.file.path.replace("\\", "/");

  debugger

  cloudinary.uploader.upload(image, function (result) {
    debugger

    logic.addProductToUser(userId, result.url, +price, +size, color, description)
      .then(() => {
        res.status(201)
        res.json({ status: 'OK' })
      })
      .catch(({ message }) => {
        res.status(400)
        res.json({ status: 'KO', error: message })
      })
  })
})

router.get('/products', (req, res) => {
  logic.listProducts()
    .then((products) => {
      res.status(200)
      res.json({ status: 'OK', data: products })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.get('/products/:productId', (req, res) => {
  const { params: { productId } } = req

  logic.productInfo(productId)
    .then((product) => {
      res.status(200)
      res.json({ status: 'OK', data: product })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.get('/users/:userId/products', [jwtValidator, jsonBodyParser], (req, res) => {
  const { params: { userId } } = req

  logic.retrieveUserProducts(userId)
    .then((products) => {
      res.status(200)
      res.json({ status: 'OK', data: products })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})

router.delete('/users/:userId/products/:productId', jwtValidator, (req, res) => {
  const { params: { productId, userId } } = req

  logic.deleteProduct(userId, productId)
    .then((product) => {
      console.log(res)
      res.status(200)
      res.json({ status: 'OK' })
    })
    .catch(({ message }) => {
      res.status(400)
      res.json({ status: 'KO', error: message })
    })
})
module.exports = router