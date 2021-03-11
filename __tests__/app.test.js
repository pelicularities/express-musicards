const request = require("supertest");
const createJWTToken = require("../src/utils/jwt");
const app = require("../src/app");

describe("App", () => {
  it("should respond correctly to GET /", async () => {
    const token = createJWTToken("60486c69e4ecd500156ae5e1", "testUser");
    await request(app).get("/").set("Cookie", `token=${token}`).expect(200);
  });
});
