import request from "supertest"
import server,{connectDB} from "../server"
import { json } from "sequelize"
import db from "../config/db"

describe('GET/api', () =>{
    it('should send back a json response',async() => {
        const res = await request(server).get('/api')
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body.msg).toBe('Desde API')

        expect(res.status).not.toBe(404)
        expect(res.body.msg).not.toBe('desde api')
    })
})


describe('connectDB',() => {
    it('should handle database connection error',async() => {
        jest.spyOn(db, 'authenticate') //creamos el spy (lo que observa, )
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
        
        const consoleSpy=jest.spyOn(console,'log')
        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith( //esperamos que el spy de nuestra consola tenga un string que contenga ese texto
            expect.stringContaining('Hubo un error al conectar a la BD')
        )
    })
})
