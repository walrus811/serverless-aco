const _ = require("lodash");
const {
  TABLE_NAME,
  PARTIAL_PROJECT_SCHOOL_EXP: PARTIAL_SCHOOL_EXP,
  PK_SCHOOL,
} = require("./contants");
const { get, getById, post, put, deleteItem } = require("./crud");

const getSchool = _.partial(get, TABLE_NAME, PARTIAL_SCHOOL_EXP, PK_SCHOOL);
const getSchoolById = _.partial(getById, TABLE_NAME, PK_SCHOOL);
const postSchool = _.partial(post, TABLE_NAME);
const putSchool = _.partial(put, TABLE_NAME);
const deleteSchool = _.partial(deleteItem, TABLE_NAME);

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
function createPostDDBItem(data) {
  return _.omit(
    {
      ...data,
      PK: PK_SCHOOL,
      SK: data.name,
    },
    "name"
  );
}

/**
 * @description convert school data to create
 * @param {Record<string,any>} data
 * @param {import("./typedefs").School} newData
 * @returns {import("./typedefs").DDBItem}
 */
function createPutDDBItem(data, newData) {
  return _.omit(
    {
      ...newData,
      PK: PK_SCHOOL,
      SK: newData.name,
    },
    "name"
  );
}

/**
 * @description convert school data to create
 * @param {Record<string,any>} data
 * @returns {import("./typedefs").DDBItem}
 */
function createDeleteDDBItem(data) {
  return _.pick(data, ["PK", "SK"]);
}

/**
 * @param {string} name
 * @returns {string}
 */
function getSortKey(name) {
  return name;
}

module.exports = {
  getSchool,
  getSchoolById,
  postSchool,
  putSchool,
  deleteSchool,
  getSchoolItem,
  createPostDDBItem,
  createPutDDBItem,
  createDeleteDDBItem,
  getSortKey,
};
