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
 
window.toolConfig = {
  title: "Table to SQL WHERE Clause",
  description: "Converts tab-separated text into SQL restrictions.",
  helpText: `
  <h2>Usage</h2>
<p>
  Use this tool to convert tab-separated data (e.g., from Excel or SQL query results) into SQL WHERE clauses.
  The first row should contain column names, and subsequent rows should contain values.
  If you have only one column, the tool will produce an <code>IN()</code> expression.
  If you have multiple columns, it will generate <code>AND</code>/<code>OR</code> expressions for each row.
</p>

<h2>Parameters</h2>
<ul>
  <li>
    <strong>Multiple lines / Single line:</strong>
    Choose “Single line” for a more compact WHERE clause or “Multiple lines” for a more readable, line-separated format.
  </li>
  <li>
    <strong>Determine type / Quote all values:</strong>
    Select “Determine type” to keep numeric values unquoted, or choose “Quote all values” to enclose every value in quotes.
  </li>
</ul>

<h2>Examples</h2>
<p><strong>Single-Column Example</strong></p>
<p>This shows how a single-column table is converted into an <code>IN()</code> expression.</p>
<p><strong>Input:</strong></p>
<pre>JOBNUMBER\n1000012-1\n1000012-2</pre>
<p><strong>Output:</strong></p>
<pre>JOBNUMBER IN ('10000-1', '10000-2')</pre>

<p><strong>Multi-Column Example</strong></p>
<p>This shows how multiple columns generate <code>AND</code>/<code>OR</code> expressions for each row.</p>
<p><strong>Input:</strong></p>
<pre>JOBNUMBER\tENTRYNUMBER\n1000012-1\t1\n1000012-1\t2</pre>
<p><strong>Output:</strong></p>
<pre>JOBNUMBER='10000-1' AND ENTRYNUMBER=1 OR JOBNUMBER='10000-1' AND ENTRYNUMBER=2</pre>
  `.replace(/\\t/g, "\t").replace(/\\n/g, "\n"),
  optionalControls: [
    {
      type: "radio",
      label: "Multiple lines|Single line",
      property: "compact"
    },
    {
      type: "radio",
      label: "Determine type|Quote all values",
      property: "quote"
    }
  ],
  // The transformation function now accepts an options object (opts)
  transformation: function(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    const lines = text.trim().split("\n").filter(line => line.trim());
    if (lines.length < 2) return "Input must have at least a header and one row of data.";

    const headers = lines[0].split("\t");
    const rows = lines.slice(1).map(line => line.split("\t"));
    const allSameNumber = rows.every(row => row.length === headers.length);
    if (!allSameNumber) {
      return "Error: All rows must have the same number of columns.";
    }
    const isNumberColumn = headers.map((_, colIndex) =>
      rows.every(row => !isNaN(row[colIndex]))
    );
    const nl0 = opts.compact === 'Single line' ? "" : "\n  ";
    const nl = opts.compact === 'Single line' ? "" : "\n";
    
    if (headers.length === 1) {
      const columnName = headers[0];
      const values = rows.map(row => {
        if (opts.quote === 'Quote all values') {
          return `'${row[0]}'`;
        } else {
          return isNumberColumn[0] ? row[0] : `'${row[0]}'`;
        }
      });
      return `${columnName} IN (${nl0 + values.join(nl + ", ") + nl})`;
    } else {
      const conditions = rows.map(row => {
        return headers.map((header, index) => {
          const value = row[index] || "";
          if (opts.quote === 'Quote all values') {
            return `${header}='${value}'`;
          } else {
            return isNumberColumn[index]
              ? `${header}=${value}`
              : `${header}='${value}'`;
          }
        }).join(" AND ");
      });
      // Use a single line separator if compact is enabled, otherwise join with newlines.
      const separator = opts.compact === 'Single line' ? " OR " : "\nOR ";
      return conditions.join(separator);
    }
  }
};
