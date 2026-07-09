const OpenAI = require('openai');

exports.extractCRMRecords = async (records) => {
  const cerebras = new OpenAI({
    baseURL: 'https://api.cerebras.ai/v1',
    apiKey: process.env.CEREBRAS_API_KEY, 
  });

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
      const response = await cerebras.chat.completions.create({
        model: 'gemma-4-31b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(chunk) }
        ],
        response_format: { type: "json_object" }
      });

      let responseText = response.choices[0].message.content.trim();

      console.log("=========================================");
      console.log(`[AI Response for chunk ${i / CHUNK_SIZE + 1}]:`);
      console.log(responseText);
      console.log("=========================================\n");

      // Robustly extract the JSON array from the response
      const arrayMatch = responseText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        responseText = arrayMatch[0];
      } else if (responseText.startsWith("{")) {
        // Sometimes JSON mode returns an object with the array inside
        const obj = JSON.parse(responseText);
        const keys = Object.keys(obj);
        if (keys.length === 1 && Array.isArray(obj[keys[0]])) {
           responseText = JSON.stringify(obj[keys[0]]);
        } else {
           throw new Error("AI response did not contain a valid JSON array.");
        }
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
