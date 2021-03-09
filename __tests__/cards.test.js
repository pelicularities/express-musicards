const request = require("supertest");
const app = require("../src/app");
const Deck = require("../src/models/deck.model");
const dbHandlers = require("../test/dbHandler");
const createJWTToken = require("../src/utils/jwt");

describe("/decks/:deckId/cards", () => {
  let token;
  let deckId;
  let cardId;
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
      cardId = body.cards[0];
    });
  });

  describe("PUT /decks/:deckId/cards/:cardId", () => {
    it("should successfully edit a card when given a front only", async () => {
      const editCard = {
        front: [{ type: "text", content: "Front of card (edited)" }],
      };
      const { body: updatedCard } = await request(app)
        .put(`/decks/${deckId}/cards/${cardId}`)
        .send(editCard)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(updatedCard.front).toEqual(editCard.front);
      expect(updatedCard).toHaveProperty("back");
    });
    it("should successfully edit a card when given a back only", async () => {
      const editCard = {
        back: [{ type: "text", content: "Back of card (edited)" }],
      };
      const { body: updatedCard } = await request(app)
        .put(`/decks/${deckId}/cards/${cardId}`)
        .send(editCard)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(updatedCard.back).toEqual(editCard.back);
      expect(updatedCard).toHaveProperty("front");
    });
    it("should successfully edit a card when given both a front and a back", async () => {
      const editCard = {
        front: [{ type: "text", content: "Front of card (edited)" }],
        back: [{ type: "text", content: "Back of card (edited)" }],
      };
      const { body: updatedCard } = await request(app)
        .put(`/decks/${deckId}/cards/${cardId}`)
        .send(editCard)
        .set("Cookie", `token=${token}`)
        .expect(200);
      expect(updatedCard).toMatchObject(editCard);
    });
    it("should return 422 if data is invalid", async () => {
      const editCard = {
        front: "",
        back: "",
      };
      await request(app)
        .put(`/decks/${deckId}/cards/${cardId}`)
        .set("Cookie", `token=${token}`)
        .send(editCard)
        .expect(422);
    });
    it("should return 400 if no JSON is given", async () => {
      await request(app)
        .put(`/decks/${deckId}/cards/${cardId}`)
        .send("")
        .set("Cookie", `token=${token}`)
        .expect(400);
    });
    it("should return 401 if user is unauthorized", async () => {
      const editCard = {
        front: [{ type: "text", content: "This user" }],
        back: [{ type: "text", content: "is unauthorized!" }],
      };
      await request(app)
        .put(`/decks/${deckId}/cards/${cardId}`)
        .send(editCard)
        .expect(401);
    });
    it("should return 404 for a card that doesn't exist", async () => {
      const editCard = {
        front: [{ type: "text", content: "This card" }],
        back: [{ type: "text", content: "doesn't exist!" }],
      };
      await request(app)
        .put(`/decks/${deckId}/cards/000000000001`)
        .send(editCard)
        .set("Cookie", `token=${token}`)
        .expect(404);
    });
  });
});
