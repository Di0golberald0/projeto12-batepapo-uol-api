import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import { MongoClient } from "mongodb";
import joi from 'joi';
import dotenv from "dotenv";

dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());

const participantSchema = joi.object({
    name: joi.string().required()
});

const messageSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.string().required()
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("projeto12-batepapo-uol-api");
});

server.post("/participants", (req, res) => {
    const { name } = req.body;

    const validation = participantSchema.validate(name);

    if (!validation) {
      res.status(422).send({ message: "Nome do usúario é obrigatório!" });
      return;
    }
  
    const isNamedUsed = db.collection("participants").find((participant) => db.collection("participants").name === name);
  
    if (isNamedUsed) {
      res.status(409).send({ message: "Esse nome já está sendo utilizado!" });
      return;
    }
  
    db.collection("participants").insertOne({
        name: `${name}`,
        lastStatus: Date.now()
    });

    db.collection("messages").insertOne({
        from: `${name}`, 
        to: 'Todos', 
        text: 'entra na sala...', 
        type: 'status', 
        time: `${dayjs().format('HH:MM:SS') }`
    });
  
    res.status(201);
});

server.get("/participants", (req, res) => {
    res.send(db.collection("participants"));
});

server.post("/messages/:user", (req, res) => {
    const user = req.params.user;
    const whichUser = db.collection("participants").find((participant) => participant.name === user);

    const { to, text, type } = req.body;
    const newMessage = { "to": to, "text": text, "type": type };

    const validation = messageSchema.validate(newMessage);

    if (!validation || !whichUser) {
      res.status(422).send({ message: "Erro na validação dos dados!" });
      return;
    }

    res.status(201);
});
  
server.get("/messages", (req, res) => {

});

server.post("/status", (req, res) => {

});

server.listen(5000, () => console.log("listening on port 5000"));