import React, { useState } from 'react';
import { FiChevronRight, FiChevronDown, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import IntervalHeapViz from '../components/visualizations/IntervalHeapViz';
import LoserTreeViz from '../components/visualizations/LoserTreeViz';
import LeftistTreeViz from '../components/visualizations/LeftistTreeViz';
import BinomialHeapViz from '../components/visualizations/BinomialHeapViz';
import CacheVisualization from '../components/visualizations/CacheVisualization';
import HuffmanTreeViz from '../components/visualizations/HuffmanTreeViz';
import FibonacciHeapViz from '../components/visualizations/FibonacciHeapViz';
import SplayTreeViz from '../components/visualizations/SplayTreeViz';
import ExternalSortViz from '../components/visualizations/ExternalSortViz';
import AmortizedStackViz from '../components/visualizations/AmortizedStackViz';
import MinMaxHeapViz from '../components/visualizations/MinMaxHeapViz';
import PotentialMethodViz from '../components/visualizations/PotentialMethodViz';
import MatrixMultiplicationViz from '../components/visualizations/MatrixMultiplicationViz';
import ReplacementSelectionViz from '../components/visualizations/ReplacementSelectionViz';
import WinnerTreeViz from '../components/visualizations/WinnerTreeViz';
import AdaptiveHuffmanViz from '../components/visualizations/AdaptiveHuffmanViz';
import DeapViz from '../components/visualizations/DeapViz';
import SkewHeapViz from '../components/visualizations/SkewHeapViz';
import PairingHeapViz from '../components/visualizations/PairingHeapViz';
import BinPackingFFViz from '../components/visualizations/BinPackingFFViz';
import BinPackingOfflineViz from '../components/visualizations/BinPackingOfflineViz';
import ExpressionTreeViz from '../components/visualizations/ExpressionTreeViz';
import NotationConverterViz from '../components/visualizations/NotationConverterViz';
import MoveToFrontViz from '../components/visualizations/MoveToFrontViz';
import ParallelMergeViz from '../components/visualizations/ParallelMergeViz';
import ConcurrentSkipListViz from '../components/visualizations/ConcurrentSkipListViz';
import { visualizationModules } from '../data/visualizationModules';
import './Visualizations.css';

const Visualizations = () => {
  const [selectedVisualization, setSelectedVisualization] = useState('interval-heap');
  const [expandedModules, setExpandedModules] = useState({ 7: true }); // Default expand DEPQ module
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('modules'); // 'modules' or 'grid'

  // Toggle module expansion
  const toggleModule = (moduleNumber) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber]
    }));
  };

  // Filter visualizations based on search
  const filterVisualizations = () => {
    if (!searchQuery) return visualizationModules.modules;

    return visualizationModules.modules.map(module => ({
      ...module,
      visualizations: module.visualizations.filter(viz =>
        viz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        viz.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(module => module.visualizations.length > 0);
  };

  // Render the selected visualization component
  const renderVisualization = () => {
    switch (selectedVisualization) {
      case 'interval-heap':
        return <IntervalHeapViz />;
      case 'huffman-tree':
        return <HuffmanTreeViz />;
      case 'fibonacci-heap':
        return <FibonacciHeapViz />;
      case 'splay-tree':
        return <SplayTreeViz />;
      case 'loser-tree':
        return <LoserTreeViz />;
      case 'leftist-tree':
        return <LeftistTreeViz />;
      case 'binomial-heap':
        return <BinomialHeapViz />;
      case 'external-sort':
        return <ExternalSortViz />;
      case 'cache':
        return <CacheVisualization />;
      case 'amortized-stack':
        return <AmortizedStackViz />;
      case 'min-max-heap':
        return <MinMaxHeapViz />;
      case 'potential-method':
        return <PotentialMethodViz />;
      case 'matrix-multiplication':
        return <MatrixMultiplicationViz />;
      case 'replacement-selection':
        return <ReplacementSelectionViz />;
      case 'winner-tree':
        return <WinnerTreeViz />;
      case 'adaptive-huffman':
        return <AdaptiveHuffmanViz />;
      case 'deap':
        return <DeapViz />;
      case 'skew-heap':
        return <SkewHeapViz />;
      case 'pairing-heap':
        return <PairingHeapViz />;
      case 'bin-packing-ff':
        return <BinPackingFFViz />;
      case 'bin-packing-offline':
        return <BinPackingOfflineViz />;
      case 'expression-tree':
        return <ExpressionTreeViz />;
      case 'notation-converter':
        return <NotationConverterViz />;
      case 'move-to-front':
        return <MoveToFrontViz />;
      case 'parallel-merge':
        return <ParallelMergeViz />;
      case 'concurrent-skip-list':
        return <ConcurrentSkipListViz />;

      // Placeholder for unimplemented visualizations
      default:
        return (
          <div className="viz-placeholder">
            <h2>Coming Soon!</h2>
            <p>This visualization is under development and will be available soon.</p>
            <div className="placeholder-icon">🚧</div>
            <p className="placeholder-hint">
              Try exploring other available visualizations from the sidebar.
            </p>
          </div>
        );
    }
  };

  const filteredModules = filterVisualizations();
  const currentViz = visualizationModules.getVisualization(selectedVisualization);

  return (
    <div className="visualizations-container">
      <div className="viz-sidebar">
        <div className="sidebar-header">
          <h2>Algorithm Visualizations</h2>
          <p>Interactive demos for advanced data structures</p>
        </div>

        <div className="sidebar-controls">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search visualizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'modules' ? 'active' : ''}`}
              onClick={() => setViewMode('modules')}
            >
              <FiList /> Modules
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid /> Grid
            </button>
          </div>
        </div>

        {viewMode === 'modules' ? (
          <div className="module-list">
            {filteredModules.map(module => (
              <div key={module.moduleNumber} className="module-section">
                <button
                  className="module-header"
                  onClick={() => toggleModule(module.moduleNumber)}
                >
                  <span className="module-icon">{module.icon}</span>
                  <div className="module-info">
                    <span className="module-number">Module {module.moduleNumber}</span>
                    <span className="module-title">{module.title}</span>
                  </div>
                  {expandedModules[module.moduleNumber] ?
                    <FiChevronDown className="module-chevron" /> :
                    <FiChevronRight className="module-chevron" />
                  }
                </button>

                {expandedModules[module.moduleNumber] && (
                  <div className="module-visualizations">
                    {module.visualizations.map(viz => (
                      <button
                        key={viz.id}
                        className={`viz-item ${selectedVisualization === viz.id ? 'active' : ''}
                                   ${!viz.implemented ? 'coming-soon' : ''}`}
                        onClick={() => viz.implemented && setSelectedVisualization(viz.id)}
                      >
                        <div className="viz-item-content">
                          <span className="viz-name">{viz.name}</span>
                          <span className="viz-description">{viz.description}</span>
                          {!viz.implemented && <span className="coming-soon-badge">Soon</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="viz-grid">
            {filteredModules.map(module =>
              module.visualizations.map(viz => (
                <button
                  key={viz.id}
                  className={`grid-item ${selectedVisualization === viz.id ? 'active' : ''}
                             ${!viz.implemented ? 'coming-soon' : ''}`}
                  onClick={() => viz.implemented && setSelectedVisualization(viz.id)}
                >
                  <span className="grid-icon">{module.icon}</span>
                  <span className="grid-name">{viz.name}</span>
                  {!viz.implemented && <span className="coming-soon-badge">Soon</span>}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="viz-main">
        {currentViz && (
          <div className="viz-breadcrumb">
            <span className="breadcrumb-module">
              {currentViz.moduleIcon} Module {currentViz.moduleNumber}: {currentViz.moduleTitle}
            </span>
            <FiChevronRight />
            <span className="breadcrumb-viz">{currentViz.name}</span>
          </div>
        )}

        <div className="visualization-content">
          {renderVisualization()}
        </div>
      </div>
    </div>
  );
};

export default Visualizations;