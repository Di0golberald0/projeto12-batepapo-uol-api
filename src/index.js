import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const server = express();
server.use(cors());
server.use(express.json());

const participants = [];
const messages = [];

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("meu_lindo_projeto");
});

server.get("/participants", (req, res) => {

});

server.post("/participants", (req, res) => {
    const { name } = req.body;

    if (!name) {
      res.status(400).send({ message: "Nome do usúario é obrigatórios!" });
      return;
    }
  
    const isNamedUsed = participants.find((participant) => participant.name === name);
  
    // Se tiver alguma coisa nessa variável, retorna o erro.
    if (isNamedUsed) {
      res.status(400).send({ message: "Participante já existente!" });
      return;
    }
  
    participants.push({ name });
  
    res.status(201).send({ message: "OK" });

});

server.get("/messages", (req, res) => {

});

server.post("/messages", (req, res) => {

});

server.post("/status", (req, res) => {

});

server.listen(5000, () => console.log("listening on port 5000"));