"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/readMe";
exports.ids = ["pages/api/readMe"];
exports.modules = {

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "(api)/./pages/api/readMe.ts":
/*!*****************************!*\
  !*** ./pages/api/readMe.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n\n\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        const readMePath = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), \"./\", `readMe.md`);\n        const readMeContent = await fs__WEBPACK_IMPORTED_MODULE_1___default().promises.readFile(readMePath, \"utf-8\");\n        res.status(200).json({\n            content: readMeContent\n        });\n    } else {\n        res.status(405).json({\n            message: \"Method not allowed\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvcmVhZE1lLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ3dCO0FBQ0o7QUFFTCxlQUFlRSxPQUFPLENBQUNDLEdBQW1CLEVBQUVDLEdBQW9CLEVBQUU7SUFDL0UsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssS0FBSyxFQUFFO1FBQ3hCLE1BQU1DLFVBQVUsR0FBR04sZ0RBQVMsQ0FBQ1EsT0FBTyxDQUFDQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5RCxNQUFNQyxhQUFhLEdBQUcsTUFBTVQsMkRBQW9CLENBQUNLLFVBQVUsRUFBRSxPQUFPLENBQUM7UUFDckVGLEdBQUcsQ0FBQ1MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7WUFBRUMsT0FBTyxFQUFFTCxhQUFhO1NBQUUsQ0FBQyxDQUFDO0lBQ25ELE9BQU87UUFDTE4sR0FBRyxDQUFDUyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztZQUFFRSxPQUFPLEVBQUUsb0JBQW9CO1NBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvYXBpL3JlYWRNZS50cz9hMzFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICBjb25zdCByZWFkTWVQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuLycsIGByZWFkTWUubWRgKTtcbiAgICBjb25zdCByZWFkTWVDb250ZW50ID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocmVhZE1lUGF0aCwgJ3V0Zi04Jyk7XG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBjb250ZW50OiByZWFkTWVDb250ZW50IH0pO1xuICB9IGVsc2Uge1xuICAgIHJlcy5zdGF0dXMoNDA1KS5qc29uKHsgbWVzc2FnZTogJ01ldGhvZCBub3QgYWxsb3dlZCcgfSk7XG4gIH1cbn0iXSwibmFtZXMiOlsicGF0aCIsImZzIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInJlYWRNZVBhdGgiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsInJlYWRNZUNvbnRlbnQiLCJwcm9taXNlcyIsInJlYWRGaWxlIiwic3RhdHVzIiwianNvbiIsImNvbnRlbnQiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/readMe.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/readMe.ts"));
module.exports = __webpack_exports__;

})();