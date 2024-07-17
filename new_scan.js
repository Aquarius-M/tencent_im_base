const keyMap = new Map();

const hashStr = (text) => {
  "use strict";

  let hash = 5381,
    index = text.length;

  while (index) {
    hash = (hash * 33) ^ text.charCodeAt(--index);
  }

  return hash >>> 0;
};

const hashKey = (value, context, onError) => {
  const key =
    "k_" + ("0000" + hashStr(value.replace(/\s+/g, "")).toString(36)).slice(-7);

  return key;
};

console.log(hashKey("当前目录"));