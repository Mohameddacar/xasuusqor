// Mock Base44 API client for development
// In production, this would connect to the actual Base44 API

const mockData = {
  journals: [
    {
      id: '1',
      name: 'Personal',
      description: 'My personal thoughts and daily reflections',
      color: '#8B7355',
      icon: 'BookOpen',
      is_default: true,
      created_date: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Work',
      description: 'Professional goals, projects, and achievements',
      color: '#6B73FF',
      icon: 'Briefcase',
      is_default: false,
      created_date: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: 'Travel',
      description: 'Adventures, trips, and travel memories',
      color: '#4CAF50',
      icon: 'MapPin',
      is_default: false,
      created_date: '2024-01-03T00:00:00Z'
    }
  ],
  entries: [
    {
      id: '1',
      journal_id: '1',
      title: 'Great day!',
      content: '<p>Today was amazing! I had a wonderful time with my family and felt so grateful for everything.</p>',
      summary: 'A positive day filled with family time and gratitude',
      date: '2024-10-17',
      mood: 'great',
      tags: ['family', 'gratitude'],
      auto_tags: ['happiness', 'joy'],
      emotions: ['joy', 'gratitude'],
      key_themes: ['family', 'gratitude'],
      is_favorite: false,
      created_date: '2024-10-17T10:00:00Z'
    }
  ],
  goals: [
    {
      id: '1',
      title: 'Run a 5K',
      description: 'Train for and complete my first 5K race',
      category: 'health',
      progress: 20,
      target_date: '2025-03-15',
      status: 'active',
      created_date: '2024-10-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Learn Spanish',
      description: 'Become conversational in Spanish for my trip',
      category: 'learning',
      progress: 20,
      target_date: '2025-06-01',
      status: 'active',
      created_date: '2024-10-01T00:00:00Z'
    },
    {
      id: '3',
      title: 'Read 24 books',
      description: 'Read 2 books per month this year',
      category: 'personal',
      progress: 20,
      target_date: '2025-12-31',
      status: 'active',
      created_date: '2024-10-01T00:00:00Z'
    }
  ],
  user: {
    id: '1',
    name: 'Mohamed Dacar',
    email: 'mohameddacarmohumed@gmail.com',
    subscription_plan: 'premium',
    member_since: '2025-10-17T00:00:00Z'
  }
};

class Base44Client {
  constructor() {
    this.baseUrl = 'https://api.base44.com';
    this.apiKey = import.meta.env.VITE_BASE44_API_KEY || 'mock-key';
  }

  // Auth methods
  get auth() {
    return {
      me: () => Promise.resolve(mockData.user),
      login: (credentials) => Promise.resolve({ token: 'mock-token', user: mockData.user }),
      logout: () => Promise.resolve(),
    };
  }

  // Entity methods
  get entities() {
    return {
      Journal: {
        list: (sort = '') => {
          const journals = [...mockData.journals];
          if (sort.includes('-created_date')) {
            journals.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
          }
          return Promise.resolve(journals);
        },
        create: (data) => {
          const newJournal = {
            id: Date.now().toString(),
            ...data,
            created_date: new Date().toISOString()
          };
          mockData.journals.push(newJournal);
          return Promise.resolve(newJournal);
        },
        update: (id, data) => {
          const index = mockData.journals.findIndex(j => j.id === id);
          if (index !== -1) {
            mockData.journals[index] = { ...mockData.journals[index], ...data };
            return Promise.resolve(mockData.journals[index]);
          }
          throw new Error('Journal not found');
        },
        delete: (id) => {
          const index = mockData.journals.findIndex(j => j.id === id);
          if (index !== -1) {
            mockData.journals.splice(index, 1);
            return Promise.resolve();
          }
          throw new Error('Journal not found');
        }
      },
      JournalEntry: {
        list: (sort = '') => {
          const entries = [...mockData.entries];
          if (sort.includes('-date')) {
            entries.sort((a, b) => new Date(b.date) - new Date(a.date));
          }
          return Promise.resolve(entries);
        },
        create: (data) => {
          const newEntry = {
            id: Date.now().toString(),
            ...data,
            created_date: new Date().toISOString()
          };
          mockData.entries.push(newEntry);
          return Promise.resolve(newEntry);
        },
        update: (id, data) => {
          const index = mockData.entries.findIndex(e => e.id === id);
          if (index !== -1) {
            mockData.entries[index] = { ...mockData.entries[index], ...data };
            return Promise.resolve(mockData.entries[index]);
          }
          throw new Error('Entry not found');
        },
        delete: (id) => {
          const index = mockData.entries.findIndex(e => e.id === id);
          if (index !== -1) {
            mockData.entries.splice(index, 1);
            return Promise.resolve();
          }
          throw new Error('Entry not found');
        }
      },
      Goal: {
        list: (sort = '') => {
          const goals = [...mockData.goals];
          if (sort.includes('-created_date')) {
            goals.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
          }
          return Promise.resolve(goals);
        },
        create: (data) => {
          const newGoal = {
            id: Date.now().toString(),
            ...data,
            created_date: new Date().toISOString()
          };
          mockData.goals.push(newGoal);
          return Promise.resolve(newGoal);
        },
        update: (id, data) => {
          const index = mockData.goals.findIndex(g => g.id === id);
          if (index !== -1) {
            mockData.goals[index] = { ...mockData.goals[index], ...data };
            return Promise.resolve(mockData.goals[index]);
          }
          throw new Error('Goal not found');
        },
        delete: (id) => {
          const index = mockData.goals.findIndex(g => g.id === id);
          if (index !== -1) {
            mockData.goals.splice(index, 1);
            return Promise.resolve();
          }
          throw new Error('Goal not found');
        }
      }
    };
  }

  // Integration methods
  get integrations() {
    return {
      Core: {
        InvokeLLM: async ({ prompt, response_json_schema, file_urls }) => {
          // Mock AI response
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
          
          if (response_json_schema) {
            return {
              suggested_tags: ['gratitude', 'family', 'happiness'],
              summary: 'A positive reflection on family time and gratitude',
              emotions: ['joy', 'gratitude'],
              key_themes: ['family', 'gratitude']
            };
          }
          
          return 'This is a mock AI response for the prompt: ' + prompt;
        }
      }
    };
  }
}

export const base44 = new Base44Client();
