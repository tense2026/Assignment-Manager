import { INITIAL_ASSESSMENTS } from '../types/initialData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'student_assessment_manager_v2_data';

// Helper: Convert JS CamelCase to DB SnakeCase
const toSnakeCaseRow = (item) => ({
  id: item.id,
  subject: item.subject,
  subject_color: item.subjectColor,
  title: item.title,
  due_date: item.dueDate,
  is_presentation: item.isPresentation,
  status: item.status,
  priority: item.priority,
  requirements: item.requirements,
  criteria: item.criteria || [],
  checklist: item.checklist || [],
  reminders: item.reminders || {},
  attached_image: item.attachedImage || null,
  score: item.score ?? null,
  feedback: item.feedback || '',
  completed_at: item.completedAt || null,
  created_at: item.createdAt || new Date().toISOString()
});

// Helper: Convert DB SnakeCase to JS CamelCase
const fromSnakeCaseRow = (row) => ({
  id: row.id,
  subject: row.subject,
  subjectColor: row.subject_color || '#6366F1',
  title: row.title,
  dueDate: row.due_date,
  isPresentation: row.is_presentation || false,
  status: row.status || 'not_started',
  priority: row.priority || 'medium',
  requirements: row.requirements || '',
  criteria: row.criteria || [],
  checklist: row.checklist || [],
  reminders: row.reminders || { d7: true, d3: true, d1: true },
  attachedImage: row.attached_image || null,
  score: row.score ?? null,
  feedback: row.feedback || '',
  completedAt: row.completed_at || null,
  createdAt: row.created_at || new Date().toISOString()
});

// --- Local Storage Sync ---
export const loadLocalAssessments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSESSMENTS));
      return INITIAL_ASSESSMENTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load local assessments:', error);
    return INITIAL_ASSESSMENTS;
  }
};

export const saveLocalAssessments = (assessments) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  } catch (error) {
    console.error('Failed to save local assessments:', error);
  }
};

// --- Supabase Async DB Operations ---
export const fetchAssessments = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, fallback to localStorage:', error.message);
        return loadLocalAssessments();
      }

      if (data && data.length > 0) {
        const parsed = data.map(fromSnakeCaseRow);
        saveLocalAssessments(parsed); // Sync to local storage for offline speed
        return parsed;
      } else {
        // Seed database if empty
        await seedSupabaseIfEmpty();
        return INITIAL_ASSESSMENTS;
      }
    } catch (err) {
      console.warn('Supabase connection failed, using localStorage fallback:', err);
      return loadLocalAssessments();
    }
  }

  return loadLocalAssessments();
};

export const upsertAssessmentToDB = async (item) => {
  // Always update local storage first for instant responsive UI
  const current = loadLocalAssessments();
  const exists = current.some(a => a.id === item.id);
  const updated = exists 
    ? current.map(a => a.id === item.id ? item : a)
    : [item, ...current];
  saveLocalAssessments(updated);

  // Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      const row = toSnakeCaseRow(item);
      const { error } = await supabase
        .from('assessments')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upsert error:', error.message);
      }
    } catch (err) {
      console.error('Supabase upsert exception:', err);
    }
  }
};

export const deleteAssessmentFromDB = async (id) => {
  const current = loadLocalAssessments();
  const updated = current.filter(a => a.id !== id);
  saveLocalAssessments(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }
};

const seedSupabaseIfEmpty = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = INITIAL_ASSESSMENTS.map(toSnakeCaseRow);
      await supabase.from('assessments').upsert(rows);
      saveLocalAssessments(INITIAL_ASSESSMENTS);
    } catch (err) {
      console.warn('Seeding Supabase error:', err);
    }
  }
};

export const resetAssessments = async () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSESSMENTS));
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('assessments').delete().neq('id', '0');
      await seedSupabaseIfEmpty();
    } catch (err) {
      console.warn('Resetting Supabase error:', err);
    }
  }
  return INITIAL_ASSESSMENTS;
};

// --- D-Day & Progress Math Utilities ---
export const getDDayInfo = (dueDateStr) => {
  if (!dueDateStr) return { dDayText: '기한 없음', diffDays: 999, isUrgent: false, isOverdue: false };

  const now = new Date();
  const due = new Date(dueDateStr);
  
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffTime = startOfDue - startOfNow;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      dDayText: `D+${Math.abs(diffDays)}`,
      diffDays,
      isUrgent: false,
      isOverdue: true
    };
  } else if (diffDays === 0) {
    return {
      dDayText: 'D-Day',
      diffDays: 0,
      isUrgent: true,
      isOverdue: false
    };
  } else {
    return {
      dDayText: `D-${diffDays}`,
      diffDays,
      isUrgent: diffDays <= 7,
      isOverdue: false
    };
  }
};

export const calculateProgress = (checklist) => {
  if (!checklist || checklist.length === 0) return 0;
  const completedCount = checklist.filter(item => item.completed).length;
  return Math.round((completedCount / checklist.length) * 100);
};

export const exportDataJSON = (assessments) => {
  const jsonStr = JSON.stringify(assessments, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `수행평가_데이터_백업_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
