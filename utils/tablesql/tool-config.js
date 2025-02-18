window.toolConfig = {
  title: "Table to SQL VALUES Query",
  description: "Converts tab-separated text into SQL table. For instance, you can copy a table from Excel or SSMS and paste it here.",
  helpText: `
    <h3>Example:</h3>
    <p>Input:</p>
    <pre>JOBNUMBER   ENTRYNUMBER
10000-1     1
10000-1     2</pre>
    <p>Will be converted to:</p>
    <pre>SELECT *
FROM (VALUES
    ('10000-1', 1),
    ('10000-1', 2)
) AS _ (JOBNUMBER, ENTRYNUMBER)</pre>
  `,
  optionalControls: [
    {
      type: "switch",
      label: "Quote",
      property: "quote"
    } 
  ],
  transformation: function(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    const lines = text.trim().split("\n").filter(line => line.trim());
    if (lines.length < 2) return "Input must have at least a header and one row of data.";

    // Assume columns are tab-separated
    const headers = lines[0].split("\t");
    const rows = lines.slice(1).map(line => line.split("\t"));

    const indent = opts.compact ? "" : "    ";
    const newline = opts.compact ? "" : "\n";

    // Helper function to format a value.
    function formatValue(value) {
      const trimmed = value.trim();
      if (opts.quote) {
        return `'${trimmed}'`;
      } else {
        return (!isNaN(trimmed) && trimmed !== "") ? trimmed : `'${trimmed}'`;
      }
    }

    // Format each row as a parenthesized list of values.
    const formattedRows = rows.map(row => {
      const rowValues = headers.map((_, index) => {
        const cellValue = row[index] || "";
        return formatValue(cellValue);
      });
      return `(${rowValues.join(", ")})`;
    }).join(opts.compact ? ", " : `,${newline}${indent}`);

    // Join header names for the alias clause.
    const headerList = headers.join(opts.compact ? ", " : ", ");

    return `SELECT *${newline}FROM (VALUES${newline}${indent}${formattedRows}${newline}) AS _ (${headerList})`;
  }
};
