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
  title: "SQL Filter Tool",
  description: "Converts column-separated text into SQL restrictions.",
  helpText: `
    <p>Enter text in the input field and click "Convert" or press <strong>Ctrl+Enter</strong>.</p>
    <p>Click "Copy" or press <strong>Ctrl+Shift+C</strong> to copy output to clipboard.</p>
    <h3>Example 1:</h3>
    <pre>JOBNUMBER
10000-1
10000-2</pre>
    <p>Will be converted to:</p>
    <pre>JOBNUMBER IN ('10000-1', '10000-2')</pre>
    <h3>Example 2:</h3>
    <pre>JOBNUMBER   ENTRYNUMBER
10000-1     1
10000-1     2</pre>
    <p>Will be converted to:</p>
    <pre>JOBNUMBER='10000-1' AND ENTRYNUMBER=1 OR JOBNUMBER='10000-1' AND ENTRYNUMBER=2</pre>
	<hr>
    <p><strong>Parameters:</strong></p>
    <ul>
      <li><strong>Single line</strong>: When enabled, the whole condition will be on a single line. When disabled, each value is placed on a new line.</li>
      <li><strong>Quote</strong>: When disabled, numeric values are not quoted. When enabled, all values are wrapped in quotes regardless of whether they are numeric.</li>
    </ul>
  `,
  optionalControls: [
    {
      type: "switch",
      label: "Single line",
      property: "compact"
    },
    {
      type: "switch",
      label: "Quote",
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
    const isNumberColumn = headers.map((_, colIndex) =>
      rows.every(row => !isNaN(row[colIndex]))
    );
    const nl0 = opts.compact ? "" : "\n  ";
    const nl = opts.compact ? "" : "\n";
    
    if (headers.length === 1) {
      const columnName = headers[0];
      const values = rows.map(row => {
        if (opts.quote) {
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
          if (opts.quote) {
            return `${header}='${value}'`;
          } else {
            return isNumberColumn[index]
              ? `${header}=${value}`
              : `${header}='${value}'`;
          }
        }).join(" AND ");
      });
      // Use a single line separator if compact is enabled, otherwise join with newlines.
      const separator = opts.compact ? " OR " : "\nOR ";
      return conditions.join(separator);
    }
  }
};
