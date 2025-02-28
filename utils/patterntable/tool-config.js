export const toolConfig = {
  title: "Extract Pattern to a Table",
  description: "Define a custom pattern using placeholders (%) to extract specific data segments and automatically format them into a tab-separated table.",
  helpText: `
  <p>
  Provide a custom extraction pattern that includes one or more <code>%</code> placeholders, then paste the text you want to search. The tool will identify segments that match your pattern and output the results as a neatly formatted, tab-separated table.
</p>

<h2>Parameters</h2>
<ul>
  <li>
    <strong>Identifiers:</strong> 
    When enabled, each <code>%</code> placeholder will match only valid identifiers (such as variable or column names) composed of letters, numbers, and underscores.
  </li>
  <li>
    <strong>Whitespace:</strong> 
    When this option is active, literal spaces in your pattern will match any sequence of whitespace characters (spaces, tabs, newlines) using <code>\s+</code>, making your pattern more flexible.
  </li>
  <li>
    <strong>Regex:</strong>
    Enable this option to treat your pattern as a full regular expression. In this mode, you can use custom capture groups to precisely control the extraction process.
  </li>
</ul>

  <h2>Example</h2>
  <h5>Extracting Used Fields</h5>
  <p><strong>Pattern:</strong></p>
  <pre>JOBHEADER.%</pre>
  <p><strong>Input:</strong></p>
  <pre>SELECT JOBHEADER.JOBNAME\nFROM JOBHEADER\nWHERE JOBHEADER.JOBNUMBER = '1000012-1';</pre>
  <p><strong>Output:</strong></p>
  <pre>JOBHEADER.JOBNAME\nJOBHEADER.JOBNUMBER</pre>  

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
  </ul>
  `,
  optionalControls: [
    {
      type: "textarea",
      label: "Pattern",
      property: "pattern"
    },
    {
      type: "checkbox",
      label: "Identifiers",
      property: "identifiers",
      default: false
    },
    {
      type: "checkbox",
      label: "Whitespace",
      property: "whitespace",
      default: false
    },
    {
      type: "checkbox",
      label: "Regex",
      property: "regex",
      default: false
    }
  ],
  transformation: function(text, opts) {
    // Validate input text.
    if (!text.trim()) return "Please provide valid input.";

    if (opts.regex) {
      // Use the full text (could be multiline)
      const userPattern = opts.pattern || "";
      let regex;
      try {
        regex = new RegExp(userPattern, 'g');
      } catch (err) {
        return "Error: Invalid pattern resulting in a bad regex.";
      }
      
      // Find all matches in the input text.
      const matches = Array.from(text.matchAll(regex));
      if (matches.length === 0) return "No matches found.";

      // Build a tab-separated table from the matches.
      const rows = matches.map(match => match.slice(1).join("\t"));
      return rows.join("\n");
    }

    // Use the full text (could be multiline)
    const userPattern = opts.pattern || "";
    const placeholderCount = (userPattern.match(/%/g) || []).length;
    if (placeholderCount === 0) {
      return "Error: No placeholders (%) found in the pattern.";
    }

    // Function to escape regex special characters in literal parts.
    function escapeRegex(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // Split the user pattern on '%' into original parts and create escaped versions.
    let originalParts = userPattern.split('%');
    let escapedParts = originalParts.map(part => {
      let escaped = escapeRegex(part);
      if (opts.whitespace) {
        escaped = escaped.replace(/ +/g, '\\s+');
      }
      return escaped;
    });

    // Build the full regex string by iterating through the parts and inserting appropriate capture groups.
    let regexString = escapedParts[0];
    for (let i = 0; i < placeholderCount; i++) {
      let left = originalParts[i];
      let right = originalParts[i + 1];
      let captureGroupForPlaceholder;

      if (opts.identifiers) {
        captureGroupForPlaceholder = "([a-zA-Z_][a-zA-Z0-9_]*)"
      }
      // If the left literal ends with a single quote and the right begins with one, capture everything except a single quote.
      else if (left.endsWith("'") && right.startsWith("'")) {
        captureGroupForPlaceholder = "([^']+)";
      }
      // Similarly for double quotes.
      else if (left.endsWith('"') && right.startsWith('"')) {
        captureGroupForPlaceholder = '([^"]+)';
      }
      // If left ends with an opening parenthesis and right begins with a closing parenthesis.
      else if (left.endsWith("(") && right.startsWith(")")) {
        captureGroupForPlaceholder = "([^)]+)";
      }
      // If left ends with an opening parenthesis and right begins with a closing parenthesis.
      else if (left.endsWith("[") && right.startsWith("]")) {
        captureGroupForPlaceholder = "([^]]+)";
      }
      // If left ends with an opening parenthesis and right begins with a closing parenthesis.
      else if (left.endsWith("{") && right.startsWith("}")) {
        captureGroupForPlaceholder = "([^}]+)";
      }
      // Default capture group based on Identifiers option.
      else {
        captureGroupForPlaceholder = "(.+?)";
      }
      regexString += captureGroupForPlaceholder + escapedParts[i + 1];
    }

    // If the pattern starts with a placeholder, anchor to the beginning.
    if (originalParts[0] === "") {
      regexString = "^" + regexString;
    }
    // If the pattern ends with a placeholder, anchor to the end.
    if (originalParts[originalParts.length - 1] === "") {
      regexString = regexString + "$";
    }

    // Create a regex object with the global flag.
    let regex;
    try {
      regex = new RegExp(regexString, 'g');
    } catch (err) {
      return "Error: Invalid pattern resulting in a bad regex.";
    }
 
    console.log("Generated Pattern:", regexString);
    
    // Find all matches in the input text.
    const matches = Array.from(text.matchAll(regex));
    if (matches.length === 0) return "No matches found.";

    // Build a tab-separated table from the matches.
    const rows = matches.map(match => match.slice(1).join("\t"));
    return rows.join("\n");
  }
};
