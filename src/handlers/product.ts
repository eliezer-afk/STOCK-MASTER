import { Request, Response } from 'express'
import Product from '../models/Product.model'

//Obtener producto 
export const getProduct = async(req:Request, res:Response) => {
    
    const product = await Product.findAll({
        order:[
            ['price','ASC']     //ordenar datos al pedirlos
        ],
        attributes:{exclude:['createdAt','updaredAt','availability']} //que datos quiero obtener
    })
    res.json({data: product})
    
}

//Obtener producto por ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id)
        const {id} = req.params
        const product = await Product.findByPk(id)

        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        res.json({data : product})
    } catch (error) {
        console.log(error)

    }
}

//Crear producto 
export const createProduct = async(req : Request, res : Response) => {
 
    // Almacenar el Producto en la BD
    const product = await Product.create(req.body)
    res.status(201).json({ data: product })
}
//Actualizar producto 
export const updateProduct= async(req: Request, res: Response)=>{
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    //Actualizar
    await product.update(req.body)
    await product.save()

    res.json({ data: product })
}

//Actualizar disponibilidad del producto
export const updateAvailability= async(req: Request, res: Response) => {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    //Actualizar
    product.availability = !product.dataValues.availability
    await product.save()
    res.json({ data: product })
}

//Eliminar producto 
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    
    await product.destroy()
    res.json({data : 'Producto Eliminado'})
}

