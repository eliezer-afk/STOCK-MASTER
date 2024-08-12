// Configuracion del servidor

import express from 'express'
import colors from 'colors'
import router from './router'
import db from './config/db'

// Conectar a la BD
async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bgBlue.white('Conexion Exitosa a la BD'))
    } catch (error) {
        // console.log(error)
        console.log(colors.bgRed.white('Hubo un error al conectar a la BD'))
    }
}

connectDB()

// Instancia de express
const server = express()

// Leer datos de formularios
server.use(express.json())

server.use('/api/products', router)



export default server