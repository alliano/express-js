import { application } from "../src/server";
import supertest from "supertest";
import cookieParser from "cookie-parser";
import express from "express";
describe("unit test for cookie-parser", () => {
  it("shoud can use cookie", async () => {
    // menggunakan cookie parser untuk menggunakan cookie
    application.use(cookieParser());
    application.get("/profile", (req, res) => {
      console.log(req.cookies["firstName"]);
      res.json({ ...req.cookies });
      res.status(200);
    });
    const response = await supertest(application).get("/profile").set({
      Cookie: "firstName=Audia;lastName=Naila Safa;email=audiaali@gmail.com",
    });
    expect(response.body).toEqual({
      firstName: "Audia",
      lastName: "Naila Safa",
      email: "audiaali@gmail.com",
    });
  });
  it("shoud can write cookie with cookie parser", async () => {
    application.use(express.json());
    application.use(cookieParser());
    application.get("/auth", (req, res) => {
      res.cookie("Login", req.body.name, { path: "/auth" });
      res.status(200);
      res.send(`Hello dear ${req.body.name}`);
    });
    const response = await supertest(application)
      .get("/auth")
      .send({ name: "Alliano" });
    expect(response.text).toBe("Hello dear Alliano");
    expect(response.get("set-cookie").toString()).toContain("Alliano");
    expect(response.status).toEqual(200);
  });
  /**
   * signature key kita gunakan agar value cookie yang diberikan kepada client
   * tidak diubah2,ketika cookie diubah makah secara otomatis signature nya akan berbeda
   * dan tidak valid lagi
   *
   * untuk menggunnakan fitur tersebut kita perlu menyebutkan secretkey pada cookieParser(SECREETKEY);
   */
  it("shoud support signed key to avoid edit directly cookie in response", async () => {
    const SECREET_KEY = "093i02vn2832r4f42";
    application.use(express.json());
    application.use(cookieParser(SECREET_KEY));
    application.get("/auth", (req, res) => {
      res.cookie(
        "Login",
        { name: req.body.name, email: req.body.email },
        { path: "/auth", signed: true }
      );
      res.status(200);
      res.send(`Welcome ${req.body.name}`);
    });
    const response = await supertest(application)
      .get("/auth")
      .send({ name: "Audia", email: "audiaalli@gmail.com" });
    expect(response.status).toEqual(200);
    expect(response.text).toBe("Welcome Audia");
    expect(response.get("Set-Cookie").toString()).toBeDefined();
    console.log(response.get("Set-Cookie")[0]);
  });
  it("should can read signed cookie", async () => {
    const COOKIE =
      "Login=s%3Aj%3A%7B%22name%22%3A%22Audia%22%2C%22email%22%3A%22audiaalli%40gmail.com%22%7D.RkrdEZfOMqHk%2BY02koZhujarD8Od9UapRAA2%2Bh87QMc";
    const SECREET_KEY = "093i02vn2832r4f42";
    application.use(express.json());
    application.use(cookieParser(SECREET_KEY));
    application.get("/auth", (req, res) => {
      // ini mengambil cookie yang di signed sekaligus mendecript menjadi data yang bisa dibaca
      const data = req.signedCookies["Login"];
      res.json({ ...data });
      res.status(200).end();
    });
    const response = await supertest(application)
      .get("/auth")
      .set("Cookie", COOKIE);
    expect(response.body).toEqual({
      name: "Audia",
      email: "audiaalli@gmail.com",
    });
    expect(response.status).toBe(200);
  });

//   it("should support static middleware", async () => {
//     application.use(express.static(__dirname+"../src/static"));
//     application.get("/profile", (req, res) => {
//       res.send("STATIC FILE");
//     });
//     const response = await supertest(application).get("/profile");
//     expect(response.text).toBe("STATIC FILE");
//     const response1 = await supertest(application).get("/profile/data.txt");
//     console.log(response1.text);
//   });
});
