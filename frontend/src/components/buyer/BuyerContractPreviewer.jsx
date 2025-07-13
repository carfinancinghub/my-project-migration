/**
 * File: BuyerContractPreviewer.jsx
 * Path: frontend/src/components/buyer/BuyerContractPreviewer.jsx
 * Author: Cod4 (with contributions from Cod1 and CodX)
 * Purpose: Unified Crown Certified version with multi-language support, enterprise analytics, and AI risk insight.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';

import PremiumFeature from '@/components/common/PremiumFeature';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useLanguage } from '@/components/common/MultiLanguageSupport';
import Button from '@/components/common/Button';
import logger from '@/utils/logger';
import analyticsExportUtils from '@/utils/analyticsExportUtils';
import AIContractRiskAssessor from '@/utils/AIContractRiskAssessor';

ChartJS.register(ArcElement, Tooltip, Legend);

const BuyerContractPreviewer = ({ contractId }) => {
  const { getTranslation } = useLanguage();
  const [contract, setContract] = useState(null);
  const [riskReport, setRiskReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  const fetchContract = async () => {
    try {
      const res = await fetch(`/api/contracts/${contractId}`);
      const data = await res.json();
      setContract(data);
    } catch (err) {
      logger.error('Error fetching contract:', err);
      toast.error(getTranslation('errorLoadingContract'));
    } finally {
      setLoading(false);
    }
  };

  const analyzeRisk = async () => {
    try {
      const result = await AIContractRiskAssessor.evaluate(contract);
      setRiskReport(result);
    } catch (err) {
      logger.error('Risk analysis failed:', err);
      toast.error(getTranslation('riskAnalysisFailed'));
    }
  };

  const handleExport = async () => {
    try {
      await analyticsExportUtils.exportContractToPDF({ contract, riskReport });
      toast.success(getTranslation('exportSuccess'));
    } catch (err) {
      logger.error('Export failed:', err);
      toast.error(getTranslation('exportError'));
    }
  };

  const renderAnalytics = () => {
    if (!riskReport?.clauseTypes?.length) return null;

    const data = {
      labels: riskReport.clauseTypes.map(c => c.type),
      datasets: [
        {
          data: riskReport.clauseTypes.map(c => c.count),
          backgroundColor: ['#60a5fa', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        }
      ]
    };

    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800">{getTranslation('clauseDistribution')}</h4>
        <Pie data={data} />
      </div>
    );
  };

  const renderRiskSection = () => {
    if (!riskReport) return null;

    return (
      <div className="mt-6 space-y-2">
        <h4 className="text-lg font-semibold text-gray-800">{getTranslation('riskAssessment')}</h4>
        <p className={`text-sm ${riskReport.riskLevel === 'High' ? 'text-red-600' : 'text-green-600'}`}>
          {getTranslation('riskLevel')}: <strong>{riskReport.riskLevel}</strong>
        </p>
        <p className="text-sm text-gray-700">{riskReport.summary}</p>
        {riskReport.mitigationTips?.length > 0 && (
          <ul className="list-disc list-inside text-xs text-yellow-800 mt-2">
            {riskReport.mitigationTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center p-6">{getTranslation('loadingContract')}</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{getTranslation('contractPreview')}</h2>
        <PremiumFeature feature="multiLanguage">
          <div className="transition duration-300">
            <LanguageSelector />
          </div>
        </PremiumFeature>
      </div>

      {/* Contract Summary */}
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>{getTranslation('parties')}:</strong> {contract?.parties?.join(' vs ')}</p>
        <p><strong>{getTranslation('startDate')}:</strong> {contract?.startDate}</p>
        <p><strong>{getTranslation('value')}:</strong> ${contract?.value?.toLocaleString()}</p>
        <p><strong>{getTranslation('duration')}:</strong> {contract?.duration} months</p>
      </div>

      {/* Contract Text */}
      <div className="mt-4 p-4 bg-gray-50 rounded border text-xs text-gray-800 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
        {contract?.text}
      </div>

      {/* Premium Analytics Section */}
      <PremiumFeature feature="contractAnalytics">
        <div className="space-y-4">
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={analyzeRisk}>
            {getTranslation('analyzeRisk')}
          </Button>
          {renderAnalytics()}
          {renderRiskSection()}

          <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleExport}>
            {getTranslation('exportPDF')}
          </Button>
        </div>
      </PremiumFeature>
    </div>
  );
};

BuyerContractPreviewer.propTypes = {
  contractId: PropTypes.string.isRequired
};

export default BuyerContractPreviewer;
