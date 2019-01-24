const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db',
                { autoIndex: false, useNewUrlParser: true })
        .then(() => {console.log('connection successful'),
                        (error) => {console.log('Error on connection' + error.toString())}});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    // we're connected!
    console.log('open event - connected');

    var kittySchema = new mongoose.Schema({
        name: String
    });

    var Kitten = mongoose.model('Kitten', kittySchema);

    var silence = new Kitten({name: 'Silence'});
    console.log(silence.name); // 'Silence'

    // NOTE: methods must be added to the schema before compiling it with mongoose.model()
    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    };

    var Kitten = mongoose.model('Kitten', kittySchema);

    var fluffy = new Kitten({name: 'fluffy'});
//    fluffy.speak(); // "Meow name is fluffy"

    fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
        console.log('fluffy shoiuld really speak here'); //fluffy.speak();

        Kitten.find(function (err, kittens) {
            if (err) return console.error(err);
            console.log(kittens);
        });

    });

    async function run() {
        // Create a new mongoose model
        const personSchema = new mongoose.Schema({
            name: String
        });
        const Person = mongoose.model('Person', personSchema, 'Person');

        // Insert a doc, will trigger the change stream handler above
        console.log(new Date(), 'Inserting doc');
        let tempPerson = await Person.create({ name: 'Axl Rose' });

        console.log('Person: ' + tempPerson);
    }

    run();

});



