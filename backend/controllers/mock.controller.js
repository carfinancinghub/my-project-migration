// (c) 2025 CFH, All Rights Reserved
// Purpose: Mock controller
module.exports = {
mockAction: (req, res) => res.status(200).json({ message: 'Mock controller' })
};
