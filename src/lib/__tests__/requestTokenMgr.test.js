const RequestTokenMgr = require("../requestTokenMgr");

describe("RequestTokenMgr", () => {
  let sut;
  //let eventToken='eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImlhdCI6MTUxMzM1MjgwNiwiZXZlbnQiOnsidHlwZSI6IlNBVkVfRlVFTF9CQUxBTkNFIiwiYWRkcmVzcyI6IjJvenNGUVdBVTdDcEhaTHF1MndTWWJKRld6RE5CMjZhb0NGIiwiYmFsYW5jZSI6IjAifSwiZXhwIjoxNTEzNDM5MjA2fQ.hs0JTSiUe2CzaOm32v80862BFGi2dgvBCHG5yIA7tLKCjnON2e39LddywBpiNlCVVzR_qn-IsZ3xhHWjXVT0Yg'
  let eventToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImlhdCI6MTUxMzM1MjgzNCwiZXZlbnQiOnsidHlwZSI6IlNUT1JFX0NPTk5FQ1RJT04iLCJhZGRyZXNzIjoiMm96c0ZRV0FVN0NwSFpMcXUyd1NZYkpGV3pETkIyNmFvQ0YiLCJjb25uZWN0aW9uVHlwZSI6ImNvbnRyYWN0cyIsImNvbm5lY3Rpb24iOiIweDJjYzMxOTEyYjJiMGYzMDc1YTg3YjM2NDA5MjNkNDVhMjZjZWYzZWUifSwiZXhwIjoxNTEzNDM5MjM0fQ.tqX5eEuaTEyYPUSgatK5zEsj_WpE-dIEHDc4ItpOvAZuBkSyV9_zbb0puNtDrZTVA7MlZ43FSSpf9CGIUxup-w";

  beforeAll(() => {
    sut = new RequestTokenMgr();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("verifyToken() no token", () => {
    return expect(sut.verifyToken(null)).rejects.toEqual("no token")
  });

  test("verifyToken() happy path", () => {
    const DATE_TO_USE = new Date("2017-12-15T22:41:20");
    Date.now = jest.genMockFunction().mockReturnValue(DATE_TO_USE);

    return expect(sut.verifyToken(eventToken)).resolves.toMatchSnapshot();
  });
});
