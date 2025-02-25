/**
 * Tokenizes an input string and returns an array of tokens (with metadata).
 */
export function tokenize(input) {
  const tokens = [];
  // Extended regex to capture numbers, single-quoted strings, identifiers, punctuation, and whitespace
  const regex = /[A-Za-z_]\w*|\d+(?:\.\d+)?|'[^']*'|[.*()=]|\*|\s+/g;
  let pos = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    if (match.index !== pos) {
      const invalidPart = input.slice(pos, match.index);
      throw new Error(`Invalid token encountered: "${invalidPart}" at position ${pos}`);
    }

    const text = match[0];
    pos = regex.lastIndex;

    // Ignore pure whitespace
    if (/^\s+$/.test(text)) {
      continue;
    }

    let type;
    if (/^[A-Za-z_]\w*$/.test(text)) {
      type = "identifier";
    } else if (/^\d+(?:\.\d+)?$/.test(text)) {
      type = "number";
    } else if (/^'[^']*'$/.test(text)) {
      type = "string";
    } else if (text === ".") {
      type = "dot";
    } else if (text === "(") {
      type = "lparen";
    } else if (text === ")") {
      type = "rparen";
    } else if (text === "=") {
      type = "equals";
    } else if (text === "*") {
      type = "asterisk";
    } else {
      throw new Error(`Unexpected token: "${text}"`);
    }

    tokens.push({ type, value: text, pos: match.index });
  }

  if (pos !== input.length) {
    throw new Error(`Invalid token encountered at end of input at position ${pos}`);
  }

  return tokens;
}
