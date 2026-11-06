// Initial demo data & LocalStorage manager for NeuroRotina
// Formulated specifically for Science Fair demonstration

const STORAGE_KEYS = {
  CHILDREN: 'neurorotina_children',
  TASKS: 'neurorotina_tasks',
  REWARDS: 'neurorotina_rewards',
  ACTIVE_CHILD_ID: 'neurorotina_active_child_id',
  EMOTION_LOGS: 'neurorotina_emotion_logs',
  SETTINGS: 'neurorotina_settings'
};

export const INITIAL_CHILDREN = [
  {
    id: 'child-1',
    name: 'Theo',
    age: 7,
    diagnosis: 'TEA Nível 1 & TDAH',
    avatar: '🦁',
    stars: 35,
    streakDays: 4,
    colorScheme: 'calm-blue', // sensory-friendly
    sensitivities: ['Sons altos', 'Mudanças bruscas de rotina', 'Luz intensa']
  },
  {
    id: 'child-2',
    name: 'Maya',
    age: 9,
    diagnosis: 'TDAH Predomínio Desatento',
    avatar: '🚀',
    stars: 50,
    streakDays: 6,
    colorScheme: 'mint-green',
    sensitivities: ['Hiperfoco difícil de pausar', 'Procrastinação de tarefas longas']
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    childId: 'child-1',
    title: 'Escovar os dentes',
    time: '08:00',
    durationMin: 3,
    stars: 5,
    icon: 'Sparkles',
    category: 'Higiene',
    status: 'completed_pending_approval', // demo waiting for parent approval
    sensoryLevel: 'baixo', // baixo, medio, alto
    sensoryTip: 'Usar escova macia e pasta sem sabor forte'
  },
  {
    id: 'task-2',
    childId: 'child-1',
    title: 'Arrumar a mochila escolar',
    time: '08:30',
    durationMin: 10,
    stars: 10,
    icon: 'Backpack',
    category: 'Escola',
    status: 'todo',
    sensoryLevel: 'medio',
    sensoryTip: 'Conferir o checklist visual da mochila item por item'
  },
  {
    id: 'task-3',
    childId: 'child-1',
    title: 'Dever de casa de Matemática',
    time: '14:30',
    durationMin: 20,
    stars: 15,
    icon: 'BookOpen',
    category: 'Estudo',
    status: 'todo',
    sensoryLevel: 'alto',
    sensoryTip: 'Pausar a cada 10 min para beber água e alongar'
  },
  {
    id: 'task-4',
    childId: 'child-1',
    title: 'Guardar os brinquedos',
    time: '17:30',
    durationMin: 15,
    stars: 10,
    icon: 'Boxes',
    category: 'Organização',
    status: 'todo',
    sensoryLevel: 'medio',
    sensoryTip: 'Separar por caixas coloridas'
  },
  {
    id: 'task-5',
    childId: 'child-1',
    title: 'Hora do Banho Relaxante',
    time: '19:30',
    durationMin: 15,
    stars: 10,
    icon: 'Bath',
    category: 'Higiene',
    status: 'todo',
    sensoryLevel: 'baixo',
    sensoryTip: 'Água morna e toalha macia'
  }
];

export const INITIAL_REWARDS = [
  {
    id: 'rew-1',
    title: 'Escolher o desenho da noite',
    cost: 30,
    icon: 'Tv',
    description: '30 minutos do seu filme ou desenho predileto'
  },
  {
    id: 'rew-2',
    title: 'Passeio especial no parque',
    cost: 70,
    icon: 'TreePine',
    description: 'Tarde divertida andando de bicicleta no parque'
  },
  {
    id: 'rew-3',
    title: 'Tempo de Massinha ou Slime Sensorial',
    cost: 40,
    icon: 'Smile',
    description: 'Brincadeira livre com texturas relaxantes'
  },
  {
    id: 'rew-4',
    title: 'Noite da Pizza em família',
    cost: 100,
    icon: 'Pizza',
    description: 'Montar a própria pizza do seu jeito'
  }
];

export const INITIAL_EMOTION_LOGS = [
  { date: '2026-11-01', emotion: 'calmo', label: 'Tranquilo', note: 'Dia com rotina previsível' },
  { date: '2026-11-02', emotion: 'feliz', label: 'Muito Feliz', note: 'Conseguiu 3 tarefas antes do almoço' },
  { date: '2026-11-03', emotion: 'ansioso', label: 'Inquieto', note: 'Barulho de obra na rua gerou estresse' },
  { date: '2026-11-04', emotion: 'calmo', label: 'Regulado', note: 'Usou o Cantinho da Calma' },
  { date: '2026-11-05', emotion: 'feliz', label: 'Empolgado', note: 'Bateu a meta de estrelas' }
];

export const loadData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
};

export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
};
