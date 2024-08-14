import {Request, Response } from 'express'
import { validationResult } from 'express-validator'


export const handleInputErrors=(req, res, next) =>{
    
    //Validación de datos
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}