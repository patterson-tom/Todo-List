const express = require('express');
const app = express();
const body_parser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const secrets = require('./secrets');

app.use(body_parser.json());
app.use(cors());

let db = null;
MongoClient.connect(secrets.db_url ,{ useUnifiedTopology: true }, function(err, database) {
    if (err){
        throw err;
    } 
    db = database.db("tododb");
    app.listen(8080, () => {
        console.log("Server started on port 8080");
    });
});

app.route('/api/tasks/:parentID').get((req, res) => {

    const pid = req.params.parentID;
    
    db.collection("tasks").find({parent: pid}).toArray(function(err, result){
        if (err) throw err;
        res.status(200).send({tasks:result});
    })
    
});

app.route('/api/tasks').post((req, res) => {
    
    db.collection("tasks").insertOne(req.body, function(err, result){
       if (err) throw err;
       res.status(201).send(req.body);
    });
});

app.route('/api/tasks/').put((req, res) => {
    
    const id = req.body._id;
    delete req.body._id;

    db.collection("tasks").updateOne({_id: ObjectId(id)}, {$set: req.body}, function(err, result){
        if (err) throw err;
        res.status(200).send(result);
    });
});

app.route('/api/tasks/:task_id').delete((req, res) => {
    
    const task_id = req.params.task_id;
    deleteTask(task_id);
    res.status(200);
});

function deleteTask(id){

    db.collection("tasks").find({parent: id}).toArray(function(err, result){
        if (err) throw err;
        result.forEach(task => {
            deleteTask(task._id.toString());
        })
    })
    db.collection("tasks").deleteOne({_id: ObjectId(id)}, function(err, result){
        if (err) throw err;
        return result;
    });
}
