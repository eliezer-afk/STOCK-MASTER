import request from "supertest";
import server from "../../server";
import Product from "../../models/Product.model";
import e from "express";

describe('POST/api/products',() => {
    it('should display validation errors',async() => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)


        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name:"Mouse",
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)


        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that price is number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse",
            price: "hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)


        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse-Testing",
            price: 30,
            availability: true
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
        
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        
        expect(response.body).not.toHaveProperty('erro')
        
    })
})

describe('Get/api/products',() => {

    it('should check if api/products url exists', async() =>{
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    it('GET a JSON response with products', async() => {

        const response = await request(server).get('/api/products')
        
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET/api/products/:id',() =>{
    it('Should return a 404 respnse for a non-existent product',async() => {
        const productId=2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe("Producto no encontrado")
    })

    it('should check a valid ID in the URL', async() => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })
    

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')

    })
})

describe('PUT/api/product/:id', () => {

    it('should check a valid ID in the URL', async() => {
        const response = await request(server)
                                .put('/api/products/not-valid-url')
                                .send({
                                    
                                    name: "tele",
                                    price: 300,
                                    availability: true
                                    
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('should display validation error messages when updating a product',async() => {
        const response = await request(server).put('/api/product/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

       expect(response.status).not.toBe(200)
       expect(response.body).not.toHaveProperty('data')
    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server)
                                .put('/api/product/1')
                                .send({
                                    
                                    name: "tele",
                                    price: -300,
                                    availability: true
                                })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errrrs[0].msg).toBe("Valor de disponibilidad no valido")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent propduct', async () => {
        const productId=2000
        const response = await request(server).put('/api/products').send({
            name: "Mouse",
            price: 300,
            availability:true
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        
        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveProperty('data')
    })

    it('should update an existent propduct with valid data', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Mouse",
            price: 300,
            availability: true
        })
        expect(response.status).toBe(200)
        expect(response.body.error).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body.errors).not.toHaveProperty('errors')
    })


})

describe('DELETE/api/product/:id',() => {
    it('should check a valid ID', async() => {
        const response= await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })

    it('should return 404 response for a non existent product',async() => {
        const productId=2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")
        
        expect(response.status).not.toBe(200)
    })

    it('should delete a product',async() => {
        const response= await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto Eliminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    
    })
})

describe('PATCH/api/product/:id',() =>{
    it('should return a 404 response a non-existing product',async() => {
        const productId=2000
        const response=await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')

        it('should update the product availability', async() =>{
            const response = await request(server).patch('/api/products/1')
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('data')
            expect(response.body.data.availability).toBe(false)

            expect(response.status).not.toBe(400)
            expect(response.status).not.toBe(204)
            expect(response.body).not.toHaveProperty('error')

        })

    })
})