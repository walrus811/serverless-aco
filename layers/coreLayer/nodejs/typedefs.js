/**
 * This file exists only for JSDOC type definitions.
 */

/**
 * @typedef {import("./contants").PK_SCHOOL} PK_SCHOOL
 * @typedef {import("./contants").PK_STUDENT} PK_STUDENT
 */

/**
 * @typedef DDBItem
 * @type {object}
 * @property {string} PK
 * @property {string} SK
 */

/**
 * @typedef School
 * @type {object}
 * @property {string} name
 *
 * @typedef Student
 * @type {object}
 * @property {string} name
 * @property {string} school
 * @property {number} grade
 * @property {false} retired
 */

/**
 * @typedef SchoolWithId
 * @type {object}
 * @property {string} id
 * @property {string} name
 *
 * @typedef StudentWithId
 * @type {object}
 * @property {string} id
 * @property {string} name
 * @property {string} school
 * @property {number} grade
 * @property {false} retired
 */

exports.unused = {};
