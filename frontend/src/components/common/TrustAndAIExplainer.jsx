// File: TrustAndAIExplainer.jsx
// Path: frontend/src/components/common/TrustAndAIExplainer.jsx
// Purpose: Public-facing modal explaining the AI modules powering trust, pricing, and dispute transparency
// Author: Cod2
// Date: 2025-04-29
// 👑 Cod2 Crown Certified

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const TrustAndAIExplainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="text-sm text-blue-500 underline">
        How our AI builds trust ✨
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Content className="max-w-2xl p-6 bg-white rounded-2xl shadow-xl">
          <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
            Transparency & Trust: Powered by AI
          </Dialog.Title>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-lg text-blue-600 mb-1">1. Smart Pricing Engine — No Overpaying</h3>
              <p>
                Our <strong>AI Pricing Engine</strong> scans real-time car markets, past auctions, and mileage patterns to suggest fair prices.
                You’ll see price badges like "Great Deal" or "Market Match" based on live data—not guesswork.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-red-600 mb-1">2. AI Fraud Detection — Buyer & Seller Safety</h3>
              <p>
                Every listing and transaction is scanned by our <strong>Fraud Detection AI</strong> trained on patterns of real scams.
                Suspicious behavior is flagged instantly, and repeat offenders are blocked—protecting you at every step.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-purple-600 mb-1">3. Dispute Predictor — Transparent Conflict Outcomes</h3>
              <p>
                Got a disagreement? Our <strong>Dispute Prediction AI</strong> gives users a probability score of outcomes before arbitration.
                That means fewer surprises and more fair resolutions. Arbitration is still judged by real humans, but AI gives you clarity upfront.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-green-600 mb-1">4. Data Privacy & Audit Trail — You’re in Control</h3>
              <p>
                All AI decisions are logged in a secure audit trail. You can view, challenge, or download your interaction history at any time.
                We don’t sell your data. Ever.
              </p>
            </div>

            <div className="text-center mt-6">
              <Button onClick={() => setIsOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Got it! 👍
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
};

export default TrustAndAIExplainer;
