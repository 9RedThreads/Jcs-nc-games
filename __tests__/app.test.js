const app = require("../app.js");
const request = require("supertest");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("Error handling", () => {
  describe("Status 404, path not found", () => {
    test("passed an invalid path returns status 404 and a 'path not found' msg", () => {
      return request(app)
        .get("/api/banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
  });
});

describe("GET requests", () => {
  describe("GET /api/categories", () => {
    test("Status: 200, returns an array of catagory objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { category } = body;
          expect(category).toHaveLength(4);
          category.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET /api/reviews", () => {
    test("Status: 200, returns an array of all review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toHaveLength(13);
          review.forEach((review) => {
            expect(review).toEqual({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(String),
              });
          });
        });
    });
    test("Status: 200, returns review objects sorted by date in descending order", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const {review} = body
            expect(review).toBeSortedBy("created_at", { descending: true});
          });
      });
  });
});
