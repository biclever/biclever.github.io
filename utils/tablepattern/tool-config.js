window.toolConfig = {
  title: "Apply pattern to table",
  description: "Apply a pattern to a tab-table. Number of placeholders % in the pattern must match the number of columns in the table.",
  helpText: `
    <h3>Example:</h3>
    <p>Pattern:</p>
    <pre>INSERT INTO TEMPTABLE VALUES('%','%');</pre>
    <p>Input:</p>
    <pre>10000-1     1
10000-1     2</pre>
    <p>Will be converted to:</p>
    <pre>INSERT INTO TEMPTABLE VALUES('10000-1','1');
INSERT INTO TEMPTABLE VALUES('10000-1','2');</pre>
  `,
  optionalControls: [
    {
      type: "text",
      label: "Pattern",
      property: "pattern"
    },
    {
      type: "switch",
      label: "Tab separator (otherwise any whitespace)",
      property: "separator"
    }
  ],
  transformation: function(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    const lines = text.trim().split("\n").filter(line => line.trim());
    if (lines.length === 0) return "Input must have at least one row of data.";

    const pattern = opts.pattern || "";
    // Count the number of '%' placeholders in the pattern.
    const placeholderCount = (pattern.match(/%/g) || []).length;
    if (placeholderCount === 0) {
      return "Error: No placeholders (%) found in the pattern.";
    }

    const outputLines = lines.map(line => {
      // Use tab separator if switch is enabled, otherwise split by one or more whitespace characters.
      const row = opts.separator ? line.split("\t") : line.trim().split(/\s+/);
      if (row.length !== placeholderCount) {
        return "Error: The number of placeholders (%) in the pattern must match the number of columns in each row.";
      }
      let lineResult = pattern;
      // Replace each placeholder with the corresponding cell value.
      row.forEach(cell => {
        lineResult = lineResult.replace('%', cell.trim());
      });
      return lineResult;
    });

    return outputLines.join("\n");
  }
};
