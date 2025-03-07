export const toolConfig = {
  title: "Apply pattern to table",
  description: "Use a pattern with placeholders (%) to generate lines of output.",
  helpText: `
  <p>
    Enter a pattern containing one or more <code>%</code> placeholders, then paste a tab-separated table.
    Each row in the table will be applied to the pattern, replacing each <code>%</code> with the corresponding column value.
  </p>
  <p> 
    There are two possible scenarios for placeholder replacement: If the table has multiple columns, the number of <code>%</code> placeholders in the pattern must match the number of columns. 
    If the table has only one column, all <code>%</code> placeholders will be replaced with the same value from that column. 
  </p>
  <h2>Example</h2>
  
  <h5>Creating insert statements</h5>
  Here the number of placeholders in the pattern matches the number of columns in the input table.
  <p><strong>Pattern:</strong></p>
  <pre>INSERT INTO TEMP VALUES('%','%');</pre>

  <p><strong>Input:</strong></p>
  <pre>1000012-1\t1\n1000012-1\t2</pre>

  <p><strong>Output:</strong></p>
  <pre>INSERT INTO TEMP VALUES('1000012-1','1');\nINSERT INTO TEMP VALUES('1000012-1','2');</pre>

  <h5>Creating functions based on template</h5>
  Here the pattern has multiple placeholders, but the input table has only one column. Each placeholder is replaced with the same value.
  <p><strong>Pattern:</strong></p>
  <pre>public static final MiText get%Title() {\n  return tf.term("%Title");\n}\n</pre>

  <p><strong>Input:</strong></p>
  <pre>JobNumber\nEmployeeNumber\nNumberRegistered</pre>

  <p><strong>Output:</strong></p>
  <pre>public static final MiText getJobNumberTitle() {
  return tf.term("JobNumberTitle");
}

public static final MiText getEmployeeNumberTitle() {
  return tf.term("EmployeeNumberTitle");
}

public static final MiText getNumberRegisteredTitle() {
  return tf.term("NumberRegisteredTitle");
}</pre>`,
  optionalControls: [
    {
      type: "textarea",
      label: "Pattern",
      property: "pattern"
    }
  ],
  transformation: function(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    const lines = text.trim().split("\n").filter(line => line.trim());
    if (lines.length === 0) return "Input must have at least one row of data.";

    const pattern = opts.pattern || "";
    // Count the number of '%' placeholders in the pattern
    const placeholderCount = (pattern.match(/%/g) || []).length;
    if (placeholderCount === 0) {
      return "Error: No placeholders (%) found in the pattern.";
    }

    // Parse all lines into arrays of cells
    const parsedLines = lines.map(line => line.split("\t"));

    const colCount = parsedLines[0].length;
    const allSameNumber = parsedLines.every(row => row.length === colCount);
    if (!allSameNumber) {
      return "Error: All rows must have the same number of columns.";
    }

    if (colCount === 0) {
      return "Error: Input must have at least one column.";
    }

    if (placeholderCount !== colCount && colCount !== 1) {
      return "Error: The number of placeholders (%) in the pattern must match the number of columns in each row.";
    }

    // Check if all lines have a single column    
    const allSingleColumn = parsedLines.every(row => row.length === 1);

    // If all lines have one column but the pattern has multiple placeholders,
    // we replicate that single value for each placeholder.
    // Otherwise, we do the usual matching columns to placeholders.

    // If there's at least one line with a different number of columns,
    // we handle them individually.

    let outputLines = [];

    if (allSingleColumn && placeholderCount > 1) {
      // In this scenario, each row has only one cell, but the pattern has multiple %.
      // We replicate the single cell for each placeholder.

      outputLines = parsedLines.map(row => {
        let lineResult = pattern;
        for (let i = 0; i < placeholderCount; i++) {
          lineResult = lineResult.replace("%", row[0]);
        }        
        return lineResult;
      });
    } else {
      // The usual approach, each row must match placeholderCount
      outputLines = parsedLines.map(row => {
        let lineResult = pattern;
        row.forEach(cell => {
          lineResult = lineResult.replace("%", cell);
        });        
        return lineResult;
      });
    }

    return outputLines.join("\n");
  }
};
