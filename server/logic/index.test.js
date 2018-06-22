'use strict'

require('dotenv').config()

const { mongoose, models: { User, Product } } = require('data')
const { expect } = require('chai')
const logic = require('.')
const _ = require('lodash')


const { env: { DB_URL } } = process

describe('logic wedding-app', () => {
    const userData = { username: 'yanina', location: 'Barcelona', email: 'y@mail.com', password: '123' }
    const otherUserData = { username: 'vanesa', location: 'Madrid', email: 'vanesa@mail.com', password: '456' }
    const productData = { image: 'image', price: 200, size: 42, color: 'white', description: 'vestido corte princesa' }

    const dummyUserId = '123456781234567812345678'
    const dummyProductId = '123456781234567812345678'

    const indexes = []

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove(), Product.deleteMany()])
    })

    describe('resgister user', () => {
        it('should succeed on correct data', () => {
            logic.registerUser('yanina', 'Barcelona', 'y@gmail.com', '123')
                .then(res => expect(res).to.be.true)
        })

        it('should fail on already registered user', () => {
            User.create(userData)
                .then(() => {
                    const { username, location, email, password } = userData

                    return logic.registerUser(username, location, email, password)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with email ${userData.email} already exists`)
                })
        })

        it('should fail on no username', () =>
            logic.registerUser()
                .catch(({ message }) => expect(message).to.equal('user username is not a string'))
        )

        it('should fail on empty user location', () =>
            logic.registerUser(userData.username, '')
                .catch(({ message }) => expect(message).to.equal('user location is empty or blank'))
        )

        it('should fail on blank user location', () =>
            logic.registerUser(userData.username, '     ')
                .catch(({ message }) => expect(message).to.equal('user location is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.registerUser(userData.username, userData.location)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.registerUser(userData.username, userData.location, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.registerUser(userData.username, userData.location, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.registerUser(userData.username, userData.location, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.registerUser(userData.username, userData.location, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.registerUser(userData.username, userData.location, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() =>
                    logic.authenticateUser('y@mail.com', '123')
                        .then(id => expect(id).to.exist)
                )
        )

        it('should fail on no user email', () =>
            logic.authenticateUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.authenticateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.authenticateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.authenticateUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.authenticateUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.authenticateUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('retrieve user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.retrieveUser(id)
                    
                })
                .then(user => {
                    expect(user).to.exist

                    const { username, location, email, _id, password, products } = user

                    expect(username).to.equal('yanina')
                    expect(location).to.equal('Barcelona')
                    expect(email).to.equal('y@mail.com')

                    expect(_id).to.be.undefined
                    expect(password).to.be.undefined
                    expect(products).to.be.an('array')
                })
        )

        it('should fail on no user id', () =>
            logic.retrieveUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })
    //===================Update===================//
    describe('udpate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.updateUser(id, 'vanesa', 'Madrid', 'y@mail.com', '123', 'vanesa@mail.com', '456')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.exist

                            const { username, location, email, password } = user

                            expect(user.id).to.equal(id)
                            expect(username).to.equal('vanesa')
                            expect(location).to.equal('Madrid')
                            expect(email).to.equal('vanesa@mail.com')
                            expect(password).to.equal('456')
                        })
                })
        )

        it('should fail on changing email to an already existing user\'s email', () =>
            Promise.all([
                User.create(userData),
                User.create(otherUserData)
            ])
                .then(([{ id: id1 }, { id: id2 }]) => {
                    const { username, location, email, password } = userData

                    return logic.updateUser(id1, username, location, email, password, otherUserData.email)
                })
                .catch(({ message }) => expect(message).to.equal(`user with email ${otherUserData.email} already exists`))
        )

        it('should fail on no user id', () =>
            logic.updateUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.updateUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.updateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no username', () =>
            logic.updateUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user username is not a string'))
        )

        it('should fail on empty username', () =>
            logic.updateUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user username is empty or blank'))
        )

        it('should fail on blank username', () =>
            logic.updateUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user username is empty or blank'))
        )

        it('should fail on no user location', () =>
            logic.updateUser(dummyUserId, userData.username)
                .catch(({ message }) => expect(message).to.equal('user location is not a string'))
        )

        it('should fail on empty user location', () =>
            logic.updateUser(dummyUserId, userData.username, '')
                .catch(({ message }) => expect(message).to.equal('user location is empty or blank'))
        )

        it('should fail on blank user location', () =>
            logic.updateUser(dummyUserId, userData.username, '     ')
                .catch(({ message }) => expect(message).to.equal('user location is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.updateUser(dummyUserId, userData.username, userData.location)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.updateUser(dummyUserId, userData.username, userData.location, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.updateUser(dummyUserId, userData.username, userData.location, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.updateUser(dummyUserId, userData.username, userData.location, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.updateUser(dummyUserId, userData.username, userData.location, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.updateUser(dummyUserId, userData.username, userData.location, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    //==================Unregister====================//
    describe('unregister user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.unregisterUser(id, 'y@mail.com', '123')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.be.null
                        })
                })
        )

        it('should fail on no user id', () =>
            logic.unregisterUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.unregisterUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.unregisterUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.unregisterUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.unregisterUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.unregisterUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.unregisterUser(dummyUserId, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    //==================== Add Product =====================//
    describe('add product', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id: userId }) => {
                    const { image, price, size, color, description } = productData

                    return logic.addProductToUser(userId, image, price, size, color, description)
                        .then(productId => {
                            expect(productId).to.exist
                            expect(productId).to.be.a('string')

                            return User.findById(userId)
                                .then(user => {
                                    expect(user).to.exist

                                    expect(user.products).to.exist
                                    expect(user.products.length).to.equal(1)

                                    const { products: [product] } = user

                                    expect(product._id).to.exist
                                    expect(product._id.toString()).to.equal(productId)
                                })
                        })
                })
        )
    })
    //==================== List Products =====================//
    describe('list products', () => {
        const product = { owner: '123456781234567812345678', image: 'image', price: 200, size: 42, color: 'white', description: "vestido blanco" }

        it('should succeed on correct data', () => {
            return Promise.all([
                new Product(product).save()
            ])
                .then(([product]) => {
                    return logic.listProducts()
                        .then(res => {
                            
                            expect(res.length).to.be.equal(1)
                            expect(res[0]._id).to.be.exist
                            expect(res[0].owner).to.be.exist
                            expect(res[0].image).to.be.equal('image')
                            expect(res[0].price).to.be.exist
                            expect(res[0].price).to.be.equal(200)
                            expect(res[0].description).to.be.equal('vestido blanco')
                        })
                })
        })
    })
    //====================  Info Product =====================//
    describe('info product', () => {
        const product = { owner: '123456781234567812345678', image: 'image', price: 200, size: 42, color: 'white' }

        it('should succed on correct data', () => {
            Product.create(product)
                .then(({ _id }) => {
                    
                    return productInfo(_id)
                        .then(res => {
                            expect(res.length).to.be.exist
                            expect(res[0]._id).to.be.exist
                            expect(res[0].owner).to.be.exist
                            expect(res[0].image).to.be.equal('image')
                            expect(res[0].price).to.be.exist
                            expect(res[0].price).to.be.equal(200)
                            expect(res[0].description).to.be.equal('vestido blanco')
                        })
                })
        })

        after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done))) // cerrar la base de datos una vez finalice la bateria de test
    })


})
