const request = require("supertest");
const app = require("../src/app");
const Deck = require("../src/models/deck.model");
const dbHandlers = require("../test/dbHandler");
const createJWTToken = require("../src/utils/jwt");

describe("/decks/:deckId/cards", () => {
  let token;
  let deckId;
  const testDeck = {
    title: "Test Deck 1",
    description: "Description 1",
    cards: [],
  };
  beforeAll(async () => {
    await dbHandlers.connect();
    token = createJWTToken("yoloauth");
    Deck.create(testDeck);
    const { body } = await request(app).get("/decks");
    deckId = body[0]._id;
  });
  afterAll(async () => {
    await dbHandlers.clearDatabase();
    await dbHandlers.closeDatabase();
  });
  describe("POST /decks", () => {
    it("should successfully create a card when given a front and back", async () => {
      const newCard = {
        front: [{ type: "text", content: "Front of card" }],
        back: [{ type: "text", content: "Back of card" }],
      };
      const response = await request(app)
        .post(`/decks/${deckId}`)
        .send(newCard)
        .set("Cookie", `token=${token}`)
        .expect(201);
      expect(response.body).toMatchObject(newCard);
    });
    it("should return 422 if no front is given", async () => {
      const newCard = {
        back: [{ type: "text", content: "Back of card" }],
      };
      const response = await request(app)
        .post(`/decks/${deckId}`)
        .set("Cookie", `token=${token}`)
        .send(newCard)
        .expect(422);
    });
    it("should return 422 if no back is given", async () => {
      const newCard = {
        front: [{ type: "text", content: "Front of card" }],
      };
      const response = await request(app)
        .post(`/decks/${deckId}`)
        .set("Cookie", `token=${token}`)
        .send(newCard)
        .expect(422);
    });
    it("should return 400 if no JSON is given", async () => {
      await request(app)
        .post(`/decks/${deckId}`)
        .send("")
        .set("Cookie", `token=${token}`)
        .expect(400);
    });
    it("should return 401 if user is unauthorized", async () => {
      const newCard = {
        front: [{ type: "text", content: "Front of card" }],
        back: [{ type: "text", content: "Back of card" }],
      };
      await request(app).post(`/decks/${deckId}`).send(newCard).expect(401);
    });
  });
  describe("GET /decks/:deckId, after cards are created", () => {
    it("should respond to GET with the new cards included in the deck", async () => {
      const { body } = await request(app).get(`/decks/${deckId}`).expect(200);
      console.log(body.cards);
      expect(body.cards.length).toEqual(1);
    });
  });
});
