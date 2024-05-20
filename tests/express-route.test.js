import supertest from "supertest";
import { application } from "../src/server";
import { authenticationRouterMiddleware } from "../src/routes/authentication-router";
import express from "express";
describe("should support route", () => {
  /**
   *  Express js menggunakan lib path to regex untuk melakukan routing secara dinamis
   */
  it("should support path regex", async () => {
    // semua routh path dari /products yang berakhiran .json
    application.get("/products/**/**.json", (req, res) => {
      res.send(req.originalUrl);
    });
    // semua pada path /category yang berakhiran (angka numerik).jpg
    application.get("/categories/*(\\d+).jpg", (req, res) => {
      res.send(req.originalUrl);
    });
    const response1 = await supertest(application).get(
      "/products/20/data-product.json"
    );
    const response2 = await supertest(application).get(
      "/products/20/sample-data-product.json"
    );
    const response3 = await supertest(application).get(
      "/categories/2012342.jpg"
    );
    const response4 = await supertest(application).get(
      "/categories/8432723.jpg"
    );
    const responseError = await supertest(application).get(
      "/categories/data-salah.jpg"
    );
    expect(response1.text).toBe("/products/20/data-product.json");
    expect(response2.text).toBe("/products/20/sample-data-product.json");
    expect(response3.text).toBe("/categories/2012342.jpg");
    expect(response4.text).toBe("/categories/8432723.jpg");
    expect(responseError.status).toBe(404);
  });
  it("should support request paraeter url", async () => {
    application.get("/products/:id(\\d+)", (req, res) => {
      res.send(`product with id ${req.params.id}`).end();
    });
    application.get("/users/:name", (req, res) => {
      res.send(`My Love ${req.params.name}`);
    });
    const response = await supertest(application).get("/products/10");
    const response1 = await supertest(application).get("/users/Audia");
    expect(response.text).toBe("product with id 10");
    expect(response1.text).toBe(`My Love Audia`);
  });
  it("should support multi route with different http method", async () => {
    application
      .route("/users")
      .get((req, res) => {
        res.send("Get users");
      })
      .post((req, res) => {
        res.send("Create users");
      })
      .put((req, res) => {
        res.send("Update users");
      })
      .delete((req, res) => {
        res.send("Delete users");
      });
    const getresponse = await supertest(application).get("/users");
    const postResponse = await supertest(application).post("/users");
    const putresponse = await supertest(application).put("/users");
    const deleteResponse = await supertest(application).delete("/users");
    expect(getresponse.text).toBe("Get users");
    expect(postResponse.text).toBe("Create users");
    expect(putresponse.text).toBe("Update users");
    expect(deleteResponse.text).toBe("Delete users");
  });
  it("shoud support router", async () => {
    application.use(authenticationRouterMiddleware);
    const response = await supertest(application)
      .get("/home")
      .set({ "X-API-TOKEN": "BARER-88927dg7g23d23tfd326d3f" });
    const responseBad = await supertest(application).get("/home");
    const responseInvalid = await supertest(application)
      .get("/home")
      .set({ "X-API-TOKEN": "invalid_token" });

    expect(responseInvalid.body).toEqual({ message: "token is not valid !" });
    expect(responseInvalid.status).toEqual(400);

    expect(responseBad.body).toEqual({ message: "token is required !" });
    expect(responseBad.status).toEqual(400);

    expect(response.body).toEqual({ message: "successfully authentiate :)" });
    expect(response.status).toEqual(200);
  });

  it("express midleware build in", async () => {
    // menggunkaan middleware build in
    application.use(express.json());
    application.post("/users", (req, res) => {
      res.json({
        data: { ...req.body },
      });
      res.status(200);
    });
    const response = await supertest(application).post("/users").send({
      firstName: "Audia",
      lastName: "Naila Safa",
      email: "audiaalli@gmail.com",
      password: "asdasdads",
    });
    expect(response.body.data).toEqual({
      firstName: "Audia",
      lastName: "Naila Safa",
      email: "audiaalli@gmail.com",
      password: "asdasdads",
    });
    expect(response.status).toBe(200);
  });
  it("test buil in middleware", async () => {
    // buildin middleware untuk mengkonversi req body form menjadi javascript object
    application.use(express.urlencoded({ extended: false }));
    application.post("/users", (req, res) => {
      res.json({ ...req.body });
      res.status(200).end();
    });
    const response = await supertest(application)
      .post("/users")
      .send("name=Alliano&lastName=Alli");
    expect(response.body).toEqual({ name: "Alliano", lastName: "Alli" });
  });
});
