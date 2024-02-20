require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4mhll.mongodb.net/todolistDB`);

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

    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems)
        } else {
            res.render('list', { listTitle: today, newListItem: foundItems })
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

    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Item removed succesfully');
        }
    })

    res.redirect('/');
})

let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log('Server started successfully');
})