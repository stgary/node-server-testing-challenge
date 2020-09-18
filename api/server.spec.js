const supertest = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");

describe('server', () => {
  describe("environment", () => {
    it('should set the DB_ENV variable to "testing"', () => {
        expect(process.env.DB_ENV).toBe("testing");
    });
  });

  describe("GET /", () => {
    it("should return HTTP status code 200", () => {
        return supertest(server)
            .get("/")
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    it("should return JSON", async () => {
      const res = await supertest(server).get("/");

      expect(res.type).toMatch(/json/i);
  });

    it("should return an api property with the value up", async () => {
        const res = await supertest(server).get("/");

        expect(res.body.api).toBe("up");
    });

  });

  describe("POST /api/auth/register", () => {
    beforeEach(async () => {
        // truncate or empty the hobbits table
        await db("users").truncate();
    });

    it("should return 201 when passed correct data", () => {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "zeke", password: "pass", department: "janitorial" })
            .then(res => {
                expect(res.status).toBe(201);
            });
    });

    it("should fail with code 400 if passed incorrect data", () => {
        return supertest(server)
            .post("/api/auth/register")
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    it("should insert the user into the database", async () => {
        const res = await supertest(server).post("/api/auth/register").send({ 
          username: "steve", password: "pass", department: "sales" 
        });

        expect(res.body.data.username).toBe('steve');
    });

  });

  describe("POST /api/auth/login", () => {

    it("should return 200 when passed correct data", () => {
        return supertest(server)
            .post("/api/auth/login")
            .send({ username: "steve", password: "pass" })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    it("should fail with code 401 if passed incorrect data", () => {
        return supertest(server)
            .post("/api/auth/login")
            .send({ username: "steves", password: "passw" })
            .then(res => {
                expect(res.status).toBe(401);
            });
    });

  });

  describe("GET /api/users", () => {
    it("should return HTTP status code 401", () => {
        return supertest(server)
            .get("/api/users")
            .then(res => {
                expect(res.status).toBe(401);
            });
    });

    it("should return HTTP status code 404", () => {
      return supertest(server)
          .get("/api/user")
          .then(res => {
              expect(res.status).toBe(404);
          });
    });

  });

});