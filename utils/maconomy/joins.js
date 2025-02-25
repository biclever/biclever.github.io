// joins.js

/**
 * Determines join relationships from parsed fields based on indentation.
 * @param {Array} fields - Array of field objects with indentation information.
 * @returns {Array} Array of join relationship objects.
 */
export function deriveExplicitJoins(fields) {
  const joinRelationships = [];
  const firstLevel0 = fields[0];

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (i === 0) continue; // Skip the fact table itself

    let parent = null;
    if (field.indentation === 0) {
      parent = firstLevel0;
    } else {
      // Find nearest upper (less-indented) field
      for (let j = i - 1; j >= 0; j--) {
        if (fields[j].indentation < field.indentation) {
          parent = fields[j];
          break;
        }
      }
      if (!parent) {
        parent = firstLevel0;
      }
    }
    if (parent) {
      joinRelationships.push({ leftTable: parent.table, rightTable: field.table });
    }
  }



  return joinRelationships;
}

/**
 * Checks if two join objects are equal.
 * @param {object} j1 - First join object.
 * @param {object} j2 - Second join object.
 * @returns {boolean} True if joins are equal; otherwise false.
 */
export function joinEquals(j1, j2) {
  return (
    j1.leftTable.toLowerCase() === j2.leftTable.toLowerCase() &&
    j1.rightTable.toLowerCase() === j2.rightTable.toLowerCase() &&
    ((j1.bridgeTable?.toLowerCase() || null) === (j2.bridgeTable?.toLowerCase() || null))
  );
}

/**
 * Adds a join to the final joins array if it doesn't already exist.
 * @param {Array} finalJoins - Array of join objects.
 * @param {object} join - The join object to add.
 */
export function addJoin(finalJoins, join) {
  if (!finalJoins.some(existing => joinEquals(existing, join))) {
    finalJoins.push(join);
  }
}

/**
 * Searches for a join between two tables from user input or a database definition.
 * @param {object} parsedInput - Parsed joins from the user input.
 * @param {object} parsedDatabase - Parsed joins from the database configuration.
 * @param {string} leftTable - The left table name.
 * @param {string} rightTable - The right table name.
 * @returns {object|undefined} The matching join object if found.
 */
export function findJoin(parsedInput, parsedDatabase, leftTable, rightTable) {
  const lowerLeft = leftTable.toLowerCase();
  const lowerRight = rightTable.toLowerCase();

  return (
    parsedInput.joins.find(j => 
      j.leftTable.toLowerCase() === lowerLeft && j.rightTable.toLowerCase() === lowerRight
    ) ||
    parsedDatabase.joins.find(j => 
      j.leftTable.toLowerCase() === lowerLeft && j.rightTable.toLowerCase() === lowerRight
    )
  );
}


/**
 * Finds an alias mapping for a given right table.
 * @param {string} rightTable - The right table name.
 * @param {Array} aliases - Array of alias mapping objects.
 * @returns {object|undefined} The alias mapping if found.
 */
export function findAliasMapping(rightTable, aliases) {
  const lowerRightTable = rightTable.toLowerCase();

  return aliases.find(mapping => mapping.alias.toLowerCase() === lowerRightTable);
}

