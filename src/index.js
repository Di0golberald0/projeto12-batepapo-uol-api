import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from 'joi';
import dotenv from "dotenv";

dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());

const participants = [];
const messages = [];

const particioantSchema = joi.object({
    name: joi.string().required()
  });

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("meu_lindo_projeto");
});

server.post("/participants", (req, res) => {
    const { name } = req.body;

    const validation = particioantSchema.validate(name);

    if (!validation) {
      res.status(422).send({ message: "Nome do usúario é obrigatório!" });
      return;
    }
  
    const isNamedUsed = participants.find((participant) => participant.name === name);
  
    if (isNamedUsed) {
      res.status(409).send({ message: "Participante já existente!" });
      return;
    }
  
    participants.push({ name });
  
    res.status(201);
});

server.get("/participants", (req, res) => {
    res.send(participants);
  });
  
server.get("/messages", (req, res) => {

});

server.post("/messages", (req, res) => {

});

server.post("/status", (req, res) => {

});

server.listen(5000, () => console.log("listening on port 5000"));