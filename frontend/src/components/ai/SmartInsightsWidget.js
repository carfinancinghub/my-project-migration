// 👑 Crown Certified Component — SmartInsightsWidget.js
// Path: frontend/src/components/ai/SmartInsightsWidget.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Lock } from 'lucide-react';
import logger from '@/utils/logger';

const SmartInsightsWidget = ({ insights = [], isPremium }) => {
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleInsight = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  try {
    if (!insights.length) {
      return (
        <Card className="text-center p-4 border-dashed">
          <CardContent>No insights available at this time.</CardContent>
        </Card>
      );
    }

    return (
      <div data-testid="smart-insights-widget" className="space-y-3">
        {insights.map(({ id, label, value, detail }) => (
          <Card key={id} className="shadow-md rounded-2xl p-3">
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
                {isPremium ? (
                  <Sparkles
                    data-testid={`insight-toggle-${id}`}
                    onClick={() => toggleInsight(id)}
                    className="w-5 h-5 text-yellow-500 cursor-pointer"
                  />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              {isPremium && expandedIds.includes(id) && detail && (
                <div
                  data-testid={`insight-expanded-${id}`}
                  className="mt-2 text-sm text-gray-600"
                >
                  {detail}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {isPremium && (
          <div data-testid="premium-insights" className="text-right text-xs text-gray-400 italic">
            Premium AI insights powered by Wow++ Analytics
          </div>
        )}
      </div>
    );
  } catch (error) {
    logger.error('SmartInsightsWidget failed to render', error);
    return null;
  }
};

SmartInsightsWidget.propTypes = {
  insights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      detail: PropTypes.string,
    })
  ),
  isPremium: PropTypes.bool,
};

export default SmartInsightsWidget;