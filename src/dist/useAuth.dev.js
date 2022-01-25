"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useAuth;

var _react = require("react");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useAuth(code) {
  var _useState = (0, _react.useState)(),
    _useState2 = _slicedToArray(_useState, 2),
    accessToken = _useState2[0],
    setAccessToken = _useState2[1];

  var _useState3 = (0, _react.useState)(),
    _useState4 = _slicedToArray(_useState3, 2),
    refreshToken = _useState4[0],
    setRefreshToken = _useState4[1];

  var _useState5 = (0, _react.useState)(),
    _useState6 = _slicedToArray(_useState5, 2),
    expiresIn = _useState6[0],
    setExpiresIn = _useState6[1]; // console.log("token",code);
  // console.log("refreshTOken", refreshToken);
  // console.log("expires in",expiresIn);


  (0, _react.useEffect)(function () {
    _axios["default"].post('http://localhost:3001/login', {
      code: code
    }).then(function (res) {
      console.log(res.data);
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setExpiresIn(res.data.expiresIn);
      window.history.pushState({}, null, '/');
    })["catch"](function () {
      window.location = '/';
    });
  }, [code]);
  (0, _react.useEffect)(function () {
    // console.log("refreshtokken refresh",refreshToken);
    // console.log("expires refresh",expiresIn);
    if (!refreshToken || !expiresIn) return; //console.log("abc");

    var interval = setInterval(function () {
      _axios["default"].post('http://localhost:3001/refresh', {
        refreshToken: refreshToken
      }).then(function (res) {
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
        console.log(res.data);
      })["catch"](function () {
        window.location = '/';
      });
    }, (expiresIn - 60) * 1000);
    return function () {
      return clearInterval(interval);
    };
  }, [refreshToken, expiresIn]);
  return accessToken;
}