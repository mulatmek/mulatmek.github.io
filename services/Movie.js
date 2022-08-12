const Movie = require('../models/Movie');

function getValueForNextSequence(sequenceOfName) {
    var sequenceDoc = Movie.mongoose.sample.findAndModify({ //check how to reach sample collection
        query: {_id: sequenceOfName},
        update: {$inc: {sequence_value: 1}},
        new: true
    });

    return sequenceDoc.sequence_value;
}

const createMovie = async (body) => {
    const movie = new Movie({
        _id: getValueForNextSequence("item_id"),
        title: body.title,
        year: body.year,
        genre: body.genre,
        description: body.description,
        imageUrl: body.imageUrl,
        trailerVideo: body.trailerVideo
    });

    return await movie.save();
};

const getMovieById = async (id) => {
    return await Movie.findById(id);
};

const getMovieByTitle = async (title) => {
    return await Movie.find({'title': {$regex: `.*${title}.*`, $options:'i'}});
};

const getMoviesByGenre = async (genre) => {
    return await Movie.find({'genre': {$regex: `.*${genre}.*`, $options:'i'}});
};

const getReviewsByMovieId = async (id) => {
    return await Movie.findById(id, {'_id':0, 'reviews':1});
};

const deleteMovie = async (id) => {
    const movie = await getMovieById(id);

    if (!movie)
        return null;

    await movie.remove();
    
    return movie;
};

const removeMovieReviews = async (review_ids) => {
    return Movie.update({}, {$pull:{"reviews":{$in:review_ids}}},{multi:true});
};


const countMovies = async () => {
    return await Movie.countDocuments({})
};

const countByGenre = async () => {
    return Movie.aggregate([
        {
            $group: {
                _id: "$genre",
                count: {$sum: 1}
            }
        },
        {
            $sort: {count:-1}
        },
        {
            $limit:6
        }
    ]);
};


const updateMovie = async (id, body) => {
    const movie = await getMovieById(id);
    if (!movie)
        return null;

    movie.title = body.title;
    movie.year = body.year;
    movie.genre = body.genre;
    movie.description = body.description;
    movie.imageUrl = body.imageUrl;
    movie.trailerVideo = body.trailerVideo;
    await movie.save();
    return movie;
};

const updateReviewOfMovie = async (id, review) => {
    const movie = await getMovieById(id);
    if (!movie)
        return null;

    if (!review)
        return null

    if (movie.reviews.indexOf(review._id) === -1) {
        movie.reviews.push(review._id);
    }
    await movie.save();

    return movie;
};

module.exports = {
    createMovie,
    getMovieById,
    getMovieByTitle,
    getMoviesByGenre,
    getReviewsByMovieId,
    deleteMovie,
    removeMovieReviews,
    countMovies,
    countByGenre,
    updateMovie,
    updateReviewOfMovie,
}
