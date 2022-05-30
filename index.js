const express = require('express');
const app = express();
const mongoose = require("mongoose");
const ejs = require('ejs');
const { MongoClient, ServerApiVersion } = require('mongodb');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '\\public'));
app.set('views', __dirname + '\\views');

const uri = "mongodb+srv://samratpodder:ycTbpiZk2ZbCMHsM@samrat-cluster.vtfclzm.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// async function run() {
//     try {
//       await client.connect();
//       await client.db(dbN).command({ ping: 1 });
//       console.log("Connected successfully to server");
//     } catch {
//       await client.close();
//       console.log("Connection closed");
//     }
// }
async function run(){
    await mongoose.connect(
        uri,
        {
          useNewUrlParser: true,
        //   useFindAndModify: false,
          useUnifiedTopology: true
        }
      );
    const db = await mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Connected successfully to server");
    });
}
run().then(() => {
    console.log("Connected successfully to server");
}).catch((err) => {
    console.log(err.stack);
});
const AttendeeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: false
    },
    roll:{
        type: Number,
        required: true,
        min: [14000000000, 'Roll number should be 10 digits'],
        max: [15000000000, 'Roll number should be 10 digits']
    },
    year:{
        type: Number,
        required: true,
        min: [1, 'Invalid Year'],
        max: [4, 'Invalid Year']
    },
    attending:{
        type: Boolean,
        required: false
    },
    payment:{
        amount:{
            type: Number,
            required: false
        },
        method:{
            type: String,
            required: false
        },
        status:{
            type: Boolean,
            required: false
        }
    }
});
const Attendee = mongoose.model('Attendee', AttendeeSchema);



app.get('/allattendee',(req,res)=>{
    Attendee.find({},(err,data)=>{
        
        if(err)
            res.render('errorDB');
        else
            res.render('allattendee',{title:"All Attendee",data});
    });
});
app.get('/enlist',(req,res)=>{
    res.render('enlist',{title:"Self Enlist Form"});
});

app.get('/getMyProfile/:id',(req,res)=>{
    const id = req.params.id;
    Attendee.findById(id,(err,data)=>{
        if(err)
            res.render('errorDB');
        else
            console.log(data);
            res.render('myprofile',{title:"My Profile",data});
    });
});

app.get('/selfupdatepayment/:id',(req,res)=>{
    const id = req.params.id;
    Attendee.findById(id,(err,data)=>{
        if(err)
            res.render('errorDB');
        else
            res.render('selfupdatepayment',{title:"Update Payment",data});
    });
});

app.post('/addnewperson',(req,res)=>{
    const {fullName,email,roll,year} = req.body;
    console.log(req.body);

    const newAttendee = new Attendee({
        name: fullName,
        email: email,
        roll: roll,
        year: year
    });
    newAttendee.save().then(()=>{
        res.redirect('/allattendee');
    }).catch((err)=>{
        console.log(err);
    });
});


app.post('/updatepayment/:id',(req,res)=>{
    const id = req.params.id;
    const {attending,amount,method} = req.body;
    console.log(id,req.body);
    Attendee.findById(id,(err,data)=>{
        if(err)
            res.render('errorDB');
        else{
            data.attending  = attending;
            data.payment.amount = amount;
            data.payment.method = method;
            data.save().then(()=>{
                res.redirect('/allattendee');
            }).catch((err)=>{
                console.log(err);
            });
        }
    });
});

app.get('/', (req, res) => {
    res.render('home',{title:"Farewell Portal"});
});


app.listen(3000, () => console.log('Portal app listening on port 3000!'));