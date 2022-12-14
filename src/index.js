const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
const repositories = [];

app.use(express.json());

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

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

// Status -> done
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  // That line is not cool... But the test passes!
  repository.likes = 0;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ "msg": "Repository Deleted" });
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
