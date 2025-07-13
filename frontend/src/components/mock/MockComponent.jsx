// File: MockComponent.jsx
// Path: frontend/src/components/mock/MockComponent.jsx
// Purpose: Consolidated mock component combining layout tests from MockComponent1, 2, and 3
// Author: Cod1 (05111347 - PDT)
// 👑 Cod2 Crown Certified

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';

/**
 * Functions Summary:
 * - renderLayout1: Renders title, subtitle, and content list with panels.
 * - renderLayout2: Renders header, item blocks, and a footer note.
 * - renderLayout3: Renders toggleable content sections.
 * - Inputs: variant (string), and props depending on the layout
 * - Outputs: JSX element with layout-specific content or fallback UI
 * - Dependencies: React, PropTypes, @/utils/logger
 */

const MockComponent = ({
  variant,
  title,
  subtitle,
  contentList,
  header,
  items,
  footerNote,
  intro,
  sections,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const renderLayout1 = () => {
    try {
      if (!title || !subtitle || !Array.isArray(contentList)) {
        throw new Error('Layout1 props are invalid');
      }
      return (
        <div className="p-4 border rounded bg-white">
          <h1 className="text-xl font-bold text-blue-800">{title}</h1>
          <h2 className="text-lg text-gray-700 mb-2">{subtitle}</h2>
          <ul className="list-disc list-inside">
            {contentList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-2 bg-gray-100 rounded">Static Panel 1</div>
            <div className="p-2 bg-gray-100 rounded">Static Panel 2</div>
          </div>
        </div>
      );
    } catch (error) {
      logger.error('Layout1 render error:', error);
      return <div className="text-red-600">Error rendering Layout 1</div>;
    }
  };

  const renderLayout2 = () => {
    try {
      if (!header || !Array.isArray(items) || !footerNote) {
        throw new Error('Layout2 props are invalid');
      }
      return (
        <div className="p-4 bg-slate-50 border rounded">
          <h1 className="text-2xl font-semibold text-indigo-800 mb-3">{header}</h1>
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="p-2 bg-white rounded shadow">
                <p>{item}</p>
                <small className="text-gray-500">Item #{idx + 1}</small>
              </div>
            ))}
          </div>
          <p className="text-sm italic text-gray-600 mt-4">{footerNote}</p>
        </div>
      );
    } catch (error) {
      logger.error('Layout2 render error:', error);
      return <div className="text-red-600">Error rendering Layout 2</div>;
    }
  };

  const renderLayout3 = () => {
    try {
      if (!intro || !Array.isArray(sections)) {
        throw new Error('Layout3 props are invalid');
      }
      return (
        <div className="p-4 bg-white border rounded">
          <p className="mb-2 text-gray-700">{intro}</p>
          {sections.map((section, idx) => (
            <div key={idx} className="mb-2">
              <button
                className="text-blue-600 underline"
                onClick={() =>
                  setActiveIndex(idx === activeIndex ? null : idx)
                }
              >
                {section.title}
              </button>
              {activeIndex === idx && (
                <div className="mt-1 text-sm text-gray-800 bg-gray-50 p-2 rounded">
                  {section.content}
                </div>
              )}
            </div>
          ))}
          <div className="text-xs text-gray-400 mt-4">Rendered with layout 3</div>
        </div>
      );
    } catch (error) {
      logger.error('Layout3 render error:', error);
      return <div className="text-red-600">Error rendering Layout 3</div>;
    }
  };

  if (!variant) return <div className="text-red-600">Missing layout variant</div>;

  return variant === 'layout1'
    ? renderLayout1()
    : variant === 'layout2'
    ? renderLayout2()
    : variant === 'layout3'
    ? renderLayout3()
    : <div className="text-red-600">Invalid layout variant</div>;
};

MockComponent.propTypes = {
  variant: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  contentList: PropTypes.arrayOf(PropTypes.string),
  header: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  footerNote: PropTypes.string,
  intro: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
};

export default MockComponent;
