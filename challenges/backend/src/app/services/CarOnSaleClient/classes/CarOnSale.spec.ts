import { expect } from "chai";
import "mocha";
import nock from "nock";
import "axios-mock-adapter";
import { CarOnSaleClient } from "./CarOnSaleClient";
describe("CarOnSaleClient", () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe("getRunningAuctions", () => {
    /*afterEach(() => {
      nock.cleanAll();
    });*/
    it("should return the running autcions", async () => {
      nock("https://api-core-dev.caronsale.de/api", {
        reqheaders: {
          authtoken: "token-test",
          userId: "salesman@random.com",
        },
      })
        .get("/v2/auction/buyer/")
        .reply(200, {
          items: [
            { numBids: 9, currentHighestBidValue: 22, minimumRequiredAsk: 10 },
            { numBids: 6, currentHighestBidValue: 12, minimumRequiredAsk: 7 },
          ],
          total: 23,
        });
      const carOnSaleClient = new CarOnSaleClient();
      const runningAuctions = await carOnSaleClient.getRunningAuctions(
        "token-test",
        "salesman@random.com"
      );
      expect(runningAuctions).to.have.keys(["items", "total"]);
      expect(runningAuctions.total).to.eql(23);
    });
    it("should throw an error with status code 401", async () => {
      nock("https://api-core-dev.caronsale.de/api", {
        reqheaders: {
          authtoken: "token-test",
          userId: "salesman@random.com",
        },
      })
        .get("/v2/auction/buyer/")
        .reply(401);
      const carOnSaleClient = new CarOnSaleClient();
      try {
        await carOnSaleClient.getRunningAuctions(
          "token-test",
          "salesman@random.com"
        );
      } catch (error) {
        expect(error.response.status).to.be.equal(401);
      }
    });
  });
  describe("authService", () => {
    it("should return the user information", async () => {
      const userMailId = "salesman@random.com";
      const password = "123test";
      nock("https://api-core-dev.caronsale.de/api")
        .put(`/v1/authentication/${userMailId}`, { password })
        .reply(200, {
          token: "token-test",
          authenticated: true,
          userId: "salesman@random.com",
          internalUserId: 1,
          internalUserUUID: "ce5e3d7f-3a3d-4fde-96bc-986d5f483df8",
          type: 1,
          privileges: "{PUBLIC_USER}~{SALESMAN_USER}",
        });
      const carOnSaleClient = new CarOnSaleClient();
      const result = await carOnSaleClient.authService(
        "salesman@random.com",
        "123test"
      );
      expect(result).to.deep.equal({
        token: "token-test",
        authenticated: true,
        userId: "salesman@random.com",
        internalUserId: 1,
        internalUserUUID: "ce5e3d7f-3a3d-4fde-96bc-986d5f483df8",
        type: 1,
        privileges: "{PUBLIC_USER}~{SALESMAN_USER}",
      });
    });
    it('should throw an error with status code 401', async () => {
      const userMailId = "salesman@random.com";
        const password = "123test-wrong";
        nock("https://api-core-dev.caronsale.de/api")
          .put(`/v1/authentication/${userMailId}`, { password })
          .reply(401)
          try {
            const carOnSaleClient = new CarOnSaleClient();
               await carOnSaleClient.authService(
                "salesman@random.com",
                "123test-wrong"
              );
          } catch (error) {
            expect(error.response.status).to.equal(401)
          }
    })
    it('should throw an error with status code 400', async () => {
      const userMailId = "salesman@randomtest.com";
        const password = "123test";
        nock("https://api-core-dev.caronsale.de/api")
          .put(`/v1/authentication/${userMailId}`, { password })
          .reply(400)
          try {
            const carOnSaleClient = new CarOnSaleClient();
               await carOnSaleClient.authService(
                "salesman@randomtest.com",
                "123test"
              );
          } catch (error) {
            expect(error.response.status).to.equal(400)
          }
    })
  });
  
});
