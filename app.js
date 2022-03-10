require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Blog = require('./models/blog');

//mongoose
const mongoose = require('mongoose');
const { render } = require('ejs');
// express app
const app = express();
//port change heroku
const port = process.env.PORT || 3000;

//Connect to mongodb
const dbURI = "mongodb+srv://vikram:Vikram1234@cluster0.okhte.mongodb.net/NodeBasics?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port)
    })
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//   const blog = new Blog({
//     title: "title2",
//     snippet: "snippet1",
//     body: 'body1'
//   });
//   blog.save().then((result) => {
//     res.send(result)
//   }).catch((err) => {
//     console.log(err);
//   }); 
// }); 

// app.get('/all-blogs', (req, res) => {
//   Blog.find()
//   .then((result) => {
//     res.send(result)
//   }).catch((err) => {
//     console.log(err)
//   });
// });

// app.get("/single", (req, res) => {
//   Blog.findById("6228d382546d72f3a85c1342")
//   .then((result) => {
//     res.send(result);
//   }).catch((err) => {
//     console.log(err);
//   });
// })


// app.use((req, res, next) => {
//     console.log('new request made:');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     next();
// });

// app.use((req, res, next) => {
//     console.log('in the next middleware');
//     next();
// });

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.redirect('/all-blogs');
});
//get all blogs
app.get('/all-blogs', (req, res) => {
    Blog.find().sort({ createdAt: 1 })
        .then((result) => {
            res.render('index', { title: 'All - Blogs', blogs: result })
        }).catch((err) => {
            console.log(err);
        });
})

//post a blog
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body)
    blog.save()
        .then((result) => {
            res.redirect('/all-blogs');
        })
        .catch((err) => {
            console.log(err);
        });
});

//get blog by id
app.get('/all-blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: "Blog Details" });
        })
        .catch((err) => {
            console.log(err);
        });
})

//delete blogs
app.delete('/all-blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/all=blogs' })
        })
        .catch(err => console.log(err));
})


// app.use((req, res, next) => {
//     console.log('in the next middleware 2');
//     next();
// });

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});