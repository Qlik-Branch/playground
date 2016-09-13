(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlaygroundComponentBase = function () {
  function PlaygroundComponentBase(id) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var className = arguments[2];

    _classCallCheck(this, PlaygroundComponentBase);

    var element = document.createElement('div');
    element.id = id;
    element.classList.add(className);
    this.id = id;
    var html = this.templateHTML.replace(/{id}/gim, id);
    element.innerHTML = html;
    this.settings = Object.assign({}, this.defaults, options);
    var oldElement = document.getElementById(id);
    for (var i = 0; i < oldElement.classList.length; i++) {
      element.classList.add(oldElement.classList[i]);
    }
    if (oldElement) {
      if (oldElement.insertAdjacentElement) {
        oldElement.insertAdjacentElement("afterEnd", element);
      } else {
        oldElement.insertAdjacentHTML("afterEnd", element.outerHTML);
      }
      for (var _i = 0; _i < oldElement.attributes.length; _i++) {
        this[oldElement.attributes[_i].name] = oldElement.attributes[_i].value;
      }
      oldElement.parentNode.removeChild(oldElement);
    }
    this.elementHTML = element.outerHTML;
    return this;
  }

  _createClass(PlaygroundComponentBase, [{
    key: "templateHTML",
    get: function get() {
      return "\n\n    ";
    }
  }, {
    key: "defaultSettings",
    get: function get() {
      return {};
    },
    set: function set(value) {}
  }, {
    key: "settings",
    get: function get() {
      return {};
    },
    set: function set(value) {}
  }]);

  return PlaygroundComponentBase;
}();

var PlaygroundNotifier = function (_PlaygroundComponentB) {
  _inherits(PlaygroundNotifier, _PlaygroundComponentB);

  function PlaygroundNotifier(id) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, PlaygroundNotifier);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlaygroundNotifier).call(this, id, options, "playground-notifier"));

    Playground.notification.subscribe(_this.onNotification.bind(_this));
    return _this;
  }

  _createClass(PlaygroundNotifier, [{
    key: "onNotification",
    value: function onNotification(options) {
      this.show(options);
    }
  }, {
    key: "show",
    value: function show(options) {
      var _this2 = this;

      //duration is in milli seconds
      var defaults = {
        sentiment: "info",
        title: "",
        message: ""
      };
      var settings = Object.assign({}, defaults, options);
      var html = this.messageHTML.replace(/{sentiment}/gim, settings.sentiment).replace(/{title}/gim, settings.title).replace(/{message}/gim, settings.message);
      document.getElementById(this.id).classList.add('open');
      document.getElementById(this.id + '_message').innerHTML = html;
      if (settings.duration) {
        setTimeout(function () {
          _this2.hide();
        }, settings.duration);
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      document.getElementById(this.id).classList.remove('open');
      document.getElementById(this.id + '_message').innerHTML = "";
    }
  }, {
    key: "templateHTML",
    get: function get() {
      return "\n      <div id='{id}_notifier' class='playground-notifier-inner-container grey fog-bg'>\n        <div id='{id}_loading' class='loading'>&#60;&nbsp;&#62;</div>\n        <div id='{id}_message' class='message-container'></div>\n      <div>\n    ";
    }
  }, {
    key: "messageHTML",
    get: function get() {
      return "\n      <div data-sentiment={sentiment}>\n        <div class='notifier-title'>{title}</div>\n        <div class='notifier-message'>{message}</div>\n      </div>\n    ";
    }
  }]);

  return PlaygroundNotifier;
}(PlaygroundComponentBase);

var PlaygroundUI = function PlaygroundUI() {
  _classCallCheck(this, PlaygroundUI);

  this.components = {};
  var uiComponents = document.getElementsByTagName('playground');
  for (var i = 0; i < uiComponents.length;) {
    var componentType = uiComponents[i].attributes["component"].value;
    var id = uiComponents[i].id;
    switch (componentType) {
      case "notifier":
        var component = new PlaygroundNotifier(id);
        this.components[id] = component;
        break;
    }
  };
};

var playgroundUI = new PlaygroundUI();

},{}]},{},[1]);
