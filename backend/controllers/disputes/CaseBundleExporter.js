// File: CaseBundleExporter.js
// Path: backend/controllers/disputes/CaseBundleExporter.js

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Dispute = require('@/models/dispute/Dispute');
exports.exportCaseBundle = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const dispute = await Dispute.findById(disputeId).populate('createdBy againstUserId votes.voter');
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    const tempDir = path.join(__dirname, `../../../tmp/dispute-${disputeId}`);
    const zipPath = `${tempDir}.zip`;

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // Save JSON metadata
    fs.writeFileSync(path.join(tempDir, 'dispute.json'), JSON.stringify(dispute, null, 2));

    // Save timeline text file
    const timelineText = dispute.timeline?.map(entry => `- [${new Date(entry.timestamp).toLocaleString()}] ${entry.event} → ${entry.value || ''}`).join('\n') || 'No timeline entries.';
    fs.writeFileSync(path.join(tempDir, 'timeline.txt'), timelineText);

    // Copy generated PDF if exists
    const pdfPath = path.join(__dirname, `../../../tmp/dispute-${disputeId}.pdf`);
    if (fs.existsSync(pdfPath)) {
      fs.copyFileSync(pdfPath, path.join(tempDir, `dispute-${disputeId}.pdf`));
    }

    // Zip it all
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();

    output.on('close', () => {
      res.download(zipPath, `CaseBundle-${disputeId}.zip`, () => {
        fs.rmSync(tempDir, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });
  } catch (err) {
    console.error('Case bundle error:', err);
    res.status(500).json({ error: 'Failed to export case bundle' });
  }
};
