'use strict'

require('dotenv').config()

const { mongoose, models: { User, Product } } = require('../')

const { env: { DB_URL } } = process

mongoose.connect(DB_URL)
    .then(() => mongoose.connection.dropDatabase())
    .then(() => {
        const yaninaUser = {
            username: 'Yanina',
            email: 'y@gmail.com',
            password: '123',
            location: 'Barcelona'
        }

        return User.create(yaninaUser)
            .then(({ _doc: { _id } }) => {
                console.log(`inserted user ${_id.toString()}`)

                return Promise.all([
                    Product.create({ image: 'http://artenovia-saramerino.com/wp-content/uploads/2017/07/CABECERA-NOVIAS-2018-HUELVAS-EVILLA-WHITE-ONE.jpg', price: 100, size: 42, color: 'white', owner: _id , description: 'Diseño muy elegante y suntuoso, que delinea la figura y luego abre hacia abajo.Realizado en encaje chantilly y tul de seda '}),
                    Product.create({ image: 'http://www.venenoenlapiel.com/7910-home_default/vestido-novia-manga-larga.jpg', price: 120, size: 38, color: 'cream', owner: _id, description: 'Diseño muy elegante y suntuoso, que delinea la figura y luego abre hacia abajo.Realizado en encaje chantilly y tul de seda ' }),
                    Product.create({ image: 'https://www.airebarcelona.com/wp-content/uploads/2017/10/Novia-aire-2018.jpg', price: 140, size: 40, color: 'black', owner: _id, description: 'Diseño muy elegante y suntuoso, que delinea la figura y luego abre hacia abajo.Realizado en encaje chantilly y tul de seda ' }),
                    Product.create({ image: 'http://artenovia-saramerino.com/wp-content/uploads/2017/07/CABECERA-NOVIAS-2018-HUELVAS-EVILLA-WHITE-ONE.jpg', price: 100, size: 42, color: 'white', owner: _id, description: 'Diseño muy elegante y suntuoso, que delinea la figura y luego abre hacia abajo.Realizado en encaje chantilly y tul de seda ' }),
                    Product.create({ image: 'http://www.venenoenlapiel.com/7910-home_default/vestido-novia-manga-larga.jpg', price: 120, size: 38, color: 'cream', owner: _id, description: 'Diseño muy elegante y suntuoso, que delinea la figura y luego abre hacia abajo.Realizado en encaje chantilly y tul de seda '}),
                    Product.create({ image: 'https://www.airebarcelona.com/wp-content/uploads/2017/10/Novia-aire-2018.jpg', price: 140, size: 40, color: 'black', owner: _id, description: 'Diseño muy elegante y suntuoso, que delinea la figura y luego abre hacia abajo.Realizado en encaje chantilly y tul de seda ' })
                ])
                    .then(res => {
                        res.forEach(item => console.log(`inserted dress ${item._doc._id}`))
                    })
            })
    })
    .then(() => mongoose.connection.close(() => console.log('done')))
    .catch(console.error)   