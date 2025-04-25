import { supabase } from './supabase';
import { Log } from './supabase';

export const logAction = async (
  action: Log['action'],
  targetType: Log['target_type'],
  targetId: string,
  targetName: string
) => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Usuário não encontrado');

    const user = JSON.parse(userStr);
    
    const { error } = await supabase
      .from('logs')
      .insert({
        user_id: user.id,
        action,
        target_type: targetType,
        target_id: targetId,
        target_name: targetName,
        timestamp: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao registrar ação:', error);
  }
}; 