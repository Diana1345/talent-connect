/**
 * Extract text content from a CV file
 * Supports PDF and text-based files
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Handle plain text files
  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return await file.text();
  }

  // For PDF files, we'll extract text using a simple approach
  // Note: For production, consider using pdf.js or a server-side solution
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return await extractTextFromPdf(file);
  }

  // For Word documents, we'll try to extract basic text
  if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return await extractTextFromDocx(file);
  }

  // Fallback: try to read as text
  try {
    return await file.text();
  } catch {
    throw new Error(`Unable to extract text from file: ${file.name}`);
  }
}

async function extractTextFromPdf(file: File): Promise<string> {
  // Simple PDF text extraction
  // For better results, consider using pdf.js library
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Convert to string and look for text content
  let text = "";
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const rawText = decoder.decode(uint8Array);
  
  // Extract text between stream markers (simplified PDF parsing)
  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
  let match;
  while ((match = streamRegex.exec(rawText)) !== null) {
    // Look for readable text content
    const content = match[1];
    // Extract text that looks like actual content (alphanumeric)
    const textMatches = content.match(/\(([^)]+)\)/g);
    if (textMatches) {
      text += textMatches.map(m => m.slice(1, -1)).join(" ") + " ";
    }
  }

  // Also try to find direct text content
  const textContentRegex = /\/T\s*\(([^)]+)\)/g;
  while ((match = textContentRegex.exec(rawText)) !== null) {
    text += match[1] + " ";
  }

  // Clean up the text
  text = text
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length < 50) {
    // If we couldn't extract much, return a note
    return `[PDF file: ${file.name}] - Professional CV document uploaded. `;
  }

  return text;
}

async function extractTextFromDocx(file: File): Promise<string> {
  // Simple DOCX text extraction
  // DOCX is a ZIP file containing XML
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const rawContent = decoder.decode(uint8Array);
  
  // Look for text content in the XML
  const textRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
  let text = "";
  let match;
  
  while ((match = textRegex.exec(rawContent)) !== null) {
    text += match[1] + " ";
  }

  text = text.replace(/\s+/g, " ").trim();

  if (text.length < 50) {
    return `[DOCX file: ${file.name}] - Professional CV document uploaded. `;
  }

  return text;
}

/**
 * Fetch and extract text from a LinkedIn profile URL
 * Note: Due to LinkedIn's restrictions, this returns a placeholder
 * In production, you'd need LinkedIn API access or a scraping service
 */
export async function extractLinkedInProfile(url: string): Promise<string> {
  // Validate LinkedIn URL
  if (!url.includes("linkedin.com/in/")) {
    throw new Error("Please provide a valid LinkedIn profile URL");
  }

  // Extract username from URL
  const usernameMatch = url.match(/linkedin\.com\/in\/([^/?]+)/);
  const username = usernameMatch ? usernameMatch[1] : "professional";

  // In production, you would integrate with LinkedIn API or a scraping service
  // For now, return a formatted placeholder
  return `LinkedIn profile: ${username}. Professional profile from LinkedIn platform. `;
}
