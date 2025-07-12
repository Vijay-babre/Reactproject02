export function formatMarkdown(text: string): string {
  // Convert **text** to <strong>text</strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *text* to <em>text</em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert `code` to <code>code</code>
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Convert line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}