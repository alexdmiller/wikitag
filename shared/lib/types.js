"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Events
var Event;
(function (Event) {
    Event["Connected"] = "Connected";
    Event["GameState"] = "GameState";
    Event["GameJoined"] = "GameJoined";
    Event["WikiPageReceived"] = "WikiPageReceived";
})(Event = exports.Event || (exports.Event = {}));
// Commands
var Command;
(function (Command) {
    Command["JoinGame"] = "JoinGame";
    Command["LeaveGame"] = "LeaveGame";
    Command["GoToPage"] = "GoToPage";
})(Command = exports.Command || (exports.Command = {}));
//# sourceMappingURL=types.js.map