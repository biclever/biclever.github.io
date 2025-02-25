// parser.js
import { tokenize } from './tokenize.js';

/**
 * Parses a single line into one of the categories: alias, field, or join.
 * @param {string} line - A single line of input.
 * @returns {object|null} The parsed result or null for an empty line.
 */
export function parseLine(line) {
  const indentation = line.match(/^\s*/)[0];
  const trimmed = line.trim();
  if (trimmed === "") return null;

  let tokens;
  try {
    tokens = tokenize(trimmed);
  } catch (err) {
    return { error: err.message, original: line };
  }

  // Alias: [identifier, "(", identifier, ")"]
  if (
    tokens.length === 4 &&
    tokens[0].type === "identifier" &&
    tokens[1].type === "lparen" &&
    tokens[2].type === "identifier" &&
    tokens[3].type === "rparen"
  ) {
    return {
      type: "alias",
      alias: tokens[0].value,
      target: tokens[2].value
    };
  }

  // Field: single identifier => table with all fields.
  if (tokens.length === 1 && tokens[0].type === "identifier") {
    return {
      type: "field",
      table: tokens[0].value,
      field: "*",
      indentation: indentation.length
    };
  }

  // Field: single identifier => table with all fields.
  if (tokens.length === 3 && tokens[0].type === "identifier" && tokens[1].type === "dot" && tokens[2].type === "asterisk") {
    return {
      type: "field",
      table: tokens[0].value,
      field: "*",
      indentation: indentation.length
    };
  }

  // Field: dotted field [identifier, ".", identifier]
  if (
    tokens.length === 3 &&
    tokens[0].type === "identifier" &&
    tokens[1].type === "dot" &&
    tokens[2].type === "identifier"
  ) {
    return {
      type: "field",
      table: tokens[0].value,
      field: tokens[2].value,
      indentation: indentation.length
    };
  }

  // Field assignment: [identifier, "=", identifier, ".", identifier]
  if (
    tokens.length === 5 &&
    tokens[0].type === "identifier" &&
    tokens[1].type === "equals" &&
    tokens[2].type === "identifier" &&
    tokens[3].type === "dot" &&
    tokens[4].type === "identifier"
  ) {
    return {
      type: "field",
      alias: tokens[0].value,
      table: tokens[2].value,
      field: tokens[4].value,
      indentation: indentation.length
    };
  }

  // Restriction: anything that contains a string or number.
  if (tokens.some(t => t.type === "string" || t.type === "number")) {
    // collect all tables (identifier+dot)
    const tables = [];
    let currentTable = "";
    let containsOr = false;
    tokens.forEach(token => {
      if (token.type === "identifier" && currentTable === "") {
        currentTable = token.value;
      } else if (token.type === "dot" && currentTable !== "") {
        tables.push(currentTable);
        currentTable = "";
      } else {
        currentTable = "";
      }
      if (token.type === "identifier" && token.value.toLowerCase() === "or") {
        containsOr = true;
      }
    });
    return {
      type: "restriction",
      tables: tables,
      containsOr: containsOr,
      expression: tokens.map(t => t.value).join(" ").replace(/\s*\.\s*/g, ".")
    }
  }  

  // Attempt to parse a join: split tokens by "and" (case-insensitive).
  let conditions = [];
  let currentCondition = [];
  tokens.forEach(token => {
    if (token.type === "identifier" && token.value.toLowerCase() === "and") {
      if (currentCondition.length > 0) {
        conditions.push(currentCondition);
        currentCondition = [];
      }
    } else {
      currentCondition.push(token);
    }
  });
  if (currentCondition.length > 0) {
    conditions.push(currentCondition);
  }

  // Validate each condition: [identifier, ".", identifier, "=", identifier, ".", identifier]
  const allValid = conditions.every(cond =>
    cond.length === 7 &&
    cond[0].type === "identifier" &&
    cond[1].type === "dot" &&
    cond[2].type === "identifier" &&
    cond[3].type === "equals" &&
    cond[4].type === "identifier" &&
    cond[5].type === "dot" &&
    cond[6].type === "identifier"
  );

  if (allValid && conditions.length > 0) {
    const leftTables = conditions.map(cond => cond[0].value);
    const uniqueLeftTables = [...new Set(leftTables)];
    const rightTables = conditions.map(cond => cond[4].value);
    const uniqueRightTables = [...new Set(rightTables)];

    if (uniqueRightTables.length !== 1) {
      return { error: "Join restrictions have different right tables", tokens, original: line };
    }
    const rightTable = uniqueRightTables[0];
    const expression = tokens
      .map(t => t.value)
      .join(" ")
      .replace(/\s*\.\s*/g, ".");

    if (uniqueLeftTables.length === 1) {
      return {
        type: "join",
        leftTable: uniqueLeftTables[0],
        rightTable: rightTable,
        expression: expression
      };
    } else if (uniqueLeftTables.length === 2) {
      const mainLeft = conditions[0][0].value;
      const bridgeTable = uniqueLeftTables.find(x => x !== mainLeft);
      return {
        type: "join",
        leftTable: mainLeft,
        bridgeTable: bridgeTable,
        rightTable: rightTable,
        expression: expression
      };
    } else {
      return { error: "Join has more than 2 distinct left tables", tokens, original: line };
    }
  }

  return { error: "Line did not match any known pattern", tokens, original: line };
}

export function parseInput(lines) {
  const fields = [];
  const aliases = [];
  const joins = [];
  const restrictions = [];
  const errors = [];

  lines.forEach((line, index) => {
    const parsed = parseLine(line);
    if (!parsed) return; // Skip empty lines
    if (parsed.error) {
      errors.push({ line: index + 1, error: parsed.error, original: parsed.original });
    } else {
      if (parsed.type === "alias") {
        aliases.push(parsed);
      } else if (parsed.type === "field") {
        fields.push(parsed);
      } else if (parsed.type === "join") {
        joins.push(parsed);
      } else if (parsed.type === "restriction") {
        restrictions.push(parsed);
      } else {
        errors.push({ line: index + 1, error: "Unknown type", original: line });
      }
    }
  });

  return { fields, aliases, joins, restrictions, errors };
}
