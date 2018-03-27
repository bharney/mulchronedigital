import * as mocha from "mocha";
import * as chai from "chai";
const assert = chai.assert;
import { UserAuthenicationValidator } from "../../shared/UserAuthenicationValidator";

describe("UserAuthenicationValidator Class Tests", () => {
    it("it should say the username is valid", async () => {
        const validUsername = "mtmulch1234";
        const result = await UserAuthenicationValidator.isUserNameValid(validUsername);
        assert.equal(result, true);
    });

    it("it should say the username is invalid", async () => {
        const shortUsername = "nah";
        const shortUsernameResult = await UserAuthenicationValidator.isUserNameValid(shortUsername);
        assert.equal(shortUsernameResult, false);
        const toLongUsername = "mtmulch123993198213893189312";
        const toLongUsernameResult = await UserAuthenicationValidator.isUserNameValid(toLongUsername);
        assert.equal(toLongUsernameResult, false);
        const nullValue = null;
        const nullValueResult = await UserAuthenicationValidator.isUserNameValid(nullValue);
        assert.equal(nullValueResult, false);
    });

    it("it should say the password is valid", async () => {
        const validPassword = "Password!@#$12";
        const result = await UserAuthenicationValidator.isPasswordValid(validPassword);
        assert.equal(result, true);
    });

    it("it should say the password is invalid", async () => {
        const badPassword = "this is a bad password";
        const badPasswordTwo = null;
        const result = await UserAuthenicationValidator.isPasswordValid(badPassword);
        assert.equal(result, false);
        const result2 = await UserAuthenicationValidator.isPasswordValid(badPasswordTwo);
        assert.equal(result2, false);
    });

    it("it should say the email is valid", async () => {
        const validEmail = "testemail@gmail.com";
        const result = await UserAuthenicationValidator.isEmailValid(validEmail);
        assert.equal(result, true);
        const validEmailTwo = "testemail@yahoo.net";
        const resultTwo = await UserAuthenicationValidator.isEmailValid(validEmailTwo);
        assert.equal(resultTwo, true);
    });

    it("it should say the email is invalid", async () => {
        const nullValue = null;
        const nullResult = await UserAuthenicationValidator.isEmailValid(nullValue);
        assert.equal(nullResult, false);
        const badEmail = "testemail@gmail";
        const badEmailResult = await UserAuthenicationValidator.isEmailValid(badEmail);
        assert.equal(badEmailResult, false);
        const badEmailTwo = "testemail@gmail.c";
        const badEmailTwoResult = await UserAuthenicationValidator.isEmailValid(badEmailTwo);
        assert.equal(badEmailTwoResult, false);
    });

    it("it should say the tokenpassword is valid", async () => {
        const validPassword = ".123456asdfw";
        const result = await UserAuthenicationValidator.isTokenPasswordValid(validPassword);
        assert.equal(result, true);
    });

    it("it should say the tokenpassword is invalid", async () => {
        const nullTokenPassword = null;
        const nullResult = await UserAuthenicationValidator.isTokenPasswordValid(nullTokenPassword);
        assert.equal(nullResult, false);
        const badTokenPassword = ".123456as";
        const badTokenResult = await UserAuthenicationValidator.isTokenPasswordValid(badTokenPassword);
        assert.equal(badTokenResult, false);
        const toLongBadTokenPassword = "12389138793198231978.asdasd";
        const toLongResult = await UserAuthenicationValidator.isTokenPasswordValid(toLongBadTokenPassword);
        assert.equal(toLongResult, false);
    });

    it("it should say this is a valid mongoid", async () => {
        const validMongoId = "5ab5bfa9ab5f1d62cf777a8d";
        const result = await UserAuthenicationValidator.isThisAValidMongoObjectId(validMongoId);
        assert.equal(result, true);
    });

    it("it should say this is an invalid mongoid", async () => {
        const nullValue = null;
        const nullResult = await UserAuthenicationValidator.isThisAValidMongoObjectId(nullValue);
        assert.equal(nullResult, false);
        const toLong = "5ab5bfa9ab5f1d62cf777a8dzasd";
        const toLongResult = await UserAuthenicationValidator.isThisAValidMongoObjectId(toLong);
        assert.equal(toLongResult, false);
        const toShort = "123acasdaj98123j";
        const toShortResult = await UserAuthenicationValidator.isThisAValidMongoObjectId(toShort);
        assert.equal(toShortResult, false);
    });
});
