const express = require('express');
const _ = require('underscore');

const {verificaToken} = require('../middlewares/autenticacion');
const producto = require('../models/producto');

let app = express();

let Producto = require('../models/producto');


// ========================
// Obtener productos
// ========================

app.get('/productos',verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .skip(desde)
            .limit(5)
            .exec((err, productos) =>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    productos
                })
            });
});

// ========================
// Obtener producto por ID
// ========================

app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) =>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El ID del producto no existe'
                }
            });
        }

        res.json({
            ok:true,
            producto
        });
    });
});

// ========================
// Buscar producto
// ========================
app.get('/productos/buscar/:termino', verificaToken, (req,res) =>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                productos
            })
        })
})


// ========================
// Crear un nuevo producto
// ========================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
    });
});

// ========================
// Actualizar un producto
// ========================

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) =>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria= body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                producto: productoGuardado
            })
        });
    });
});

// ========================
// Borrar un producto
// ========================

app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, producto) =>{

        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }

        if(!producto){
            res.status(400).json({
                ok:false,
                err:{
                    message: 'El ID del producto no existe'
                }
            });
        }

        producto.disponible = false;

        producto.save((err, productoBorrado) => {

            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
        });
    });
});



module.exports = app;