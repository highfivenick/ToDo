/*CRUD

Create - New Todos
Read - Our files
Update - Marking todos complete
Delete - todos*/
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;
//what does this mean...class collection() - how does it know

const url = "mongodb+srv://highfive_nick:mydbdemo@cluster0.yct04.mongodb.net/?retryWrites=true&w=majority";
const dbName = "demo";

app.listen(4000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {todos: result})
  })
})

app.post('/messages', (req, res) => {
  console.log(req.body)
  console.log(req.body.todoItem)
  db.collection('messages').insertOne({item: req.body.todoItem, done:false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/done', (req, res) => {
  console.log(req.body.name)
  db.collection('messages')
  .findOneAndUpdate({item: req.body.name}, {
    $set: {
      done: true
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/clear', (req, res) => {
  console.log(req.body)
  db.collection('messages').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

app.delete('/clearCompleted', (req, res) => {
  // console.log(req.body)
  db.collection('messages').deleteMany({done: true}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

