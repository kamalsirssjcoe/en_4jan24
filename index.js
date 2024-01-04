const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/save", (req, res) => {
	let data = [req.body.n, req.body.p, req.body.q]
	let name = req.body.n;
	let txt = "name = " + name + " phone = " + req.body.p + " query = " + req.body.q;
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth : {
			user: "collegeworkadi@gmail.com",
			pass: "evbvneajwohlwygg"
		}
	})

	let mailOptions = {
		from : "collegeworkadi@gmail.com",
		to : "classeskamalsir@gmail.com",
		subject: "Enquiry from " + name,
		text : txt
	}

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log("mail err ", err);
			res.status(500).json(err);
		}
		else {
			console.log("mail send" , info.response);
			const url = "mongodb+srv://classeskamalsir:FBpmeRNsj5mVVxUP@cluster0.dq3bqbu.mongodb.net/?retryWrites=true&w=majority";
			const client = new MongoClient(url);
			const db = client.db("en_4jan24");
			const coll = db.collection("student");
			const doc = {"name": req.body.n, "phone": req.body.p, "query": req.body.q};	
			coll.insertOne(doc)
			.then(result => res.send(result))
			.catch(error => res.send(error));
			// res.status(200).json("mail send");
		}
	})
	
});

app.listen(9000, () => { console.log("ready @ 9000"); });






