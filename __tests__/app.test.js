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
          const { review } = body;
          expect(review).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("GET /api/reviews/:review_id", () => {
    test("Status: 200, given an id returns a matching review object", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          });
        });
    });
    describe("Error handlers", () => {
      test("Status: 404, given a valid but nonexistent id returns a 'nonexistent id' msg", () => {
        return request(app)
          .get("/api/reviews/33")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toEqual("nonexistent id");
          });
      });
      test("Status: 400, given a invalid id returns a 'invalid id' msg", () => {
        return request(app)
          .get("/api/reviews/banana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual("invalid request");
          });
      });
    });
  });

  describe("GET /api/reviews/:review_id/comments", () => {
    test("Status: 200, given a review id returns an array of all comment objects with that review id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toHaveLength(3);
          expect(comments).toEqual([
            {
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            },
            {
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            },
            {
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            },
          ]);
        });
    });
    test("Status: 200, returns comment objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    describe("Error handlers", () => {
      test("Status: 404, given a valid but nonexistent id returns a 'nonexistent id' msg", () => {
        return request(app)
          .get("/api/reviews/33/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toEqual("nonexistent id");
          });
      });
      test("Status: 400, given a invalid id returns a 'invalid id' msg", () => {
        return request(app)
          .get("/api/reviews/banana/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual("invalid request");
          });
      });
    });
  });
});
