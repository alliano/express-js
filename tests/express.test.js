import supertest from "supertest";
import { application } from "../src/server";
import loggerMiddleware from "../src/middleware/logger-middleware";
import headerMiddleware from "../src/middleware/header-middleware";
import apiTokenMiddleware from "../src/middleware/api-token-middleware";
import currentRequestTimeMiddleware from "../src/middleware/request-time-middleware";
import sampleErrorMiddleware from "../src/middleware/sample-error-middleware";

describe("express test", () => {
  it("should can get enpoin /", async () => {
    const response = await supertest(application).get("/");
    expect(response.text).toBe("Server is on");
  });
  it("should support query parameter", async () => {
    application.get("/hello", (req, resp) => {
      resp.send(`Hello ${req.query.name}`);
    });
    const response = await supertest(application)
      .get("/hello")
      .query({ name: "Alliano" });
    expect(response.text).toBe("Hello Alliano");
  });
  it("should support request", async () => {
    application.get("/hello", (req, res) => {
      res.json({
        path: req.path,
        originalUrl: req.originalUrl,
        hostname: req.hostname,
        protocol: req.protocol,
      });
    });
    const response = await supertest(application)
      .get("/hello")
      .query({ name: "Alliano" });
    expect(response.body).toEqual({
      path: "/hello",
      originalUrl: "/hello?name=Alliano",
      hostname: "127.0.0.1",
      protocol: "http",
    });
  });
  it("shoudl can careate many query params", async () => {
    application.get("/hello", (req, res) => {
      res.json({
        firstName: req.query.firstName,
        lastName: req.query.lastName,
      });
    });
    const response = await supertest(application)
      .get("/hello")
      .query({ firstName: "Audia", lastName: "Naila" });
    expect(response.body).toEqual({
      firstName: "Audia",
      lastName: "Naila",
    });
  });
  it("should support headers", async () => {
    application.get("/headers", (req, res) => {
      const header1 = req.header("accept"); // cara 1
      const header2 = req.get("name"); // cara 2
      res.json({
        type: header1,
        name: header2,
      });
    });
    const response = await supertest(application)
      .get("/headers")
      .set({ accept: "application/json", name: "Audia" });
    expect(response.body).toEqual({
      type: "application/json",
      name: "Audia",
    });
  });
  it("shoud support set response status", async () => {
    application.get("/status", (req, res) => {
      if (!req.query.name) res.status(400).send("query name is required!");
      else res.status(200).send(`Hello my love ${req.query.name}`);
    });
    const response = await supertest(application)
      .get("/status")
      .query({ name: "Audia" });
    const response2 = await supertest(application).get("/status");
    expect(response.text).toBe("Hello my love Audia");
    expect(response2.status).toEqual(400);
    expect(response2.text).toBe("query name is required!");
  });
  it("shoud support response header", async () => {
    application.get("/response-headers", (req, res) => {
      res
        .set({
          Author: "Anata Alliano",
          "X-POWERED-BY": "Express",
          "content-type": "application/json",
        })
        .end();
    });
    const response = await supertest(application).get("/response-headers");
    expect(response.get("author")).toBe("Anata Alliano");
    expect(response.get("x-powered-by")).toBe("Express");
    expect(response.get("content-type")).toBe(
      "application/json; charset=utf-8"
    );
  });
  test("should support response ", async () => {
    application.get("/response", (req, res) => {
      res.set({
        "content-type": "text/html",
      });
      res.status(200);
      res.send("<h1>Hallo dek nayyy...</h1>");
    });
    const response = await supertest(application).get("/response");
    expect(response.status).toEqual(200);
    expect(response.text).toBe("<h1>Hallo dek nayyy...</h1>");
    expect(response.get("content-type")).toContain("text/html");
  });
  it("should can be redirect", async () => {
    application.get("/home", (req, res) => {
      // res.set({ location: "/to-another-page" }).status(301).end(); // cara 1
      res.redirect(301, "/to-another-page"); // cara 2
    });
    const response = await supertest(application).get("/home");
    expect(response.status).toEqual(301);
    expect(response.get("location")).toBe("/to-another-page");
  });
  it("should can support middleware", async () => {
    application.use(loggerMiddleware);
    application.use(headerMiddleware);

    application.get("/midleware", async (req, res) => {
      res.send("middleware test").end();
    });
    const response = await supertest(application).get("/middleware");
    expect(response.status).toEqual(201);
    expect(response.get("X-POWERED-BY")).toBe("express");
    expect(response.get("Author")).toBe("Alliano");
  });
  it("sample to use midleware", async () => {
    application.use(apiTokenMiddleware);
    application.get("/dashbord", (req, res) => {
      res.send("Sample request");
    });
    const errorrResponse = await supertest(application).get("/dashbord");
    expect(errorrResponse.body).toEqual({ message: "Token is required :(" });
    expect(errorrResponse.status).toEqual(401);

    const successResponse = await supertest(application)
      .get("/dashbord")
      .set({ "X-API-TOKEN": "Sample Token" });
    expect(successResponse.body).toEqual({
      message: "Successfully authenticate :)",
    });
    expect(successResponse.status).toEqual(200);

  });
  // Manipulasi request
  it("shoud can manipulate request", async () => {
    application.use(currentRequestTimeMiddleware);
    application.get("/manipulate-middlware", (req, res) => {
      res.set({
        "content-type": "plain/text",
      });
      res.send("Time Now : " + req.currentTime);
    });
    const response = await supertest(application).get("/manipulate-middlware");
    expect(response.text).toContain("Time Now :");
    console.log(response.text);
  });
  it("shoud can send file", async () => {
    application.get("/file", (req, res) => {
      res.status(200);
      res.sendFile(__dirname+"/data.txt");
    });
    const response = await supertest(application).get("/file");
    expect(response.text).toContain("sample data from file");
  });
  it('shoud support error middleware',async () => {
    application.get("/err-middleware", (req, res) => {
      throw new Error("Error test");
    });
    // khusus untuk error middleware harus diletakan di bawah routing
    application.use(sampleErrorMiddleware);
    const response = await supertest(application).get("/err-middleware");
    expect(response.status).toBe(500);
    console.log(response.text);
  });
});
