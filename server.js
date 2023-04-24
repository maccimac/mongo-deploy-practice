const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { MongoClient } = require('mongodb');
const Schema = mongoose.Schema;
const DB_NAME = "practice_db"
const uri = "mongodb+srv://macci:macci@clusterdouglas.9f6w02l.mongodb.net/" + DB_NAME;

// MAKE SCHEMA
// const PropertySchema = new Schema({
//     property_id: { type: Number, required: true },
//     category: { type: Number, required: true },
//     bed: { type: Number, required: true },
//     bath: { type: Number, required: true },
//     address: {
//       city: { type: String, required: true },
//       street: { type: String, required: true },
//       zipcode: { type: String, required: true },
//     },
//     furnishing: { type: Number, required: true },
//     carpet_area_sqm: { type: Number, required: true },
//     move_in_date: { type: Date, required: true },
//     tags: [{ type: Number, required: true }],
//     landlord_user_id: { type: Number, required: true },
//     lease_terms: { type: String, required: true },
//     imgs: [{ type: String, required: true }],
//     feature_img: { type: String, required: true },
//     rent_price: { type: Number, required: true },
//   });

  const BookSchema = new Schema({
    title: String,
    author: String,
    pages: Number,
    fiction: Boolean
  });
const Book =  mongoose.model('Book', BookSchema);
// const Property = mongoose.model('Property', PropertySchema);
// Parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

app.get('/books', function(req, res) {
    Book.find({}, function(err, books) {
      if (err) throw err;
      res.send(books);
    });
});

// :: PROPERTIES ::
// // Get all properties
// app.get('/properties', function(req, res) {
//     Property.find({}, function(err, properties) {
//       if (err) throw err;
//       res.send(properties);
//     });
// });
app.get('/book/:id', function(req, res) {
    Book.findOne({_id: req.params.id}, function(err, propertty) {
      if (err) throw err;
      res.send(propertty);
    });
});

// // Create a new property
app.post('/book', function(req, res) {
//   const book = new Book({
//     title: "Book",
//     author: "Anne Author",
//     pages: 1,
//     fiction: true
//   });
    const book = new Book(req.body)

  book.save(function(err) {
    if (err) throw err;
    res.send('Book created!');
  });
})

// // Update an existing property
app.put('/book/:id', function(req, res) {
    Book.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, property) {
      if (err) throw err;
      res.send(property);
    });
});

// // Delete property
app.delete('/book/:id', (req, res) => {
    Book.findOneAndDelete({_id: req.params.id}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting property from database');
      }
      else {
        res.send(result);
      }
    });
});


// Start the server
const port = 5000;
app.listen(port, function() {
  console.log(`Server is running on port: ${port}`);
});