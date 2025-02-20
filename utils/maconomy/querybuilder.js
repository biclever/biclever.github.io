// queryBuilder.js
import { findAliasMapping } from './joins.js';

/**
 * Builds a SQL SELECT statement from the processed object.
 * @param {object} processed - The object containing fields, aliases, and joins.
 * @returns {string} The SQL SELECT statement.
 */
export function buildSelectStatement(processed) {
  // Build SELECT columns.
  const selectColumns = processed.fields.map(field => {
    if (field.alias) {
      return `${field.table}.${field.field} AS ${field.alias}`;
    } else {
      return `${field.table}.${field.field}`;
    }
  });

  // Determine the fact table from the first field with indentation 0.
  const factField = processed.fields.find(f => f.indentation === 0);
  const factTable = factField ? factField.table : "UNKNOWN_TABLE";

  // Build JOIN clauses.
  const joinClauses = processed.joins.map(join => {
    // Check if there is an alias mapping for the join's right table.
    const mapping = findAliasMapping(join.rightTable, processed.aliases);
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
}
