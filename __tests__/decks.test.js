const request = require("supertest");
const app = require("../src/app");
const Deck = require("../src/models/deck.model");
const dbHandlers = require("../test/dbHandler");
const createJWTToken = require("../src/utils/jwt");

describe("/decks", () => {
  let token;
  let deckId;
  const testDecks = [
    { title: "Test Deck 1", description: "Description 1", cards: [] },
    { title: "Test Deck 2", description: "Description 2", cards: [] },
  ];
  beforeAll(async () => {
    await dbHandlers.connect();
    token = createJWTToken("60486c69e4ecd500156ae5e1", "testUser");
  });
  afterAll(async () => {
    await dbHandlers.clearDatabase();
    await dbHandlers.closeDatabase();
  });
  describe("GET /decks, initial state", () => {
    it("should respond to GET with an empty array when there are no decks", async () => {
      const { body } = await request(app).get("/decks").expect(200);
      expect(body).toEqual([]);
    });
    it("should respond to GET with an array of decks from the DB", async () => {
      Deck.create(testDecks);
      const { body } = await request(app).get("/decks").expect(200);
      expect(body.length).toEqual(2);
    });
  });
  describe("POST /decks", () => {
    it("should successfully create a deck when given a title and description", async () => {
      const newDeck = {
        title: "Test Deck 3",
        description: "Description 3",
      };
      const response = await request(app)
        .post("/decks")
        .send(newDeck)
        .set("Cookie", `token=${token}`)
        .expect(201);
      expect(response.body).toMatchObject(newDeck);
    });
    it("should successfully create a deck when given a title only", async () => {
      const newDeck = {
        title: "Test Deck",
      };
      const response = await request(app)
        .post("/decks")
        .send(newDeck)
        .set("Cookie", `token=${token}`)
        .expect(201);
      expect(response.body).toMatchObject(newDeck);
    });
    it("should return 422 if no title is given", async () => {
      const newDeck = {
        description: "Description",
      };
      await request(app)
        .post("/decks")
        .set("Cookie", `token=${token}`)
        .send(newDeck)
        .expect(422);
    });
    it("should return 400 if no JSON is given", async () => {
      await request(app)
        .post("/decks")
        .send("")
        .set("Cookie", `token=${token}`)
        .expect(400);
    });
    it("should return 401 if user is unauthorized", async () => {
      const newDeck = {
        title: "Test Deck 3",
        description: "Description 3",
      };
      await request(app).post("/decks").send(newDeck).expect(401);
    });
  });
  describe("GET /decks, after POST requests", () => {
    it("should respond to GET with an array of decks from the DB, including newly added decks", async () => {
      const { body } = await request(app).get("/decks").expect(200);
      expect(body.length).toEqual(4);
      deckId = body[0]._id;
    });
    it("should retrieve a single deck when given the deck ID", async () => {
      const { body } = await request(app).get(`/decks/${deckId}`).expect(200);
      expect(body).toMatchObject(testDecks[0]);
    });
    it("should return 404 for a deck that doesn't exist", async () => {
      await request(app).get("/decks/000000000001").expect(404);
    });
  });
  describe("PUT /decks/:deckId", () => {
    it("should successfully edit a deck when given a title only", async () => {
      const editDeck = {
        title: "Edited Deck 1",
      };
      const { body: updatedDeck } = await request(app)
        .put(`/decks/${deckId}`)
        .send(editDeck)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(updatedDeck.title).toEqual(editDeck.title);
      expect(updatedDeck).toHaveProperty("description", "Description 1");
    });
    it("should successfully edit a deck when given a description only", async () => {
      const editDeck = {
        description: "Edited Deck Description 1",
      };
      const { body: updatedDeck } = await request(app)
        .put(`/decks/${deckId}`)
        .send(editDeck)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(updatedDeck.description).toEqual(editDeck.description);
      expect(updatedDeck).toHaveProperty("title", "Edited Deck 1");
    });
    it("should successfully edit a deck when given both a title and description", async () => {
      const editDeck = {
        title: "Modified Deck 1",
        description: "Modified Deck Description 1",
      };
      const { body: updatedDeck } = await request(app)
        .put(`/decks/${deckId}`)
        .send(editDeck)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(updatedDeck).toMatchObject(editDeck);
    });
    it("should return 422 if title is an empty string", async () => {
      const editDeck = {
        title: "",
      };
      await request(app)
        .put(`/decks/${deckId}`)
        .set("Cookie", `token=${token}`)
        .send(editDeck)
        .expect(422);
    });
    it("should return 400 if no JSON is given", async () => {
      await request(app)
        .put(`/decks/${deckId}`)
        .send("")
        .set("Cookie", `token=${token}`)
        .expect(400);
    });
    it("should return 401 if user is unauthorized", async () => {
      const editDeck = {
        title: "Unauthorized Test Deck",
        description: "This deck is unauthorized!",
      };
      await request(app).put(`/decks/${deckId}`).send(editDeck).expect(401);
    });
    it("should return 404 for a deck that doesn't exist", async () => {
      const editDeck = {
        title: "Nonexistent Test Deck",
        description: "This deck doesn't exist!",
      };
      await request(app)
        .put("/decks/000000000001")
        .send(editDeck)
        .set("Cookie", `token=${token}`)
        .expect(404);
    });
  });
  describe("DELETE /decks/:deckId", () => {
    it("should return 401 if user is unauthorized", async () => {
      await request(app).delete(`/decks/${deckId}`).expect(401);
    });
    it("should successfully delete a deck when given a valid deck ID", async () => {
      const { body: allDecksBefore } = await request(app).get("/decks");
      const deckToDelete = {
        title: "Modified Deck 1",
        description: "Modified Deck Description 1",
      };
      const { body: deletedDeck } = await request(app)
        .delete(`/decks/${deckId}`)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(deletedDeck).toMatchObject(deckToDelete);
      const { body: allDecksAfter } = await request(app).get("/decks");
      expect(allDecksBefore.length - 1).toEqual(allDecksAfter.length);
    });
  });
});
