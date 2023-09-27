const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')
//Otra forma de llamar a los modelos
const Movies = db.Movie;
const {
    validationResult
} = require('express-validator')
const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {
                    movies
                })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {
                    movie
                });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
                order: [
                    ['release_date', 'DESC']
                ],
                limit: 5
            })
            .then(movies => {
                res.render('newestMovies', {
                    movies
                });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
                where: {
                    rating: {
                        [db.Sequelize.Op.gte]: 8
                    }
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
            .then(movies => {
                res.render('recommendedMovies.ejs', {
                    movies
                });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },
    create: function (req, res) {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const {
                title,
                rating,
                release_date,
                awards,
                length,
                genre_id
            } = req.body
            db.Movie.create({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length,
                genre_id,
            }).then(movie => {
                console.log(movie);
                return res.redirect('/movies')
            })
        } else {
            res.render('moviesAdd', {
                errors: errors.mapped(),
                old: req.body
            })
        }


    },
    edit: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                return res.render('moviesEdit', {
                    Movie: movie,
                    moment
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const {
                title,
                rating,
                awards,
                release_date,
                length
            } = req.body

            db.Movie.update({
                    title: title.trim(),
                    rating,
                    awards,
                    release_date,
                    length,
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(response => {
                    db.Movie.findByPk(req.params.id)
                        .then(movie => {
                            return res.redirect('/movies/detail/'+req.params.id)
                        })
                })
                .catch(error => console.log(error))
        } else {
            let id = req.params.id
                res.render('moviesEdit', {
                    moment,
                    id,
                   Movie:req.body,
                    errors: errors.mapped(),
                    old: req.body,
                    
                })
            
            
        }


    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                return res.render('moviesDelete', {
                    Movie: movie
                })
            })

    },
    destroy: function (req, res) {

        db.Movie.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(movie => {
                return res.redirect('/movies')
            })
    }

}

module.exports = moviesController;