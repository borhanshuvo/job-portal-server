const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello Buddy');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzcd4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const servicesCollection = client.db("jobPortal").collection("service");
    const bookingCollection = client.db("jobPortal").collection("booking");
    const jobPostCollection = client.db("jobPortal").collection("jobPost");
    const jobApplyCollection = client.db("jobPortal").collection("jobApply");
    const usersCollection = client.db("jobPortal").collection("users");

    // add service
    app.post('/addService', (req, res) => {
        const service = req.body;
        servicesCollection.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    // all service list
    app.get('/serviceList', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // delete service 
    app.delete('/delete/:id', (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    // single service
    app.get('/service/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })

    // add booking
    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        bookingCollection.insertOne(booking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    // find booked user
    app.get('/isBookedUser', (req, res) => {
        bookingCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0);
            })
    })

    // add job post
    app.post('/addJobPost', (req, res) => {
        const jobPost = req.body;
        jobPostCollection.insertOne(jobPost)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    // all job post per user
    app.get('/jobPostList', (req, res) => {
        jobPostCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // all job post list
    app.get('/allJobPostList', (req, res) => {
        jobPostCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // update status
    app.patch('/update/:id', (req, res) => {
        jobPostCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    // job post details by id
    app.get('/jobPostDataById/:id', (req, res) => {
        jobPostCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            });
    });

    // all job post per user
    app.get('/jobPostLists', (req, res) => {
        jobPostCollection.find({ status: 'active' })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // single job
    app.get('/jobApply/:id', (req, res) => {
        jobPostCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })

    // add apply job post
    app.post('/addApplyJobPost', (req, res) => {
        const jobPost = req.body;
        jobApplyCollection.insertOne(jobPost)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    // all apply job post per user
    app.get('/applyJobPostList', (req, res) => {
        jobApplyCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // all candidate per user
    app.get('/jobCandidate', (req, res) => {
        jobApplyCollection.find({ employeeEmail: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

     // add user
     app.post('/addUser', (req, res) => {
        const user = req.body;
        usersCollection.insertOne(user)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // all admin list
    app.get('/usersList', (req, res) => {
        usersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // find user
    app.get('/isUser', (req, res) => {
        const email = req.query.email;
        usersCollection.find({ email: req.query.email })
            .toArray((err, users) => {
                res.send(users);
            })
    })

});

app.listen(process.env.PORT || port);

// "start": "node index.js",
//     "start:dev": "nodemon index.js",