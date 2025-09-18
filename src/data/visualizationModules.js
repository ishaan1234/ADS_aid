// Visualization modules organized by course structure
// Provides comprehensive coverage of all topics with interactive demos

export const visualizationModules = {
  modules: [
    {
      moduleNumber: 2,
      title: "Amortized Complexity Analysis",
      icon: "📊",
      visualizations: [
        {
          id: 'amortized-stack',
          name: 'Dynamic Array (Amortized)',
          description: 'Visualize array doubling and amortized cost',
          implemented: true
        },
        {
          id: 'potential-method',
          name: 'Potential Method Demo',
          description: 'Interactive potential function visualization',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 3,
      title: "Cache & Memory Optimization",
      icon: "💾",
      visualizations: [
        {
          id: 'cache',
          name: 'Cache-Aligned Memory Access',
          description: 'Cache hits, misses, and optimization strategies',
          implemented: true
        },
        {
          id: 'matrix-multiplication',
          name: 'Cache-Oblivious Algorithms',
          description: 'Tiling and blocking for cache efficiency',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 4,
      title: "External Sorting",
      icon: "📂",
      visualizations: [
        {
          id: 'external-sort',
          name: 'K-Way External Merge Sort',
          description: 'Run generation and merging with limited memory',
          implemented: true
        },
        {
          id: 'replacement-selection',
          name: 'Replacement Selection',
          description: 'Generating longer initial runs',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 5,
      title: "Tournament Trees",
      icon: "🏆",
      visualizations: [
        {
          id: 'loser-tree',
          name: 'Loser Tree Run Generation',
          description: 'Efficient k-way merging with loser trees',
          implemented: true
        },
        {
          id: 'winner-tree',
          name: 'Winner Tree Operations',
          description: 'Tournament selection and updates',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 6,
      title: "Huffman Trees & Compression",
      icon: "🗜️",
      visualizations: [
        {
          id: 'huffman-tree',
          name: 'Huffman Coding Tree',
          description: 'Build optimal prefix codes for compression',
          implemented: true
        },
        {
          id: 'adaptive-huffman',
          name: 'Adaptive Huffman Coding',
          description: 'Dynamic compression with updating codes',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 7,
      title: "Double-Ended Priority Queues",
      icon: "🌳",
      visualizations: [
        {
          id: 'interval-heap',
          name: 'Interval Heap (DEPQ)',
          description: 'Efficient min-max operations in one structure',
          implemented: true
        },
        {
          id: 'min-max-heap',
          name: 'Min-Max Heap',
          description: 'Alternating min-max levels visualization',
          implemented: true
        },
        {
          id: 'deap',
          name: 'Deap Structure',
          description: 'Dual heap with correspondence property',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 8,
      title: "Meldable Heaps",
      icon: "🔀",
      visualizations: [
        {
          id: 'leftist-tree',
          name: 'Leftist Tree Meld',
          description: 'Efficient heap melding with NPL property',
          implemented: true
        },
        {
          id: 'skew-heap',
          name: 'Skew Heap Operations',
          description: 'Self-adjusting heap with simple meld',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 9,
      title: "Advanced Heap Structures",
      icon: "🌀",
      visualizations: [
        {
          id: 'binomial-heap',
          name: 'Binomial Heap',
          description: 'Binomial tree collection with efficient merge',
          implemented: true
        },
        {
          id: 'fibonacci-heap',
          name: 'Fibonacci Heap',
          description: 'Lazy operations with amortized bounds',
          implemented: true
        },
        {
          id: 'pairing-heap',
          name: 'Pairing Heap',
          description: 'Simple implementation with good performance',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 10,
      title: "Bin Packing Algorithms",
      icon: "📦",
      visualizations: [
        {
          id: 'bin-packing-ff',
          name: 'First Fit & Best Fit',
          description: 'Online bin packing heuristics',
          implemented: true
        },
        {
          id: 'bin-packing-offline',
          name: 'Offline Bin Packing',
          description: 'First Fit Decreasing and optimal solutions',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 11,
      title: "Expression Processing",
      icon: "🌲",
      visualizations: [
        {
          id: 'expression-tree',
          name: 'Expression Tree Builder',
          description: 'Parse and evaluate mathematical expressions',
          implemented: true
        },
        {
          id: 'notation-converter',
          name: 'Notation Converter',
          description: 'Infix, prefix, postfix conversions',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 12,
      title: "Self-Adjusting Structures",
      icon: "🔄",
      visualizations: [
        {
          id: 'splay-tree',
          name: 'Splay Tree',
          description: 'Self-adjusting BST with splaying',
          implemented: true
        },
        {
          id: 'move-to-front',
          name: 'Move-to-Front List',
          description: 'Self-organizing list structure',
          implemented: true
        }
      ]
    },
    {
      moduleNumber: 13,
      title: "Parallel & Advanced Topics",
      icon: "⚡",
      visualizations: [
        {
          id: 'parallel-merge',
          name: 'Parallel Merge Sort',
          description: 'Visualize parallel sorting algorithms',
          implemented: true
        },
        {
          id: 'concurrent-skip-list',
          name: 'Concurrent Skip List',
          description: 'Lock-free probabilistic data structure',
          implemented: true
        }
      ]
    }
  ],

  // Get all visualizations for a specific module
  getModuleVisualizations: function(moduleNumber) {
    const module = this.modules.find(m => m.moduleNumber === moduleNumber);
    return module ? module.visualizations : [];
  },

  // Get all implemented visualizations
  getAllImplemented: function() {
    const result = [];
    this.modules.forEach(module => {
      module.visualizations.forEach(viz => {
        if (viz.implemented) {
          result.push({
            ...viz,
            moduleNumber: module.moduleNumber,
            moduleTitle: module.title,
            moduleIcon: module.icon
          });
        }
      });
    });
    return result;
  },

  // Get visualization by ID
  getVisualization: function(id) {
    for (const module of this.modules) {
      const viz = module.visualizations.find(v => v.id === id);
      if (viz) {
        return {
          ...viz,
          moduleNumber: module.moduleNumber,
          moduleTitle: module.title,
          moduleIcon: module.icon
        };
      }
    }
    return null;
  }
};