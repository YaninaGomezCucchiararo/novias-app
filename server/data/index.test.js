require('dotenv').config()

const { mongoose, models: { User, Product } } = require('.')

const { expect } = require('chai')

const { env: { DB_URL } } = process

describe(`models (wedding-app)`, () => {

    const yaninaUser = {
        username: 'Yanina',
        email: 'y@gmail.com',
        password: '123',
        location: 'Barcelona'
    }

    const dressProduct = {
        image: 'image',
        price: 50,
        size: 38,
        color: 'blanco',
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In, quo exercitationem illo quae optio sunt facilis iusto blanditiis nam veritatis dignissimos vel ducimus animi, dicta sapiente voluptates molestias a totam."
    }

    before(() => mongoose.connect(DB_URL)) //nos conectamos a la base de datos

    beforeEach(() => Promise.all([
        User.remove(), Product.deleteMany()
    ]))

    describe(`create user`, () => {
        it('should succeed on correct data', () => {
            const user = new User(yaninaUser)

            return user.save()
                .then(user => {
                    expect(user).to.exist
                    expect(user._id).to.exist
                    expect(user.username).to.equal('Yanina')
                    expect(user.email).to.equal('y@gmail.com')
                    expect(user.password).to.equal('123')
                    expect(user.location).to.equal('Barcelona')
                    expect(user.products.length).to.equal(0)
                })
        })
    })

    describe(`create product`, () => {
        it('should succeed on correct data', () =>
            User.create(yaninaUser)
                .then(user => {

                    dressProduct.owner = user._id


                    const product = new Product(dressProduct)
                    return product.save()
                        .then(product => {
                            expect(product).to.exist
                            expect(product.image).to.equal('image')
                            expect(product.price).to.equal(50)
                            expect(product.size).to.equal(38)
                            expect(product.color).to.equal('blanco')
                            expect(product.owner).to.equal(user._id)

                            user.products.push(product._id)

                            return user.save()
                                .then(user => {
                                    expect(user.products.length).to.equal(1)
                                    expect(user.products[0]).to.equal(product._id)
                                })

                        })
                })

        )
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done))) // cerrar la base de datos una vez finalice la bateria de test
})
