window.toolConfig = {
  title: "Prompt Expression Generator",
  description: "Creates an expression that conditionally displays prompt values. Date prompts are formatted as dates, while other prompts are displayed as-is.",
  helpText: `
    <p>Enter text in the input field and click "Convert" or press <strong>Ctrl+Enter</strong>.</p>
    <p>Click "Copy" or press <strong>Ctrl+Shift+C</strong> to copy output to clipboard.</p>
<hr/>
    <p>Enter your prompt labels (one per line) in the input field.</p>
    <p>For each prompt:</p>
    <p>If the label appears to be a date prompt (e.g. contains "date", "dato", "datum"), a date line is generated:</li>
    <pre>
If IsPromptAnswered("From date:") Then ", From date: " + FormatDate(ToDate(UserResponse("From date:");"INPUT_DATE_TIME");"INPUT_DATE")
    </pre>
    <p>Otherwise, an employee (or general) line is generated:</p>
    <pre>
If IsPromptAnswered("Employee No:") Then ", Employee No: " + UserResponse("Employee No:")
    </pre>
    <p>(The final expression is wrapped in a Substr function so that the leading comma is removed.)</p>
  `,
  // No optional controls in this example—but you could add them if needed.
  // The transformation function accepts the raw text (each line is a prompt label).
  transformation: function(text, opts) {
    if (!text.trim()) return "Please provide valid input.";

    // Split input by newlines and remove blank lines
    const prompts = text.trim().split("\n").map(line => line.trim()).filter(line => line !== "");

    // Helper: determine if a prompt label "sounds like a date"
    function isDatePrompt(label) {
      // Keywords for dates in English, Norwegian, Swedish, Danish, or German.
      const keywords = ["date", "dato", "datum"];
      // Check if any keyword appears in the label (case-insensitive)
      return keywords.some(keyword => label.toLowerCase().includes(keyword));
    }

    // Build each line of the expression.
    // Note: Each line will update 3 places: the prompt in IsPromptAnswered,
    // in the literal text, and in the UserResponse.
    let exprLines = prompts.map(label => {
      if (isDatePrompt(label)) {
        // Date prompt: use FormatDate/ToDate logic.
        return `+(If IsPromptAnswered("${label}") Then ", ${label} " + FormatDate(ToDate(UserResponse("${label}");"INPUT_DATE_TIME");"INPUT_DATE"))`;
      } else {
        // Non-date prompt: use UserResponse only.
        return `+(If IsPromptAnswered("${label}") Then ", ${label} " + UserResponse("${label}"))`;
      }
    });

    // Join the generated lines together.
    const body = exprLines.join("\n");

    // Wrap the whole expression in a Substr to remove the leading comma.
    // The Substr starts at character 2 and returns up to 1000 characters.
    return `=Substr(\n${body}\n;2;1000)`;
  }
};
