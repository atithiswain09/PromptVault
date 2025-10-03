const request = require("supertest");
const {
  connectDBForTesting,
  disconnectDBForTesting,
  clearCollections,
} = require("../jest.setup");

const app = require("../src/app");
const UserModel = require("../src/models/User.modul");

let mongoServer;

beforeAll(async () => await connectDBForTesting());

afterAll(async () => await disconnectDBForTesting());

beforeEach(async () => await clearCollections());

describe("User Registration", () => {
  it("Registration Successful", async () => {
    const userData = {
      username: "testName",
      email: "test@mail.com",
      password: "testPassword",
    };

    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(userData)
      .expect(201);

    expect(res.body.message).toBe("Signup successful");
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.username).toEqual(userData.username);
    expect(res.body.user.email).toEqual(userData.email);

    const foundUser = await UserModel.findOne({ email: userData.email });
    expect(foundUser).toBeDefined();
  });
});
