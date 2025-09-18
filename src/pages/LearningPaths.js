import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCircle, FiLock, FiClock, FiAward, FiBook, FiPlay, FiCode } from 'react-icons/fi';
import './LearningPaths.css';

const learningPaths = [
  {
    id: 'foundations',
    title: 'Complexity Analysis Foundations',
    description: 'Master the fundamentals of amortized complexity analysis',
    estimatedTime: '3 hours',
    difficulty: 'beginner',
    modules: [
      {
        id: 'f1',
        title: 'Introduction to Amortized Analysis',
        completed: false,
        time: '30 min',
        content: {
          overview: 'Learn why amortized analysis provides better bounds than worst-case analysis for sequences of operations.',
          keyPoints: [
            'Difference between worst-case and amortized complexity',
            'When to use amortized analysis',
            'Relationship between actual and amortized costs',
            'Requirement: Σ(actual) ≤ Σ(amortized)'
          ],
          resources: [
            { type: 'flashcard', category: 'definitions', topic: 'Amortized Complexity' },
            { type: 'visualization', id: 'binary-counter' },
            { type: 'problem', id: 1 }
          ]
        }
      },
      {
        id: 'f2',
        title: 'Aggregate Method',
        completed: false,
        time: '45 min',
        content: {
          overview: 'The simplest amortized analysis method - find total cost of n operations and divide by n.',
          keyPoints: [
            'Calculate upper bound on n operations',
            'Divide total by n for amortized cost',
            'Stack example: n pushes + n pops = 2n total',
            'Binary counter: < 2n bit flips for n increments'
          ],
          resources: [
            { type: 'flashcard', category: 'formulas', topic: 'Aggregate Method' },
            { type: 'practice', topic: 'Stack Operations' },
            { type: 'code', template: 'binary-counter' }
          ]
        }
      },
      {
        id: 'f3',
        title: 'Accounting Method',
        completed: false,
        time: '45 min',
        content: {
          overview: 'Assign different charges to operations, building credit for expensive operations.',
          keyPoints: [
            'Operations can be overcharged (build credit)',
            'Credits pay for future expensive operations',
            'Must maintain non-negative credit balance',
            'Example: Charge 2 for push (1 for push, 1 credit for future pop)'
          ],
          resources: [
            { type: 'flashcard', category: 'algorithms', topic: 'Accounting Method' },
            { type: 'visualization', id: 'stack-credits' },
            { type: 'problem', id: 2 }
          ]
        }
      },
      {
        id: 'f4',
        title: 'Potential Function Method',
        completed: false,
        time: '60 min',
        content: {
          overview: 'Most flexible method using a potential function to track the "energy" stored in the data structure.',
          keyPoints: [
            'Define potential function Φ(Di)',
            'Amortized = Actual + ΔΦ',
            'Choose Φ so expensive operations decrease potential',
            'Binary counter: Φ = number of 1s in counter'
          ],
          resources: [
            { type: 'flashcard', category: 'formulas', topic: 'Potential Function' },
            { type: 'practice', topic: 'Potential Analysis' },
            { type: 'code', template: 'potential-function' }
          ]
        }
      }
    ]
  },
  {
    id: 'external-memory',
    title: 'External Memory & Sorting',
    description: 'Learn efficient algorithms for disk-based data processing',
    estimatedTime: '4 hours',
    difficulty: 'intermediate',
    modules: [
      {
        id: 'e1',
        title: 'Memory Hierarchy Model',
        completed: false,
        time: '30 min',
        content: {
          overview: 'Understand the multi-level memory hierarchy and its impact on algorithm design.',
          keyPoints: [
            'Registers → L1 Cache → L2 Cache → RAM → Disk',
            'Access time increases exponentially with level',
            'Block-based disk access (seek + latency + transfer)',
            'Cache line effects on performance'
          ],
          resources: [
            { type: 'visualization', id: 'cache' },
            { type: 'flashcard', category: 'definitions', topic: 'Memory Hierarchy' },
            { type: 'practice', topic: 'Cache Analysis' }
          ]
        }
      },
      {
        id: 'e2',
        title: 'External Merge Sort',
        completed: false,
        time: '60 min',
        content: {
          overview: 'Two-phase algorithm for sorting data that doesn\'t fit in memory.',
          keyPoints: [
            'Phase 1: Generate sorted runs using available memory',
            'Phase 2: Merge runs using k-way merge',
            'I/O complexity: 2n/B × (1 + ⌈log_k(runs)⌉)',
            'Optimizing k for minimal I/O time'
          ],
          resources: [
            { type: 'flashcard', category: 'algorithms', topic: 'External Sort' },
            { type: 'visualization', id: 'external-sort' },
            { type: 'code', template: 'merge-sort' }
          ]
        }
      },
      {
        id: 'e3',
        title: 'Run Generation Techniques',
        completed: false,
        time: '90 min',
        content: {
          overview: 'Advanced techniques to generate longer runs, reducing merge passes.',
          keyPoints: [
            'Basic: Generate runs of memory size M',
            'Loser Tree: Generate runs of average size 2M',
            'Replacement selection with loser trees',
            'Double buffering for I/O overlap'
          ],
          resources: [
            { type: 'visualization', id: 'loser-tree' },
            { type: 'flashcard', category: 'algorithms', topic: 'Loser Tree' },
            { type: 'problem', id: 5 }
          ]
        }
      },
      {
        id: 'e4',
        title: 'Cache Optimization',
        completed: false,
        time: '60 min',
        content: {
          overview: 'Techniques to minimize cache misses and improve memory access patterns.',
          keyPoints: [
            'Matrix multiplication loop ordering (ijk vs ikj)',
            'Cache-oblivious algorithms',
            'Tiled/blocked algorithms',
            'Prefetching strategies'
          ],
          resources: [
            { type: 'flashcard', category: 'formulas', topic: 'Cache Miss Formula' },
            { type: 'visualization', id: 'cache' },
            { type: 'code', template: 'matrix-multiply' }
          ]
        }
      }
    ]
  },
  {
    id: 'priority-queues',
    title: 'Advanced Priority Queues',
    description: 'Deep dive into double-ended priority queues and specialized heaps',
    estimatedTime: '5 hours',
    difficulty: 'advanced',
    modules: [
      {
        id: 'p1',
        title: 'Interval Heaps',
        completed: false,
        time: '60 min',
        content: {
          overview: 'A DEPQ structure where each node contains an interval [a,b] with dual heap properties.',
          keyPoints: [
            'Each node stores interval [left, right]',
            'Left endpoints form min heap',
            'Right endpoints form max heap',
            'O(log n) for all DEPQ operations',
            'Efficient complementary range search'
          ],
          resources: [
            { type: 'visualization', id: 'interval-heap' },
            { type: 'flashcard', category: 'definitions', topic: 'Interval Heap' },
            { type: 'code', template: 'interval-heap' },
            { type: 'problem', id: 2 }
          ]
        }
      },
      {
        id: 'p2',
        title: 'Leftist Trees & Meld Operation',
        completed: false,
        time: '90 min',
        content: {
          overview: 'Heap-ordered binary trees with O(log n) meld operation using the s() function.',
          keyPoints: [
            's(x) = shortest path to external node',
            'Leftist property: s(left) ≥ s(right)',
            'Rightmost path has O(log n) length',
            'Meld by traversing rightmost paths only',
            'Insert and RemoveMin via meld'
          ],
          resources: [
            { type: 'visualization', id: 'leftist-tree' },
            { type: 'flashcard', category: 'definitions', topic: 's() function' },
            { type: 'code', template: 'leftist-tree' },
            { type: 'problem', id: 3 }
          ]
        }
      },
      {
        id: 'p3',
        title: 'Binomial Heaps',
        completed: false,
        time: '90 min',
        content: {
          overview: 'Collection of binomial trees with O(1) amortized insert and meld operations.',
          keyPoints: [
            'Binomial tree Bk has exactly 2^k nodes',
            'Collection represents n in binary',
            'Pairwise combine for remove-min',
            'Tree table method for consolidation',
            'O(1) actual time insert and meld'
          ],
          resources: [
            { type: 'visualization', id: 'binomial-heap' },
            { type: 'flashcard', category: 'algorithms', topic: 'Pairwise Combine' },
            { type: 'code', template: 'binomial-heap' },
            { type: 'problem', id: 4 }
          ]
        }
      },
      {
        id: 'p4',
        title: 'Cache-Aligned d-ary Heaps',
        completed: false,
        time: '60 min',
        content: {
          overview: 'Optimize heap performance by aligning with cache line boundaries.',
          keyPoints: [
            'd-ary heap: each node has d children',
            'Height reduced to log_d(n)',
            '4-heap optimal for modern caches',
            'Array shifting for cache alignment',
            '1.5x-1.8x speedup in heapsort'
          ],
          resources: [
            { type: 'visualization', id: 'cache' },
            { type: 'flashcard', category: 'examples', topic: 'Cache-Aligned 4-Heap' },
            { type: 'code', template: 'd-ary-heap' }
          ]
        }
      }
    ]
  },
  {
    id: 'tournament',
    title: 'Tournament Trees & Applications',
    description: 'Master tournament trees and their practical applications',
    estimatedTime: '2.5 hours',
    difficulty: 'intermediate',
    modules: [
      {
        id: 't1',
        title: 'Winner Trees',
        completed: false,
        time: '45 min',
        content: {
          overview: 'Complete binary trees where internal nodes store match winners.',
          keyPoints: [
            'n players → n-1 internal nodes',
            'Root contains overall winner',
            'O(1) to find winner',
            'O(log n) to replay after change',
            'Used in selection algorithms'
          ],
          resources: [
            { type: 'flashcard', category: 'definitions', topic: 'Winner Tree' },
            { type: 'visualization', id: 'tournament-tree' },
            { type: 'practice', topic: 'Tournament Construction' }
          ]
        }
      },
      {
        id: 't2',
        title: 'Loser Trees',
        completed: false,
        time: '45 min',
        content: {
          overview: 'Tournament trees where internal nodes store losers, making replay more efficient.',
          keyPoints: [
            'Internal nodes store match losers',
            'Overall winner stored separately',
            'Simpler replay logic than winner trees',
            'Preferred for external sorting',
            'Better cache behavior'
          ],
          resources: [
            { type: 'visualization', id: 'loser-tree' },
            { type: 'flashcard', category: 'definitions', topic: 'Loser Tree' },
            { type: 'code', template: 'loser-tree' }
          ]
        }
      },
      {
        id: 't3',
        title: 'k-Way Merging',
        completed: false,
        time: '30 min',
        content: {
          overview: 'Use tournament trees to efficiently merge k sorted sequences.',
          keyPoints: [
            'Naive: k-1 comparisons per element',
            'Tournament tree: log₂k comparisons',
            'Essential for external sorting',
            'Loser tree preferred implementation'
          ],
          resources: [
            { type: 'flashcard', category: 'algorithms', topic: 'k-Way Merge' },
            { type: 'code', template: 'k-way-merge' },
            { type: 'problem', topic: 'Merge Complexity' }
          ]
        }
      },
      {
        id: 't4',
        title: 'Bin Packing Heuristics',
        completed: false,
        time: '30 min',
        content: {
          overview: 'Apply tournament trees to solve bin packing problems efficiently.',
          keyPoints: [
            'First Fit: Use winner tree to find first bin',
            'Best Fit: Find bin with minimum remaining space',
            'FFD/BFD: Sort items first, then apply FF/BF',
            'Performance bounds: FFD ≤ (11/9)OPT + 4',
            'O(n log n) with max winner tree'
          ],
          resources: [
            { type: 'flashcard', category: 'examples', topic: 'First Fit Decreasing' },
            { type: 'visualization', id: 'bin-packing' },
            { type: 'practice', topic: 'Bin Packing' }
          ]
        }
      }
    ]
  }
];

const LearningPaths = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('learningProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(progress));
    checkAchievements();
  }, [progress]);

  const checkAchievements = () => {
    const newAchievements = [];

    learningPaths.forEach(path => {
      const pathProgress = getPathProgress(path);
      if (pathProgress === 100) {
        newAchievements.push({
          id: `complete-${path.id}`,
          title: `Completed ${path.title}`,
          icon: '🎯'
        });
      }
    });

    setAchievements(newAchievements);
  };

  const getPathProgress = (path) => {
    const pathProgress = progress[path.id] || {};
    const completedModules = path.modules.filter(m => pathProgress[m.id]).length;
    return Math.round((completedModules / path.modules.length) * 100);
  };

  const toggleModule = (pathId, moduleId) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress[pathId]) newProgress[pathId] = {};
      newProgress[pathId][moduleId] = !newProgress[pathId][moduleId];
      return newProgress;
    });

    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    stats.xp = (stats.xp || 0) + 10;
    stats.level = Math.floor(stats.xp / 100) + 1;
    localStorage.setItem('userStats', JSON.stringify(stats));
  };

  const isPathUnlocked = (path) => {
    return true; // All paths unlocked for demo
  };

  const handleResourceClick = (resource) => {
    switch(resource.type) {
      case 'flashcard':
        navigate('/flashcards');
        break;
      case 'visualization':
        navigate('/visualizations');
        break;
      case 'practice':
      case 'problem':
        navigate('/practice');
        break;
      case 'code':
        navigate('/playground');
        break;
      default:
        break;
    }
  };

  return (
    <div className="learning-paths-container">
      <div className="paths-header">
        <h1>Learning Paths</h1>
        <p>Structured curriculum to master Advanced Data Structures</p>
      </div>

      {achievements.length > 0 && (
        <div className="achievements-banner">
          <FiAward className="achievement-icon" />
          <span>Recent Achievements:</span>
          {achievements.map(a => (
            <span key={a.id} className="achievement-badge">
              {a.icon} {a.title}
            </span>
          ))}
        </div>
      )}

      <div className="paths-grid">
        {learningPaths.map(path => {
          const pathProgress = getPathProgress(path);
          const isUnlocked = isPathUnlocked(path);

          return (
            <div
              key={path.id}
              className={`path-card ${!isUnlocked ? 'locked' : ''} ${selectedPath?.id === path.id ? 'selected' : ''}`}
              onClick={() => isUnlocked && setSelectedPath(path)}
            >
              <div className="path-header">
                <h3>{path.title}</h3>
                {!isUnlocked && <FiLock className="lock-icon" />}
              </div>

              <p className="path-description">{path.description}</p>

              <div className="path-meta">
                <span className={`difficulty ${path.difficulty}`}>
                  {path.difficulty}
                </span>
                <span className="estimated-time">
                  <FiClock /> {path.estimatedTime}
                </span>
              </div>

              <div className="path-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${pathProgress}%` }}
                  />
                </div>
                <span className="progress-text">{pathProgress}% Complete</span>
              </div>

              {pathProgress === 100 && (
                <div className="completion-badge">
                  <FiCheckCircle /> Completed!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedPath && (
        <div className="path-details">
          <h2>{selectedPath.title} - Modules</h2>
          <div className="modules-list">
            {selectedPath.modules.map(module => {
              const isCompleted = progress[selectedPath.id]?.[module.id] || false;

              return (
                <div
                  key={module.id}
                  className={`module-item ${isCompleted ? 'completed' : ''} ${selectedModule?.id === module.id ? 'expanded' : ''}`}
                  onClick={() => setSelectedModule(selectedModule?.id === module.id ? null : module)}
                >
                  <div className="module-header">
                    <div className="module-checkbox" onClick={(e) => {
                      e.stopPropagation();
                      toggleModule(selectedPath.id, module.id);
                    }}>
                      {isCompleted ? <FiCheckCircle /> : <FiCircle />}
                    </div>
                    <div className="module-info">
                      <h4>{module.title}</h4>
                      <span className="module-time">
                        <FiClock /> {module.time}
                      </span>
                    </div>
                  </div>

                  {selectedModule?.id === module.id && module.content && (
                    <div className="module-content">
                      <div className="content-section">
                        <h5>Overview</h5>
                        <p>{module.content.overview}</p>
                      </div>

                      <div className="content-section">
                        <h5>Key Points</h5>
                        <ul>
                          {module.content.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="content-section">
                        <h5>Study Resources</h5>
                        <div className="resources-grid">
                          {module.content.resources.map((resource, idx) => (
                            <button
                              key={idx}
                              className="resource-button"
                              onClick={() => handleResourceClick(resource)}
                            >
                              {resource.type === 'flashcard' && <FiBook />}
                              {resource.type === 'visualization' && <FiPlay />}
                              {resource.type === 'code' && <FiCode />}
                              {resource.type === 'practice' && <FiPlay />}
                              {resource.type === 'problem' && <FiPlay />}
                              <span>{resource.type === 'flashcard' ? 'Flashcards' :
                                    resource.type === 'visualization' ? 'Visualization' :
                                    resource.type === 'code' ? 'Code Template' :
                                    'Practice'}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        className="mark-complete-btn"
                        onClick={() => toggleModule(selectedPath.id, module.id)}
                      >
                        {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPaths;