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

import { parseInput } from './parser.js';
import { determineJoins, addJoin, findJoin } from './joins.js';
import { buildSelectStatement } from './querybuilder.js';
import { myDatabase } from "./database.js";

export const toolConfig = {
  title: "Maconomy Query Builder",
  description: "Joins specified tables.",
  helpText: `
    <p>
      Enter the tables and fields you want to select, and the tool will generate a SQL query with the necessary joins.
    </p>
    <h2>Parameters:</h2>
    <ul>
      <li><strong>Single line</strong>: When enabled, the whole condition will be on a single line. When disabled, each value is placed on a new line.</li>
      <li><strong>Quote</strong>: When disabled, numeric values are not quoted. When enabled, all values are wrapped in quotes regardless of whether they are numeric.</li>
    </ul>
    <h5>Example 1:</h5>
    <p>Input:</p>
    <pre>FinanceEntry
Account.AccountText</pre>
    <p>Will be converted to:</p>
    <pre>SELECT
  FinanceEntry.*,
  Account.AccountText
FROM FinanceEntry
LEFT JOIN Account ON (FinanceEntry.AccountNumber = Account.AccountNumber)</pre>
    <h5>Example 2:</h5>
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
    
    <h2>Shortcuts</h2>
<ul>
  <li>
    <strong>Ctrl+Enter:</strong>
    Convert the text.
  </li>
  <li>
    <strong>Ctrl+Shift+C:</strong>
    Copy to clipboard.
  </li>
</ul>`  ,
  optionalControls: [
    {
      type: "checkbox",
      label: "Compact",
      property: "compact"
    },
    {
      type: "checkbox",
      label: "Maconomy terms",
      property: "maconomy"
    }
  ],

  transformation(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    // Parse user input and database definitions.
    const parsedInput = parseInput(text);
    const parsedDatabase = parseInput(myDatabase.join("\n"));

    if (parsedInput.errors.length > 0) {
      return parsedInput.errors.map(e => `Error on line ${e.line}: ${e.error}`).join("\n");
    }     

    // Merge joins from derived relationships and explicit definitions.
    const derivedJoins = determineJoins(parsedInput.fields);
    const finalJoins = [];
    const joinErrors = [];

    derivedJoins.forEach(dj => {
      const found = findJoin(parsedInput, parsedDatabase, dj.leftTable, dj.rightTable);
      if (found) {
        if (found.bridgeTable) {
          const bridgeJoin = findJoin(parsedInput, parsedDatabase, found.leftTable, found.bridgeTable);
          if (bridgeJoin) {
            addJoin(finalJoins, bridgeJoin);
          } else {
            joinErrors.push(`Bridge join from ${found.leftTable} to ${found.bridgeTable} not found.`);
          }
        }
        addJoin(finalJoins, found);
      } else {
        joinErrors.push(`Derived join ${JSON.stringify(dj)} not found in explicit joins.`);
      }
    });

    const processed = {
      fields: parsedInput.fields.concat(parsedDatabase.fields),
      aliases: parsedInput.aliases.concat(parsedDatabase.aliases),
      joins: finalJoins,
      errors: parsedInput.errors.concat(parsedDatabase.errors).concat(joinErrors)
    };

    const selectStatement = buildSelectStatement(processed);
    return selectStatement + "\n" + processed.errors.join("\n");
  }
};
