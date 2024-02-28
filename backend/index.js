const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// app.use(morgan("tiny"));
// app.use(morgan("dev"));

app.use(express.json());

app.use(cors());
app.use(express.static("dist"));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body :date[web] :remote-addr"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people 
    <br/>
    ${new Date()}</p>
  `);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.use(express.json());

const generateId = () => {
  const maxID = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxID + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  if (persons.find((person) => person.number === body.number)) {
    return response.status(400).json({
      error: "number must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
