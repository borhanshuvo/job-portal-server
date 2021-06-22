const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const admin = require('firebase-admin');
const serviceAccount = require("./job-portal-jp-firebase-adminsdk-xglwf-a30c393fff.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.get('/', (req, res) => {
    res.send('Hello Buddy');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzcd4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const adminsCollection = client.db("jobPortal").collection("admin");
    const jobSeekersCollection = client.db("jobPortal").collection("jobSeeker");
    const employeesCollection = client.db("jobPortal").collection("employee");
    const servicesCollection = client.db("jobPortal").collection("service");
    const bookingCollection = client.db("jobPortal").collection("booking");
    const jobPostCollection = client.db("jobPortal").collection("jobPost");
    const jobApplyCollection = client.db("jobPortal").collection("jobApply");

    // add admin
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminsCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // all admin list
    app.get('/adminList', (req, res) => {
        adminsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // find admin user
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

    // add employee
    app.post('/addEmployee', (req, res) => {
        const employee = req.body;
        employeesCollection.insertOne(employee)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // all employee list
    app.get('/employeeList', (req, res) => {
        employeesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // find employee user
    app.post('/isEmployee', (req, res) => {
        const email = req.body.email;
        employeesCollection.find({ email: email })
            .toArray((err, employees) => {
                res.send(employees.length > 0);
            })
    })

    // add job seeker
    app.post('/addJobSeeker', (req, res) => {
        const jobSeeker = req.body;
        jobSeekersCollection.insertOne(jobSeeker)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // all job seeker list
    app.get('/jobSeekerList', (req, res) => {
        jobSeekersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // find job seeker user
    app.post('/isJobSeeker', (req, res) => {
        const email = req.body.email;
        jobSeekersCollection.find({ email: email })
            .toArray((err, jobSeekers) => {
                res.send(jobSeekers.length > 0);
            })
    })

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

});

app.listen(process.env.PORT || port);