import { supabase, isSupabaseConfigured } from './supabase';
import { 
  STORAGE_KEYS, 
  loadData, 
  saveData, 
  INITIAL_CHILDREN, 
  INITIAL_TASKS, 
  INITIAL_REWARDS, 
  INITIAL_EMOTION_LOGS 
} from './storage';

/**
 * Carrega os dados do Supabase. Se não estiver configurado ou offline,
 * usa o cache do LocalStorage como fallback transparente.
 */
export async function fetchInitialAppData() {
  if (!isSupabaseConfigured()) {
    return {
      children: loadData(STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN),
      tasks: loadData(STORAGE_KEYS.TASKS, INITIAL_TASKS),
      rewards: loadData(STORAGE_KEYS.REWARDS, INITIAL_REWARDS),
      emotionLogs: loadData(STORAGE_KEYS.EMOTION_LOGS, INITIAL_EMOTION_LOGS)
    };
  }

  try {
    const [childrenRes, tasksRes, rewardsRes, logsRes] = await Promise.all([
      supabase.from('children').select('*'),
      supabase.from('tasks').select('*'),
      supabase.from('rewards').select('*'),
      supabase.from('emotion_logs').select('*')
    ]);

    const children = (childrenRes.data && childrenRes.data.length > 0)
      ? childrenRes.data 
      : loadData(STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN);

    const tasks = (tasksRes.data && tasksRes.data.length > 0)
      ? tasksRes.data 
      : loadData(STORAGE_KEYS.TASKS, INITIAL_TASKS);

    const rewards = (rewardsRes.data && rewardsRes.data.length > 0)
      ? rewardsRes.data 
      : loadData(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);

    const emotionLogs = (logsRes.data && logsRes.data.length > 0)
      ? logsRes.data 
      : loadData(STORAGE_KEYS.EMOTION_LOGS, INITIAL_EMOTION_LOGS);

    return { children, tasks, rewards, emotionLogs };
  } catch (err) {
    console.warn('Erro ao conectar ao Supabase, carregando localmente:', err);
    return {
      children: loadData(STORAGE_KEYS.CHILDREN, INITIAL_CHILDREN),
      tasks: loadData(STORAGE_KEYS.TASKS, INITIAL_TASKS),
      rewards: loadData(STORAGE_KEYS.REWARDS, INITIAL_REWARDS),
      emotionLogs: loadData(STORAGE_KEYS.EMOTION_LOGS, INITIAL_EMOTION_LOGS)
    };
  }
}

/**
 * Salva ou atualiza uma tarefa no Supabase e no cache local
 */
export async function syncTask(task) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('tasks').upsert(task);
    } catch (err) {
      console.warn('Falha na sincronização da tarefa com Supabase:', err);
    }
  }
}

/**
 * Salva ou atualiza dados da criança no Supabase
 */
export async function syncChild(child) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('children').upsert(child);
    } catch (err) {
      console.warn('Falha na sincronização da criança com Supabase:', err);
    }
  }
}
