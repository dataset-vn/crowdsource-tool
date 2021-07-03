(self["webpackChunk_heartexlabs_datamanager"] = self["webpackChunk_heartexlabs_datamanager"] || []).push([["src_dev_js"],{

/***/ "./src/dev.js":
/*!********************!*\
  !*** ./src/dev.js ***!
  \********************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initDevApp": function() { return /* binding */ initDevApp; }
/* harmony export */ });
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

const API_GATEWAY = "http://localhost:8000/api/dm";
const LS_ACCESS_TOKEN = "";
/**
 * @param {import("../src/sdk/dm-sdk").DataManager} DataManager
 */

const initDevApp = async DataManager => {
  const gatewayAPI = API_GATEWAY !== null && API_GATEWAY !== void 0 ? API_GATEWAY : "http://localhost:8081/api/dm";
  const useExternalSource = !!gatewayAPI;
  const dm = new DataManager({
    root: document.getElementById("app"),
    apiGateway: gatewayAPI,
    apiVersion: 2,
    apiMockDisabled: useExternalSource,
    apiHeaders: {
      Authorization: `Token ${LS_ACCESS_TOKEN}`
    },
    labelStudio: {
      user: {
        pk: 1,
        firstName: "James",
        lastName: "Dean"
      }
    },
    table: {
      hiddenColumns: {
        explore: ["tasks:completed_at", "tasks:data"]
      },
      visibleColumns: {
        labeling: ["tasks:id", "tasks:was_cancelled", "tasks:data.image", "tasks:data.text", "annotations:id", "annotations:task_id"]
      }
    }
  });
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(API_GATEWAY, "API_GATEWAY", "C:\\Users\\NDm\\repos\\dm2\\src\\dev.js");
  reactHotLoader.register(LS_ACCESS_TOKEN, "LS_ACCESS_TOKEN", "C:\\Users\\NDm\\repos\\dm2\\src\\dev.js");
  reactHotLoader.register(initDevApp, "initDevApp", "C:\\Users\\NDm\\repos\\dm2\\src\\dev.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ })

}]);
//# sourceMappingURL=src_dev_js.chunk.js.map