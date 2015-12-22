var EventEmitter=require("events").EventEmitter,exports=module.exports=keypress;
function keypress(c){function b(a){0<listenerCount(c,"keypress")?(a=c._keypressDecoder.write(a))&&emitKey(c,a):(c.removeListener("data",b),c.on("newListener",f))}function f(a){"keypress"==a&&(c.on("data",b),c.removeListener("newListener",f))}if(!isEmittingKeypress(c)){var a=require("string_decoder").StringDecoder;c._keypressDecoder=new a("utf8");if(0<listenerCount(c,"keypress"))c.on("data",b);else c.on("newListener",f)}}
function isEmittingKeypress(c){var b=!!c._keypressDecoder;b||(c.listeners("data").slice(0).forEach(function(b){"onData"==b.name&&/emitKey/.test(b.toString())&&c.removeListener("data",b)}),c.listeners("newListener").slice(0).forEach(function(b){"onNewListener"==b.name&&/keypress/.test(b.toString())&&c.removeListener("newListener",b)}));return b}exports.enableMouse=function(c){c.write("\u001b[?1000h")};exports.disableMouse=function(c){c.write("\u001b[?1000l")};var listenerCount=EventEmitter.listenerCount;
listenerCount||(listenerCount=function(c,b){return c.listeners(b).length});var metaKeyCodeRe=/^(?:\x1b)([a-zA-Z0-9])$/,functionKeyCodeRe=/^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;
function emitKey(c,b){var f,a={name:void 0,ctrl:!1,meta:!1,shift:!1},d;Buffer.isBuffer(b)&&(127<b[0]&&void 0===b[1]?(b[0]-=128,b="\u001b"+b.toString(c.encoding||"utf-8")):b=b.toString(c.encoding||"utf-8"));a.sequence=b;if("\r"===b)a.name="return";else if("\n"===b)a.name="enter";else if("\t"===b)a.name="tab";else if("\b"===b||"\u007f"===b||"\u001b\u007f"===b||"\u001b\b"===b)a.name="backspace",a.meta="\u001b"===b.charAt(0);else if("\u001b"===b||"\u001b\u001b"===b)a.name="escape",a.meta=2===b.length;
else if(" "===b||"\u001b "===b)a.name="space",a.meta=2===b.length;else if("\u001a">=b)a.name=String.fromCharCode(b.charCodeAt(0)+97-1),a.ctrl=!0;else if(1===b.length&&"a"<=b&&"z">=b)a.name=b;else if(1===b.length&&"A"<=b&&"Z">=b)a.name=b.toLowerCase(),a.shift=!0;else if(d=metaKeyCodeRe.exec(b))a.name=d[1].toLowerCase(),a.meta=!0,a.shift=/^[A-Z]$/.test(d[1]);else if(d=functionKeyCodeRe.exec(b)){var e=(d[1]||"")+(d[2]||"")+(d[4]||"")+(d[6]||"");d=(d[3]||d[5]||1)-1;a.ctrl=!!(d&4);a.meta=!!(d&10);a.shift=
!!(d&1);a.code=e;switch(e){case "OP":a.name="f1";break;case "OQ":a.name="f2";break;case "OR":a.name="f3";break;case "OS":a.name="f4";break;case "[11~":a.name="f1";break;case "[12~":a.name="f2";break;case "[13~":a.name="f3";break;case "[14~":a.name="f4";break;case "[[A":a.name="f1";break;case "[[B":a.name="f2";break;case "[[C":a.name="f3";break;case "[[D":a.name="f4";break;case "[[E":a.name="f5";break;case "[15~":a.name="f5";break;case "[17~":a.name="f6";break;case "[18~":a.name="f7";break;case "[19~":a.name=
"f8";break;case "[20~":a.name="f9";break;case "[21~":a.name="f10";break;case "[23~":a.name="f11";break;case "[24~":a.name="f12";break;case "[A":a.name="up";break;case "[B":a.name="down";break;case "[C":a.name="right";break;case "[D":a.name="left";break;case "[E":a.name="clear";break;case "[F":a.name="end";break;case "[H":a.name="home";break;case "OA":a.name="up";break;case "OB":a.name="down";break;case "OC":a.name="right";break;case "OD":a.name="left";break;case "OE":a.name="clear";break;case "OF":a.name=
"end";break;case "OH":a.name="home";break;case "[1~":a.name="home";break;case "[2~":a.name="insert";break;case "[3~":a.name="delete";break;case "[4~":a.name="end";break;case "[5~":a.name="pageup";break;case "[6~":a.name="pagedown";break;case "[[5~":a.name="pageup";break;case "[[6~":a.name="pagedown";break;case "[7~":a.name="home";break;case "[8~":a.name="end";break;case "[a":a.name="up";a.shift=!0;break;case "[b":a.name="down";a.shift=!0;break;case "[c":a.name="right";a.shift=!0;break;case "[d":a.name=
"left";a.shift=!0;break;case "[e":a.name="clear";a.shift=!0;break;case "[2$":a.name="insert";a.shift=!0;break;case "[3$":a.name="delete";a.shift=!0;break;case "[5$":a.name="pageup";a.shift=!0;break;case "[6$":a.name="pagedown";a.shift=!0;break;case "[7$":a.name="home";a.shift=!0;break;case "[8$":a.name="end";a.shift=!0;break;case "Oa":a.name="up";a.ctrl=!0;break;case "Ob":a.name="down";a.ctrl=!0;break;case "Oc":a.name="right";a.ctrl=!0;break;case "Od":a.name="left";a.ctrl=!0;break;case "Oe":a.name=
"clear";a.ctrl=!0;break;case "[2^":a.name="insert";a.ctrl=!0;break;case "[3^":a.name="delete";a.ctrl=!0;break;case "[5^":a.name="pageup";a.ctrl=!0;break;case "[6^":a.name="pagedown";a.ctrl=!0;break;case "[7^":a.name="home";a.ctrl=!0;break;case "[8^":a.name="end";a.ctrl=!0;break;case "[Z":a.name="tab";a.shift=!0;break;default:a.name="undefined"}}else if(1<b.length&&"\u001b"!==b[0]){Array.prototype.forEach.call(b,function(a){emitKey(c,a)});return}"[M"==a.code&&(a.name="mouse",b=a.sequence,e=b.charCodeAt(3),
a.x=b.charCodeAt(4)-32,a.y=b.charCodeAt(5)-32,a.scroll=0,a.ctrl=!!(16&e),a.meta=!!(8&e),a.shift=!!(4&e),a.release=3===(3&e),64&e&&(a.scroll=1&e?1:-1),a.release||a.scroll||(a.button=e&3));void 0===a.name&&(a=void 0);1===b.length&&(f=b);a&&"mouse"==a.name?c.emit("mousepress",a):(a||f)&&c.emit("keypress",f,a)};
