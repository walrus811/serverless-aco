const _ = require("lodash");
const { TABLE_NAME, PARTIAL_SCHOOL_EXP, PK_SCHOOL } = require("./contants");
const { get, getById, post } = require("./crud");

const getSchool = _.partial(get, TABLE_NAME, PARTIAL_SCHOOL_EXP, PK_SCHOOL);
const getSchoolById = _.partial(getById, TABLE_NAME, PK_SCHOOL);
const postSchool = _.partial(post, TABLE_NAME, PK_SCHOOL, "name", (v) => v);

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

module.exports = {
    getSchool,
    getSchoolById,
    getSchoolItem,
    postSchool,
};
