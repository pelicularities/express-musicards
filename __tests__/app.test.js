const request = require("supertest");
const app = require("../src/app");

describe("App", () => {
  it("should respond correctly to GET /", async () => {
    await request(app).get("/").expect(200);
  });
});
