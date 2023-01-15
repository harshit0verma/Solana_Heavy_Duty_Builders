"use strict";
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
var secret = Uint8Array.from(process.env.SOLANA_SECRET_KEY);
var payer_key = web3_js_1.Keypair.fromSecretKey(secret);
var InstructionType;
(function (InstructionType) {
    InstructionType[InstructionType["CpiTransfer"] = 0] = "CpiTransfer";
    InstructionType[InstructionType["ProgramTransfer"] = 1] = "ProgramTransfer";
})(InstructionType || (InstructionType = {}));
var TransferInstruction = /** @class */ (function () {
    function TransferInstruction(props) {
        this.instruction = props.instruction;
        this.amount = props.amount;
    }
    TransferInstruction.prototype.toBuffer = function () {
        return buffer_1.Buffer.from(borsh.serialize(TransferInstructionSchema, this));
    };
    TransferInstruction.fromBuffer = function (buffer) {
        return borsh.deserialize(TransferInstructionSchema, TransferInstruction, buffer);
    };
    return TransferInstruction;
}());
var TransferInstructionSchema = new Map([
    [
        TransferInstruction,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["amount", "u64"],
            ]
        },
    ],
]);
function createTransferInstruction(payerPubkey, recipientPubkey, programId, instruction, amount) {
    var instructionObject = new TransferInstruction({
        instruction: instruction,
        amount: amount
    });
    var ix = new web3_js_1.TransactionInstruction({
        keys: [
            { pubkey: payerPubkey, isSigner: true, isWritable: true },
            { pubkey: recipientPubkey, isSigner: false, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: programId,
        data: instructionObject.toBuffer()
    });
    return ix;
}
var connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
var payer = payer_key;
var PROGRAM_ID = new web3_js_1.PublicKey("FhuaRZw6y8kuvygEejDtp9K9rR9LZoZ91XCnYS4Jyrvy");
var test1Recipient = new web3_js_1.PublicKey("H1Jjnk9zXpWi6pzCk2ddUxkH3DjJFiq5zGKoqALjLjoh");
var transferAmount = 1 * web3_js_1.LAMPORTS_PER_SOL;
// const transaction = new web3.Transaction();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var ix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ix = createTransferInstruction(payer.publicKey, test1Recipient, PROGRAM_ID, InstructionType.CpiTransfer, transferAmount);
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(ix), [payer])];
                case 1:
                    _a.sent();
                    console.log("completed");
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return process.exit(); }, function (err) {
    console.error(err);
    process.exit(-1);
});
