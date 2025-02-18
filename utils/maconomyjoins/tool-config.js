/*
 * ===============================================
 * SQL Filter Tool - Configuration Documentation
 * ===============================================
 *
 * This configuration file defines the tool's title, description, help text,
 * and transformation logic. It also includes an "optionalControls" array
 * that specifies additional UI controls. These controls are dynamically
 * created by the HTML based on this configuration.
 *
 * Optional Controls:
 *   - The "optionalControls" property is an array of objects, each defining
 *     an additional control for the tool.
 *
 *   - Each control object must include:
 *       • type: The type of control. Supported types are:
 *             - "switch": A toggle switch (checkbox).
 *             - "text": A text input field.
 *       • label: The text label to display for the control.
 *       • property: A key used to store the control's value in the options object.
 *
 *   - Example:
 *       optionalControls: [
 *         { type: "switch", label: "Single line", property: "compact" },
 *         { type: "switch", label: "Quote", property: "quote" }
 *       ]
 *
 * Transformation Options (opts):
 *   - When the tool processes input, it builds an "opts" object using the current
 *     values of the optional controls:
 *       • For a "switch" control, opts[<property>] is a Boolean (true if on, false if off).
 *       • For a "text" control, opts[<property>] is the string entered by the user.
 *
 *   - In the transformation function, these options can be used to adjust the output.
 *     For example, in this tool:
 *       • opts.compact controls whether output rows are concatenated on a single line.
 *       • opts.quote forces all values to be wrapped in quotes, regardless of type.
 *
 * Adjusting the Configuration:
 *   - To add, remove, or modify optional controls, simply update the
 *     "optionalControls" array. The HTML code will automatically create
 *     the controls based on this configuration.
 *
 * -----------------------------------------------
 */

import { myDatabase } from "./database.js";

export const toolConfig = {
  title: "Maconomy Query Builder",
  description: "Joins specified tables.",
  helpText: `
    <p>Enter text in the input field and click "Convert" or press <strong>Ctrl+Enter</strong>.</p>
    <p>Click "Copy" or press <strong>Ctrl+Shift+C</strong> to copy output to clipboard.</p>
<hr/>
    <h3>Example 1:</h3>
    <p>Input:</p>
    <pre>FinanceEntry
Account.AccountText</pre>
    <p>Will be converted to:</p>
    <pre>SELECT
  FinanceEntry.*,
  Account.AccountText
FROM FinanceEntry
LEFT JOIN Account ON (FinanceEntry.AccountNumber = Account.AccountNumber)</pre>
    <h3>Example 2:</h3>
    <p>Input:</p>
    <pre>JobEntry
Employee.Name
  ExecDepartment=Entity.Description</pre>
    <p>Will be converted to:</p>
    <pre>SELECT
  JobEntry.*,
  Employee.Name,
  Entity.Description AS ExecDepartment
FROM JobEntry
LEFT JOIN Employee ON (JobEntry.EmployeeNumber = Employee.EmployeeNumber)
LEFT JOIN Entity ON (Employee.EntityName = Entity.EntityName)</pre>
    <hr/>
    <p><strong>Parameters:</strong></p>
    <ul>
      <li><strong>Single line</strong>: When enabled, the whole condition will be on a single line. When disabled, each value is placed on a new line.</li>
      <li><strong>Quote</strong>: When disabled, numeric values are not quoted. When enabled, all values are wrapped in quotes regardless of whether they are numeric.</li>
    </ul>
  `,
  optionalControls: [
    {
      type: "switch",
      label: "Compact",
      property: "compact"
    },
    {
      type: "switch",
      label: "Maconomy terms",
      property: "maconomy"
    }
  ],

  // Hardcoded database lines (treated as an array of join expressions).
  database: myDatabase,

  /**
   * Tokenizes an input string and returns an array of tokens (with metadata).
   */
  tokenize(input) {
    const tokens = [];
    // Extended regex to capture numbers \d+(?:\.\d+)?,
    // single-quoted strings '[^']*', identifiers, punctuation, whitespace
    const regex = /[A-Za-z_]\w*|\d+(?:\.\d+)?|'[^']*'|[.()=]|\s+/g;
    let pos = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      // If there's a gap between the last match end (pos) and current match start,
      // that means there's some invalid/unmatched text.
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
      } else {
        throw new Error(`Unexpected token: "${text}"`);
      }

      tokens.push({ type, value: text, pos: match.index });
    }

    // If we haven't consumed the entire string, it's an error.
    if (pos !== input.length) {
      throw new Error(`Invalid token encountered at end of input at position ${pos}`);
    }

    return tokens;
  },

  /**
   * Parses a single line into one of the categories: alias, field, or join.
   */
  parseLine(line) {
    const indentation = line.match(/^\s*/)[0];
    const trimmed = line.trim();
    if (trimmed === "") return null;

    let tokens;
    try {
      tokens = this.tokenize(trimmed);
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

    // Validate each condition: [identifier "." identifier "=" identifier "." identifier]
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
  },

  /**
   * Parses multiple lines into fields, aliases, joins, or errors.
   */
  parseInput(input) {
    const lines = input.split(/\r?\n/);
    const fields = [];
    const aliases = [];
    const joins = [];
    const errors = [];

    lines.forEach((line, index) => {
      const parsed = this.parseLine(line);
      if (!parsed) return; // empty line
      if (parsed.error) {
        errors.push({ line: index + 1, error: parsed.error, original: parsed.original });
      } else {
        if (parsed.type === "alias") {
          aliases.push(parsed);
        } else if (parsed.type === "field") {
          fields.push(parsed);
        } else if (parsed.type === "join") {
          joins.push(parsed);
        } else {
          errors.push({ line: index + 1, error: "Unknown type", original: line });
        }
      }
    });

    return { fields, aliases, joins, errors };
  },

  /**
   * Determines join relationships from parsed fields based on indentation.
   */
  determineJoins(fields) {
    const joinRelationships = [];
    const firstLevel0 = fields.find(f => f.indentation === 0);

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (i === 0) continue; // first field is the fact table itself

      let parent = null;
      if (field.indentation === 0) {
        parent = firstLevel0;
      } else {
        // find nearest upper (less-indented) field
        for (let j = i - 1; j >= 0; j--) {
          if (fields[j].indentation < field.indentation) {
            parent = fields[j];
            break;
          }
        }
      }
      if (parent) {
        joinRelationships.push({ leftTable: parent.table, rightTable: field.table });
      }
    }

    return joinRelationships;
  },

  joinEquals(j1, j2) {
    return (
      j1.leftTable === j2.leftTable &&
      j1.rightTable === j2.rightTable &&
      ((j1.bridgeTable || null) === (j2.bridgeTable || null))
    );
  },

  addJoin(finalJoins, join) {
    if (!finalJoins.some(existing => this.joinEquals(existing, join))) {
      finalJoins.push(join);
    }
  },

  findJoin(parsedInput, parsedDatabase, leftTable, rightTable) {
    // Look for a join in the user input first, then in "database"
    return (
      parsedInput.joins.find(j => j.leftTable === leftTable && j.rightTable === rightTable) ||
      parsedDatabase.joins.find(j => j.leftTable === leftTable && j.rightTable === rightTable)
    );
  },

  findAliasMapping(rightTable, aliases) {
    return aliases.find(mapping => mapping.alias === rightTable);
  },

  /**
   * Processes the parsed input and parsed database:
   *  - Derive joins from field indentation
   *  - Attempt to match them with explicit joins (either from user input or from the database property)
   */
  process(parsedInput, parsedDatabase) {
    const derivedJoins = this.determineJoins(parsedInput.fields);
    const finalJoins = [];
    const joinErrors = [];

    derivedJoins.forEach(dj => {
      const found = this.findJoin(parsedInput, parsedDatabase, dj.leftTable, dj.rightTable);
      if (found) {
        // If there's a bridge table, we must add that join first
        if (found.bridgeTable) {
          const bridgeJoin = this.findJoin(
            parsedInput,
            parsedDatabase,
            found.leftTable,
            found.bridgeTable
          );
          if (bridgeJoin) {
            this.addJoin(finalJoins, bridgeJoin);
          } else {
            joinErrors.push(
              "Bridge join from " + found.leftTable + " to " + found.bridgeTable + " not found."
            );
          }
        }
        this.addJoin(finalJoins, found);
      } else {
        joinErrors.push("Derived join " + JSON.stringify(dj) + " not found in explicit joins.");
      }
    });

    console.log("Final Joins from derived relationships:", finalJoins);
    if (joinErrors.length > 0) {
      console.error("Join Errors:", joinErrors);
    }

    return {
      fields: parsedInput.fields.concat(parsedDatabase.fields),
      aliases: parsedInput.aliases.concat(parsedDatabase.aliases),
      joins: finalJoins,
      errors: parsedInput.errors.concat(parsedDatabase.errors).concat(joinErrors)
    };
  },

  /**
   * Builds a SELECT statement from the processed object.
   */
  buildSelectStatement(processed) {
    // Build SELECT columns.
    const selectColumns = processed.fields.map(field => {
      if (field.alias) {
        return `${field.table}.${field.field} AS ${field.alias}`;
      } else {
        return `${field.table}.${field.field}`;
      }
    });

    // Determine fact table from the first field with indentation 0.
    let factTable = processed.fields.find(f => f.indentation === 0);
    factTable = factTable ? factTable.table : "UNKNOWN_TABLE";

    // Build JOIN clauses.
    const joinClauses = processed.joins.map(join => {
      // Check if there is an alias mapping for the join's rightTable.
      const mapping = this.findAliasMapping(join.rightTable, processed.aliases);
      if (mapping) {
        return `LEFT JOIN ${mapping.target} ${mapping.alias} ON (${join.expression})`;
      } else {
        return `LEFT JOIN ${join.rightTable} ON (${join.expression})`;
      }
    });

    const selectStmt = 
`SELECT
  ${selectColumns.join(",\n  ")}
FROM ${factTable}
${joinClauses.join("\n")}`;

    return selectStmt;
  },

  /**
   * The core transformation function called by the tool.
   * @param {string} text - The multiline user input.
   * @param {object} opts - The user-selected options (e.g., { compact: true, quote: false })
   */
  transformation(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    // Parse the user's input and the hardcoded "database" lines
    const parsedInput = this.parseInput(text);
    const parsedDatabase = this.parseInput(this.database.join("\n"));

    // Merge them using our process function
    const processed = this.process(parsedInput, parsedDatabase);
    const selectStatement = this.buildSelectStatement(processed);

    const outputText = selectStatement + "\n" + parsedInput.errors.join("\n") + "\n" + processed.errors;

    return outputText;
  }
};
