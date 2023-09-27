const { check, body } = require("express-validator");
const { min } = require("moment/moment");

module.exports=[
check('title')
    .notEmpty().withMessage('Titulo requerido')
    .isLength({min:3}).withMessage('Debe tener mas de 3 caracteres'),
check('rating')
    .notEmpty().withMessage('Debes ingresar un rating'),
check('awards')
    .notEmpty().withMessage('Debes ingresar premios '),
check('release_date')
    .notEmpty().withMessage('Ingrese fecha de estreno!')
]