const request = require("supertest");
const app = require("../src/app");
const Deck = require("../src/models/deck.model");
const dbHandlers = require("../test/dbHandler");

describe("/decks", () => {
  const testDecks = [
    { title: "Test Deck 1", description: "Description 1", cards: [] },
    { title: "Test Deck 2", description: "Description 2", cards: [] },
  ];
  beforeAll(async () => {
    await dbHandlers.connect();
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
        .expect(201);
      console.log(response.body);
      expect(response.body).toMatchObject(newDeck);
    });
    it("should successfully create a deck when given a title only", async () => {
      const newDeck = {
        title: "Test Deck",
      };
      const response = await request(app)
        .post("/decks")
        .send(newDeck)
        .expect(201);
      expect(response.body).toMatchObject(newDeck);
    });
    it("should return 422 if no title is given", async () => {
      const newDeck = {
        description: "Description",
      };
      const response = await request(app)
        .post("/decks")
        .send(newDeck)
        .expect(422);
    });
    it("should return 400 if no JSON is given", async () => {
      const response = await request(app).post("/decks").expect(400);
    });
  });
  describe("GET /decks, after POST requests", () => {
    let deckId;
    it("should respond to GET with an array of decks from the DB, including newly added decks", async () => {
      const { body } = await request(app).get("/decks").expect(200);
      expect(body.length).toEqual(4);
      deckId = body[0]._id;
      console.log(deckId);
    });
    it("should retrieve a single deck when given the deck ID", async () => {
      const { body } = await request(app).get(`/decks/${deckId}`).expect(200);
      expect(body).toMatchObject(testDecks[0]);
    });
    it("should return 404 for a deck that doesn't exist", async () => {
      await request(app).get(`/decks/000000000001`).expect(404);
    });
  });
});
