const _ = require("lodash");
const { TABLE_NAME, PARTIAL_SCHOOL_EXP, PK_SCHOOL } = require("./contants");
const { get, getById, post } = require("./crud");

const getSchool = _.partial(get, TABLE_NAME, PARTIAL_SCHOOL_EXP, PK_SCHOOL);
const getSchoolById = _.partial(getById, TABLE_NAME, PK_SCHOOL);
const postSchool = _.partial(post, TABLE_NAME);

/**
 * @description convert dynamodb item to School
 * @param {Record<string, any>} item
 * @return {import("./typedefs").SchoolWithId}
 */
function getSchoolItem(item) {
  return {
    id: item.SK,
    name: item.SK,
  };
}

/**
 * @description convert school data to create
 * @param {import("./typedefs").School} data
 * @returns {import("./typedefs").DDBItem}
 */
function createSchoolPostItem(data) {
  return {
    PK: PK_SCHOOL,
    SK: data.name,
  };
}

module.exports = {
  getSchool,
  getSchoolById,
  postSchool,
  getSchoolItem,
  createSchoolPostItem,
};
