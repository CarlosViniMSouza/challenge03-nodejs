const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
const repositories = [];

app.use(express.json());

// Status -> done
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// Status -> done
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

// Status -> In Progress
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// Status -> In Progress
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex > 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

// Tests suit 'Likes' -> done
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repository = repositories[repositoryIndex];

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not Found" });
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
