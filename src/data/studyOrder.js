// Study order based on course modules from MD files
// This provides the recommended learning sequence

export const studyOrder = {
  modules: [
    {
      moduleNumber: 1,
      title: "Course Foundations",
      description: "Prerequisites and complexity analysis basics",
      topics: []  // Covered in prerequisites
    },
    {
      moduleNumber: 2,
      title: "Amortized Complexity Analysis",
      description: "Aggregate, accounting, and potential methods",
      topics: ['amortized'],
      estimatedTime: '45 min'
    },
    {
      moduleNumber: 3,
      title: "External Memory & Cache Algorithms",
      description: "Memory hierarchy, I/O complexity, cache optimization",
      topics: ['cacheOptimization'],
      estimatedTime: '45 min'
    },
    {
      moduleNumber: 4,
      title: "External Sorting",
      description: "Run generation, k-way merging, I/O efficient sorting",
      topics: ['externalSorting'],
      estimatedTime: '50 min'
    },
    {
      moduleNumber: 5,
      title: "Tournament Trees",
      description: "Winner trees, loser trees, k-way merge applications",
      topics: ['tournamentTrees'],
      estimatedTime: '40 min'
    },
    {
      moduleNumber: 6,
      title: "Huffman Trees & Compression",
      description: "Optimal merging, prefix codes, entropy bounds",
      topics: ['huffmanTrees'],
      estimatedTime: '35 min'
    },
    {
      moduleNumber: 7,
      title: "Double-Ended Priority Queues",
      description: "Interval heaps, min-max heaps, deaps, DEPQ structures",
      topics: ['intervalHeaps', 'minMaxHeaps', 'deaps'],
      estimatedTime: '85 min'
    },
    {
      moduleNumber: 8,
      title: "Meldable Heaps",
      description: "Leftist trees, skew heaps, efficient melding",
      topics: ['leftistTrees'],
      estimatedTime: '35 min'
    },
    {
      moduleNumber: 9,
      title: "Advanced Heap Structures",
      description: "Binomial heaps, Fibonacci heaps, lazy operations",
      topics: ['binomialHeaps', 'fibonacciHeaps'],
      estimatedTime: '95 min'
    },
    {
      moduleNumber: 10,
      title: "Bin Packing Algorithms",
      description: "Online/offline algorithms, approximation bounds",
      topics: ['binPacking'],
      estimatedTime: '40 min'
    },
    {
      moduleNumber: 11,
      title: "Expression Processing",
      description: "Expression trees, parsing algorithms, notation conversion",
      topics: ['expressionTrees'],
      estimatedTime: '35 min'
    },
    {
      moduleNumber: 12,
      title: "Self-Adjusting Structures",
      description: "Splay trees, adaptive data structures",
      topics: ['splayTrees'],
      estimatedTime: '35 min'
    },
    {
      moduleNumber: 13,
      title: "Parallel & Advanced Topics",
      description: "Lock-free algorithms, concurrent data structures",
      topics: ['parallelAlgorithms'],
      estimatedTime: '40 min'
    }
  ],

  // Quick reference for topic dependencies
  dependencies: {
    'amortized': [],  // No prerequisites
    'cacheOptimization': [],
    'externalSorting': ['cacheOptimization'],
    'tournamentTrees': ['externalSorting'],
    'huffmanTrees': [],
    'intervalHeaps': [],
    'minMaxHeaps': ['intervalHeaps'],
    'deaps': ['intervalHeaps'],
    'leftistTrees': [],
    'binomialHeaps': ['leftistTrees'],
    'fibonacciHeaps': ['binomialHeaps', 'amortized'],
    'binPacking': [],
    'expressionTrees': [],
    'splayTrees': ['amortized'],
    'parallelAlgorithms': []
  },

  // Suggested study paths
  studyPaths: {
    comprehensive: {
      name: "Complete Course",
      description: "Follow the course module order",
      sequence: [
        'amortized',
        'cacheOptimization',
        'externalSorting',
        'tournamentTrees',
        'huffmanTrees',
        'intervalHeaps',
        'minMaxHeaps',
        'deaps',
        'leftistTrees',
        'binomialHeaps',
        'fibonacciHeaps',
        'binPacking',
        'expressionTrees',
        'splayTrees',
        'parallelAlgorithms'
      ]
    },
    priorityQueues: {
      name: "Priority Queue Focus",
      description: "Deep dive into heap structures",
      sequence: [
        'intervalHeaps',
        'minMaxHeaps',
        'deaps',
        'leftistTrees',
        'binomialHeaps',
        'fibonacciHeaps',
        'tournamentTrees'
      ]
    },
    externalAlgorithms: {
      name: "External Memory Focus",
      description: "I/O efficient algorithms",
      sequence: [
        'cacheOptimization',
        'externalSorting',
        'tournamentTrees',
        'huffmanTrees'
      ]
    },
    examPrep: {
      name: "Exam Preparation",
      description: "High-priority topics for exams",
      sequence: [
        'amortized',  // Always tested
        'intervalHeaps',  // Common DEPQ questions
        'leftistTrees',  // Meld operations
        'binomialHeaps',  // Binary arithmetic
        'externalSorting',  // I/O complexity
        'tournamentTrees',  // k-way merge
        'huffmanTrees',  // Compression
        'fibonacciHeaps'  // Advanced amortized
      ]
    }
  },

  // Exam weightage (based on typical MS curriculum)
  examWeightage: {
    'amortized': 15,  // Very important
    'externalSorting': 12,
    'intervalHeaps': 10,
    'leftistTrees': 8,
    'binomialHeaps': 8,
    'fibonacciHeaps': 7,
    'tournamentTrees': 8,
    'huffmanTrees': 7,
    'cacheOptimization': 8,
    'minMaxHeaps': 5,
    'deaps': 4,
    'binPacking': 5,
    'expressionTrees': 3,
    'splayTrees': 5,
    'parallelAlgorithms': 5
  },

  // Time estimates for mastery
  masteryTime: {
    'amortized': { reading: 45, practice: 120, total: 165 },
    'cacheOptimization': { reading: 45, practice: 90, total: 135 },
    'externalSorting': { reading: 50, practice: 100, total: 150 },
    'tournamentTrees': { reading: 40, practice: 80, total: 120 },
    'huffmanTrees': { reading: 35, practice: 70, total: 105 },
    'intervalHeaps': { reading: 40, practice: 80, total: 120 },
    'minMaxHeaps': { reading: 30, practice: 60, total: 90 },
    'deaps': { reading: 25, practice: 50, total: 75 },
    'leftistTrees': { reading: 35, practice: 90, total: 125 },
    'binomialHeaps': { reading: 45, practice: 100, total: 145 },
    'fibonacciHeaps': { reading: 50, practice: 120, total: 170 },
    'binPacking': { reading: 40, practice: 80, total: 120 },
    'expressionTrees': { reading: 35, practice: 60, total: 95 },
    'splayTrees': { reading: 35, practice: 70, total: 105 },
    'parallelAlgorithms': { reading: 40, practice: 60, total: 100 }
  }
};

// Helper function to get next topic in study path
export function getNextTopic(currentTopic, pathName = 'comprehensive') {
  const path = studyOrder.studyPaths[pathName].sequence;
  const currentIndex = path.indexOf(currentTopic);

  if (currentIndex === -1 || currentIndex === path.length - 1) {
    return null;
  }

  return path[currentIndex + 1];
}

// Helper function to get module for a topic
export function getModuleForTopic(topicKey) {
  for (const module of studyOrder.modules) {
    if (module.topics.includes(topicKey)) {
      return module;
    }
  }
  return null;
}

// Helper function to check if prerequisites are met
export function checkPrerequisites(topicKey, completedTopics = []) {
  const deps = studyOrder.dependencies[topicKey] || [];
  return deps.every(dep => completedTopics.includes(dep));
}

// Helper function to get study progress
export function getStudyProgress(completedTopics = [], pathName = 'comprehensive') {
  const path = studyOrder.studyPaths[pathName].sequence;
  const completed = path.filter(topic => completedTopics.includes(topic)).length;

  return {
    completed,
    total: path.length,
    percentage: Math.round((completed / path.length) * 100),
    nextTopic: path.find(topic => !completedTopics.includes(topic)) || null
  };
}

// Helper function to estimate remaining study time
export function getRemainingStudyTime(completedTopics = []) {
  let totalMinutes = 0;

  for (const [topic, time] of Object.entries(studyOrder.masteryTime)) {
    if (!completedTopics.includes(topic)) {
      totalMinutes += time.total;
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    totalMinutes,
    hours,
    minutes,
    formatted: `${hours}h ${minutes}min`
  };
}