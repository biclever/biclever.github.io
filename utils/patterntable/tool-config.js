export const toolConfig = {
  title: "Extract Pattern to a Table",
  description: "Define a custom pattern using placeholders (%) to extract specific data segments and automatically format them into a table.",
  helpText: `
  <h2>Usage</h2>
  <p>
    Enter a pattern that includes one or more <code>%</code> placeholders, then paste your target text.<br>
    The tool will scan the text for segments matching your pattern and output the results as a tab-separated table.
  </p>
  <h2>Parameters</h2>
  <ul>
    <li>
      <strong>Identifiers:</strong> 
      By default, the placeholder <code>%</code> matches any sequence of characters (except line terminators).
      Select Identifiers mode to match valid identifier names only (<code>([a-zA-Z_][a-zA-Z0-9_]*)</code>).
    </li>
    <li>
      <strong>Whitespace:</strong> 
      By default, a space character matches exactly one space. If Whitespace mode is selected, a space character matches any sequence of whitespace characters.
    </li>
    <li>
      <strong>Boundaries:</strong>
      When selected, literal parts are wrapped in word boundaries (<code>\b</code>).
    </li>
  </ul>
  <h2>Example</h2>
  <p><strong>Extracting Used Fields</strong></p>
  <p><strong>Pattern:</strong></p>
  <pre>JOBHEADER.%</pre>
  <p><strong>Input:</strong></p>
  <pre>SELECT JOBHEADER.JOBNAME\nFROM JOBHEADER\nWHERE JOBHEADER.JOBNUMBER = '1000012-1';</pre>
  <p><strong>Output:</strong></p>
  <pre>JOBHEADER.JOBNAME\nJOBHEADER.JOBNUMBER</pre>  
  `.replace(/\\t/g, "\t").replace(/\\n/g, "\n"),
  optionalControls: [
    {
      type: "text",
      label: "Pattern",
      property: "pattern"
    },
    {
      type: "checkbox",
      label: "Identifiers",
      property: "identifiers"
    },
    {
      type: "checkbox",
      label: "Whitespace",
      property: "whitespace"
    },
    {
      type: "checkbox",
      label: "Boundaries",
      property: "boundaries"
    }
  ],
  transformation: function(text, opts) {
    // Validate input text
    if (!text.trim()) return "Please provide valid input.";

    // Use the full text (could be multiline)
    // Count placeholders in the pattern
    const userPattern = opts.pattern || "";
    const placeholderCount = (userPattern.match(/%/g) || []).length;
    if (placeholderCount === 0) {
      return "Error: No placeholders (%) found in the pattern.";
    }

    // Function to escape regex special characters in literal parts
    function escapeRegex(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // Split the user pattern on '%' and process each literal segment
    let parts = userPattern.split('%').map(part => {
      let escaped = escapeRegex(part);
      // If whitespace option is enabled, replace literal spaces with \s+
      if (opts.whitespace) {
        escaped = escaped.replace(/ +/g, '\\s+');
      }
      return escaped;
    });

    // Add boundaries to literal parts if the boundaries option is selected.
    if (opts.boundaries) {
      parts = parts.map(part => {
        return part ? `\\b${part}\\b` : part;
      });
    } 

    // Define the capturing group for '%' based on the Identifiers option.
    // In Identifiers mode, match valid identifier names (starting with a letter or underscore).
    // Otherwise, match any sequence of characters (greedily).
    let captureGroup = opts.identifiers
      ? "([a-zA-Z_][a-zA-Z0-9_]*)"
      : "(.+)";
      
    // Build the full regex string by joining the literal parts with the capturing group.
    let regexString = parts.join(captureGroup);
    // Create a regex object with the global flag
    let regex;
    try {
      regex = new RegExp(regexString, 'g');
    } catch (err) {
      return "Error: Invalid pattern resulting in a bad regex.";
    }

    // Find all matches in the input text
    const matches = Array.from(text.matchAll(regex));
    if (matches.length === 0) return "No matches found.";

    // Build a tab-separated table from the matches.
    const rows = matches.map(match => {
      if (placeholderCount === 1) {
        return match[0];
      } else {
        // match[0] is the full match; subsequent entries are the capture groups.
        return match.slice(1).join("\t");
      }
    });

    return rows.join("\n");
  }
};
