"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var web3_js_1 = require("@solana/web3.js");
var borsh = require("borsh");
var buffer_1 = require("buffer");
//helper function
var secret = Uint8Array.from([235, 40, 10, 64, 103, 203, 112, 117, 0, 161, 229, 107, 59, 46, 85, 214, 156, 63, 28, 86, 234, 180, 40, 202, 130, 28, 93, 92, 93, 20, 0, 154, 200, 252, 178, 189, 229, 217, 189, 78, 149, 73, 178, 38, 122, 198, 198, 165, 141, 226, 197, 19, 200, 160, 236, 246, 5, 137, 186, 163, 99, 100, 121, 227]);
var payer_key = web3_js_1.Keypair.fromSecretKey(secret);
var connection = new web3_js_1.Connection("https://api.devnet.solana.com", 'confirmed');
var payer = payer_key;
var PROGRAM_ID = new web3_js_1.PublicKey("2FWchyF2hvJrpwuXzxmucb1UQd7tVbEpnJMWVe1gHXuN");
var Assignable = /** @class */ (function () {
    function Assignable(properties) {
        var _this = this;
        Object.keys(properties).map(function (key) {
            return (_this[key] = properties[key]);
        });
    }
    ;
    return Assignable;
}());
;
var AddressInfo = /** @class */ (function (_super) {
    __extends(AddressInfo, _super);
    function AddressInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddressInfo.prototype.toBuffer = function () { return buffer_1.Buffer.from(borsh.serialize(AddressInfoSchema, this)); };
    AddressInfo.fromBuffer = function (buffer) {
        return borsh.deserialize(AddressInfoSchema, AddressInfo, buffer);
    };
    ;
    return AddressInfo;
}(Assignable));
;
var AddressInfoSchema = new Map([
    [AddressInfo, {
            kind: 'struct',
            fields: [
                ['name', 'string'],
                ['house_number', 'u8'],
            ]
        }]
]);
var addressInfoAccount = web3_js_1.Keypair.generate();
function main2() {
    return __awaiter(this, void 0, void 0, function () {
        var ix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Create the address info account");
                    console.log("Payer Address      : ".concat(payer.publicKey));
                    console.log("Address Info Acct  : ".concat(addressInfoAccount.publicKey));
                    ix = new web3_js_1.TransactionInstruction({
                        keys: [
                            { pubkey: addressInfoAccount.publicKey, isSigner: true, isWritable: true },
                            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
                            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false }
                        ],
                        programId: PROGRAM_ID,
                        data: (new AddressInfo({
                            name: "Harshit Verma",
                            house_number: 123
                        })).toBuffer()
                    });
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(ix), [payer, addressInfoAccount])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main3() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Read the new account's data");
            console.log(addressInfoAccount.publicKey);
            return [2 /*return*/];
        });
    });
}
main2();
main3();
