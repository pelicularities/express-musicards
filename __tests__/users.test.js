const request = require("supertest");
const app = require("../src/app");
const dbHandlers = require("../test/dbHandler");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user.model");

describe("/users", () => {
  beforeAll(async () => {
    await dbHandlers.connect();
  });
  afterAll(async () => {
    await dbHandlers.clearDatabase();
    await dbHandlers.closeDatabase();
  });

  describe("POST /users", () => {
    it("should successfully create a user when given a username and password", async () => {
      const newUser = { username: "testUser", password: "testPassword" };
      const { body: createdUser } = await request(app)
        .post("/users")
        .send(newUser)
        .expect(201);
      expect(createdUser.name).toEqual(newUser.username);
      const readCreatedUserFromDB = await User.findById(createdUser.id);
      expect(
        await bcrypt.compare(newUser.password, readCreatedUserFromDB.password)
      ).toEqual(true);
    });
    it("should return 422 if no username is given", async () => {
      const newUser = {
        password: "testPassword",
      };
      await request(app).post("/users").send(newUser).expect(422);
    });
    it("should return 422 if no password is given", async () => {
      const newUser = {
        username: "testUser",
      };
      await request(app).post("/users").send(newUser).expect(422);
    });
    it("should return 422 if username is too short", async () => {
      const newUser = {
        username: "ab",
        password: "testPassword",
      };
      await request(app).post("/users").send(newUser).expect(422);
    });
    it("should return 422 if username contains numbers", async () => {
      const newUser = {
        username: "123",
        password: "testPassword",
      };
      await request(app).post("/users").send(newUser).expect(422);
    });
    it("should return 422 if username contains invalid characters", async () => {
      const newUser = {
        username: "username!",
        password: "testPassword",
      };
      await request(app).post("/users").send(newUser).expect(422);
    });
    it("should return 422 if password is too short", async () => {
      const newUser = {
        username: "testUser",
        password: "passwor",
      };
      await request(app).post("/users").send(newUser).expect(422);
    });
    it("should return 400 if no JSON is given", async () => {
      await request(app).post("/decks").expect(400);
    });
  });
});
