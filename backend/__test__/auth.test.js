const request = require("supertest");
const {
  connectDBForTesting,
  disconnectDBForTesting,
  clearCollections,
} = require("../jest.setup");

const app = require("../src/app");
const UserModel = require("../src/models/user.model");
const { hashPassword } = require("../src/services/password.service");

let mongoServer;

beforeAll(async () => await connectDBForTesting());

afterAll(async () => await disconnectDBForTesting());

beforeEach(async () => await clearCollections());

describe("User Registration", () => {
  const registerRoute = "/api/v1/auth/signup";
  const testName = "testName";
  const testEmail = "test@mail.com";
  const testPassword = "testPassword123@";

  it("Registration Successful", async () => {
    const userData = {
      username: testName,
      email: testEmail,
      password: testPassword,
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(201);

    expect(res.body.message).toBe("Signup successful");
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.username).toEqual(testName);
    expect(res.body.user.email).toEqual(testEmail);

    const foundUser = await UserModel.findOne({ email: userData.email });
    expect(foundUser).toBeDefined();
  });

  it("Registration with wrong email format", async () => {
    const userData = {
      username: testName,
      email: "test#mail,com",
      password: testPassword,
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("email");
    expect(res.body.errors[0].msg).toBe("Invalid email format");
  });

  it("Registration with short username", async () => {
    const userData = {
      username: "T",
      email: testEmail,
      password: testPassword,
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("username");
    expect(res.body.errors[0].msg).toBe(
      "Username must be at least 3 characters long"
    );
  });

  it("Registration with weak password", async () => {
    const userData = {
      username: testName,
      email: testEmail,
      password: "weak password",
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("password");
    expect(res.body.errors[0].msg).toBe(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  });

  it("Registration with short password", async () => {
    const userData = {
      username: testName,
      email: testEmail,
      password: "short",
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("password");
    expect(res.body.errors[0].msg).toBe(
      "Password must be at least 8 characters long"
    );
  });

  it("Registration without given a email", async () => {
    const userData = {
      username: testName,
      password: testPassword,
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("email");
    expect(res.body.errors[0].msg).toBe("Email is required");
  });

  it("Registration without given a username", async () => {
    const userData = {
      email: testEmail,
      password: testPassword,
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("username");
    expect(res.body.errors[0].msg).toBe("Username is required");
  });

  it("Registration without given a password", async () => {
    const userData = {
      username: testName,
      email: testEmail,
    };

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("password");
    expect(res.body.errors[0].msg).toBe("Password is required");
  });

  it("Registration without given any body", async () => {
    const userData = {};

    const res = await request(app)
      .post(registerRoute)
      .send(userData)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toHaveLength(3);

    const errorFields = res.body.errors.map((err) => err.path);
    expect(errorFields).toEqual(
      expect.arrayContaining(["username", "email", "password"])
    );
  });

  it("Registration fails if user already exists", async () => {
    const userData = {
      username: testName,
      email: testEmail,
      password: testPassword,
    };

    await UserModel.create({
      ...userData,
      password: await hashPassword(userData.password),
    });

    // First signup should succeed
    await request(app).post("/api/v1/auth/signup").send(userData).expect(409);

    // Second signup with same email should fail
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(userData)
      .expect(409); // or 409 depending on how you handle conflict

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toMatch(/already exists/i);
    expect(res.body.errors[0].path).toBe("email");
  });
});
