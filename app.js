require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const uri= `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.4mhll.mongodb.net:27017,cluster0-shard-00-01.4mhll.mongodb.net:27017,cluster0-shard-00-02.4mhll.mongodb.net:27017/todolistDB?ssl=true&replicaSet=atlas-41kt6v-shard-0&authSource=admin&appName=Cluster0`
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: 'Welcome to your todoList!'
})

const item2 = new Item({
    name: 'Hit the + button to add a new item.'
})

const item3 = new Item({
    name: '<--- Hit this to delete an item.'
})

const defaultItems = [item1, item2, item3];

var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
};

app.get('/', function (req, res) {

    var today = new Date().toLocaleDateString('en-US', options);

    Item.find().then((foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems);
        } else {
            res.render('list', {listTitle: today, newListItem: foundItems})
        }
    })
})

app.post('/', function (req, res) {

    let chore = req.body.chore;

    const item = new Item({
        name: chore
    })

    Item.create(item);

    res.redirect('/');
})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;

    try {
        Item.findByIdAndDelete(checkedItemId).then(() => console.log('Item removed succesfully'));
    } catch (err) {
        console.log(err)
    }
    
    res.redirect('/');
})

async function main() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB!");
        
    } catch (err) {
        console.log(err);
    }
}

let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

main().catch(err => console.log(err));

app.listen(port, function () {
    console.log('Server started successfully');
})