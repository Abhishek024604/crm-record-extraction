const csv = require('csv-parser');
const { Readable } = require('stream');
const aiService = require('../services/aiService');

exports.uploadAndProcessCSV = async (req, res) => {
  console.log("HELLO FROM UPLOAD CONTROLLER");
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const stream = Readable.from(req.file.buffer.toString('utf-8'));

  stream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const extractedRecords = await aiService.extractCRMRecords(results);
        
        let successful = 0;
        let skipped = 0;
        const processedRecords = [];

        extractedRecords.forEach(record => {
           if (!record.email && !record.mobile_without_country_code) {
               skipped++;
               processedRecords.push({ ...record, __status: 'skipped' });
           } else {
               successful++;
               processedRecords.push({ ...record, __status: 'success' });
           }
        });

        res.json({
          total: results.length,
          successful,
          skipped,
          records: processedRecords
        });
      } catch (error) {
        console.error("AI processing error:", error);
        res.status(500).json({ 
          error: error.message || 'Failed to process CSV via AI', 
          stack: error.stack, 
          raw: String(error) 
        });
      }
    });
};
