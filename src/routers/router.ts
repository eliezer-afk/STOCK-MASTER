import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProduct, getProductById, updateAvailability, updateProduct} from '../handlers/product'
import { handleInputErrors } from '../middleware'

const router = Router()

// Routing

router.get('/',getProduct)
router.get('/:id', 
    param('id').isInt().withMessage('ID no valido'),    
    getProductById
)

router.post('/', 
    
    // Validacion
    body('name')
                .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),
                
                

    body('price')
                .isNumeric().withMessage('Valor no valido')
                .notEmpty().withMessage('El precio del Producto no puede ir vacio')
                .custom((value => value > 0)).withMessage('El precio debe ser mayor a cero'),
    handleInputErrors,
    createProduct
)

router.put('/:id',
    param('id').isInt().withMessage('ID no valido'),    
    
    body('name')
        .notEmpty().withMessage('El nombre del Producto no puede ir vacio'),



    body('price')
        .custom((value => value > 0)).withMessage('El precio debe ser mayor a cero'),
    body('availability')
                        .isBoolean().withMessage('Valor de disponibilidad no valido'),
    handleInputErrors,
    updateProduct
 )


router.patch('/:id', 
    param('id').isInt().withMessage('ID no valido'),    
    handleInputErrors,
    updateAvailability
)

router.delete('/:id',
    param('id').isInt().withMessage('ID no valido'),    
    handleInputErrors,
    deleteProduct
    
)

export default router
