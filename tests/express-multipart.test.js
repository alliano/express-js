import fileUpload from "express-fileupload";
import { application } from "../src/server";
import supertest from "supertest";
describe("test multipart from data", () => {
  it("shoud can upload file", async () => {
    application.use(fileUpload());
    application.post("/upload", async (req, res) => {
      const textFiel = await req.files.article;
      await textFiel.mv(__dirname + "/upload/" + textFiel.name);
      res.send(`Hallo ${req.body.name}, u upload file ${textFiel.name}`);
      res.status(200);
    });
    const response = await supertest(application)
      .post("/upload")
      .field("name", "Alliano")
      .attach("article", __dirname + "/data.txt");
    expect(response.text).toBe("Hallo Alliano, u upload file data.txt");
  });
  it('it should can create custom not found page', async () => {
    application.get("/home", (req, res) => {
        res.send("Welcome!");
    })
    application.use(notFoundpage);
    const response1 = await supertest(application).get("/home");
    const response2 = await supertest(application).get("/notfound-url");
    expect(response1.text).toBe("Welcome!");
    expect(response2.text).toBe("404 halamanya gaada mass");
  });

  function notFoundpage(req, res, next) {
    res.status(404).send("404 halamanya gaada mass");
  }
});
