const _ = require("lodash");
const { TABLE_NAME, PARTIAL_SCHOOL_EXP, PK_SCHOOL } = require("./contants");
const { get } = require("./crud");

const getSchool = _.partial(
  get,
  TABLE_NAME,
  PARTIAL_SCHOOL_EXP,
  PK_SCHOOL
);
getSchool
module.exports = {
  getSchool,
};
