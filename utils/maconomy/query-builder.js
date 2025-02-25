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

  // Determine the fact table from the first field in the list.
  const factTable = processed.fields[0].table;
  
  // Build JOIN clauses.
  const joins = processed.joins.map(join => {
    // Check if there is an alias mapping for the join's right table.
    const mapping = findAliasMapping(join.rightTable, processed.aliases);
    if (mapping) {
      return `LEFT JOIN ${mapping.target} ${mapping.alias} ON (${join.expression})`;
    } else {
      return `LEFT JOIN ${join.rightTable} ON (${join.expression})`;
    }
  });

  const restrictions = processed.restrictions.filter(f => f.type === "restriction").map(r => {
    if (r.containsOr) {
      return `(${r.expression})`;
    } else {
      return `${r.expression}`;
    }
  });

  const joinClause = joins.length > 0 ? "\n"+joins.join("\n") : "";
  const whereClause = restrictions.length > 0 ? `\nWHERE ${restrictions.join("\nAND ")}` : "";

  const selectStmt =
`SELECT
  ${selectColumns.join(",\n  ")}
FROM ${factTable}${joinClause}${whereClause}`;

  return selectStmt;
}
