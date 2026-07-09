const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

exports.extractCRMRecords = async (records) => {
  const CHUNK_SIZE = 50;
  const allExtracted = [];

  const systemPrompt = `You are a CRM data extraction assistant. Your task is to accurately map arbitrary CSV data into a strict JSON array of CRM records.

STRICT INSTRUCTIONS:
1. Return ONLY a valid JSON array of objects. Do not include markdown code blocks like \`\`\`json. The output must start with [ and end with ].
2. Allowed CRM Status Values (exact string, leave blank if unknown): GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE.
3. Allowed Data Source Values (exact string, leave blank if unknown): leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots.
4. Date Format: 'created_at' MUST be a valid ISO string.
5. Combine multiple emails into 'crm_note',keep the first email in 'email'.
6. Combine multiple mobile numbers into 'crm_note', keep the first in 'mobile_without_country_code'.
7. Append any extra useful information to 'crm_note'.
8. The result MUST have exactly the same number of rows as the input.


Fields to populate:
- created_at: ISO format date string
- name
- email
- country_code: would be a numdered code starting with '+' sign.
- mobile_without_country_code
- company
- city
- state
- country
- lead_owner
- crm_status
- crm_note
- data_source
- possession_time
- description
`;

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        systemInstruction: systemPrompt,
        generationConfig: { responseMimeType: "application/json" }
      });

      const response = await model.generateContent(JSON.stringify(chunk));
      let responseText = response.response.text().trim();

      console.log("=========================================");
      console.log(`[AI Response for chunk ${i / CHUNK_SIZE + 1}]:`);
      console.log(responseText);
      console.log("=========================================\n");

      // Robustly extract the JSON array from the response in case the LLM includes conversational text
      const arrayMatch = responseText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        responseText = arrayMatch[0];
      } else {
        throw new Error("AI response did not contain a valid JSON array.");
      }

      let parsedChunk;
      try {
        parsedChunk = JSON.parse(responseText);
      } catch (e) {
        console.error("JSON Parsing failed on:", responseText);
        throw new Error("Failed to parse AI output as JSON.");
      }

      if (Array.isArray(parsedChunk)) {
        allExtracted.push(...parsedChunk);
      } else {
        console.error("AI returned non-array JSON", parsedChunk);
        throw new Error("AI returned a non-array JSON structure.");
      }

    } catch (error) {
      console.error("Error processing chunk with AI:", error);
      throw error;
    }
  }

  return allExtracted;
};
