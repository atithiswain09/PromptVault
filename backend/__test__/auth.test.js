const request = require("supertest");
const {
  connectDBForTesting,
  disconnectDBForTesting,
  clearCollections,
} = require("../jest.setup");

const app = require("../src/app");
const UserModel = require("../src/models/user.model");
const { hashPassword } = require("../src/services/password.service");
const jwt = require("jsonwebtoken");

let mongoServer;

beforeAll(async () => await connectDBForTesting());

afterAll(async () => await disconnectDBForTesting());

beforeEach(async () => await clearCollections());

describe("User Registration", () => {
  const registerRoute = "/api/auth/signup";
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
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.username).toEqual(testName);
    expect(res.body.user.email).toEqual(testEmail);
    expect(res.headers["set-cookie"]).toBeDefined();

    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toContain("token=");
    expect(cookie).toContain("HttpOnly");

    // Decode JWT and verify payload matches the logged-in user
    const token = cookie.split("token=")[1].split(";")[0];
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty("id");

    const user = await UserModel.findOne({ email: testEmail });
    expect(user._id.toString()).toBe(decoded.id);
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
    await request(app).post("/api/auth/signup").send(userData).expect(409);

    // Second signup with same email should fail
    const res = await request(app)
      .post("/api/auth/signup")
      .send(userData)
      .expect(409); // or 409 depending on how you handle conflict

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toMatch(/already exists/i);
    expect(res.body.errors[0].path).toBe("email");
  });
});

describe("User Login", () => {
  const loginRoute = "/api/auth/login";
  const signupRoute = "/api/auth/signup";
  const testName = "testUser";
  const testEmail = "testuser@mail.com";
  const testPassword = "StrongPass123!";

  // Helper: register a user before login tests
  const registerUser = async () => {
    await request(app)
      .post(signupRoute)
      .send({
        username: testName,
        email: testEmail,
        password: testPassword,
      })
      .expect(201);
  };

  it("Login successful with valid credentials", async () => {
    await registerUser();

    const res = await request(app)
      .post(loginRoute)
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    expect(res.body.message).toBe("Login successful");
    expect(res.headers["set-cookie"]).toBeDefined();

    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toContain("token=");
    expect(cookie).toContain("HttpOnly");

    // Decode JWT and verify payload matches the logged-in user
    const token = cookie.split("token=")[1].split(";")[0];
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty("id");

    const user = await UserModel.findOne({ email: testEmail });
    expect(user._id.toString()).toBe(decoded.id);
  });

  it("Fails when email does not exist", async () => {
    const res = await request(app)
      .post(loginRoute)
      .send({ email: "notfound@mail.com", password: "SomePassword123!" })
      .expect(401);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toMatch(/invalid email or password/i);
  });

  it("Fails when password is incorrect", async () => {
    await registerUser();

    const res = await request(app)
      .post(loginRoute)
      .send({ email: testEmail, password: "WrongPassword1!" })
      .expect(401);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toMatch(/invalid email or password/i);
  });

  it("Fails when email is missing", async () => {
    const res = await request(app)
      .post(loginRoute)
      .send({ password: testPassword })
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].path).toBe("email");
    expect(res.body.errors[0].msg).toBe("Email is required");
  });

  it("Fails when password is missing", async () => {
    const res = await request(app)
      .post(loginRoute)
      .send({ email: testEmail })
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].path).toBe("password");
    expect(res.body.errors[0].msg).toBe("Password is required");
  });

  it("Fails when email format is invalid", async () => {
    const res = await request(app)
      .post(loginRoute)
      .send({ email: "invalid_email", password: testPassword })
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].path).toBe("email");
    expect(res.body.errors[0].msg).toBe("Invalid email format");
  });

  it("Fails with empty request body", async () => {
    const res = await request(app)
      .post(loginRoute)
      .send({})
      .expect(400);

    const paths = res.body.errors.map((e) => e.path);
    expect(paths).toEqual(expect.arrayContaining(["email", "password"]));
  });

  it("Ignores unexpected extra fields safely", async () => {
    await registerUser();

    const res = await request(app)
      .post(loginRoute)
      .send({
        email: testEmail,
        password: testPassword,
        extraField: "ignored_value",
      })
      .expect(200);

    expect(res.body.message).toBe("Login successful");
  });

  it("Allows case-insensitive email login", async () => {
    await registerUser();

    const res = await request(app)
      .post(loginRoute)
      .send({
        email: testEmail.toUpperCase(),
        password: testPassword,
      })
      .expect(200);

    expect(res.body.message).toBe("Login successful");
  });

  it("Handles database connection errors gracefully (mocked)", async () => {
    jest
      .spyOn(UserModel, "findOne")
      .mockRejectedValueOnce(new Error("DB connection error"));

    const res = await request(app)
      .post(loginRoute)
      .send({ email: testEmail, password: testPassword })
      .expect(500);

    expect(res.body.message).toMatch(/server error/i);

    jest.restoreAllMocks();
  });
});

describe("User Logout", () => {
  const signupRoute = "/api/auth/signup";
  const loginRoute = "/api/auth/login";
  const logoutRoute = "/api/auth/logout";
  const testUser = {
    username: "logoutUser",
    email: "logout@mail.com",
    password: "LogoutPass123!",
  };

  const getAuthCookie = async () => {
    await request(app).post(signupRoute).send(testUser).expect(201);

    const loginRes = await request(app)
      .post(loginRoute)
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    return loginRes.headers["set-cookie"];
  };

  it("Logout successful when logged in", async () => {
    const cookie = await getAuthCookie();

    const res = await request(app)
      .get(logoutRoute)
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.message).toBe("Logout successful");
  });

  it("Clears auth cookie on logout", async () => {
    const cookie = await getAuthCookie();

    const res = await request(app)
      .get(logoutRoute)
      .set("Cookie", cookie)
      .expect(200);

    const clearedCookie = res.headers["set-cookie"][0];
    expect(clearedCookie).toContain("token=");
    expect(clearedCookie).toContain("Max-Age=0");
  });

  it("Fails logout without authentication token", async () => {
    const res = await request(app).get(logoutRoute).expect(401);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toMatch(/unauthorized/i);
  });

  it("Handles logout request with malformed cookie", async () => {
    const res = await request(app)
      .get(logoutRoute)
      .set("Cookie", "token=invalid.token.value")
      .expect(401);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toMatch(/unauthorized/i);
  });

  it("Does not crash when logout called without cookie header", async () => {
    const res = await request(app).get(logoutRoute).expect(401);
    expect(res.body.errors[0].msg).toMatch(/unauthorized/i);
  });
});
