import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const REWARD_THRESHOLD = 5;

export async function logVisit(phone) {
  const { data: existingUser, error: fetchError } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { status: 'error', message: 'Error fetching user' };
  }

  if (existingUser) {
    const newVisits = existingUser.visits + 1;
    await supabase
      .from('customers')
      .update({ visits: newVisits })
      .eq('phone', phone);

    if (newVisits >= REWARD_THRESHOLD && !existingUser.reward_issued) {
      await supabase
        .from('customers')
        .update({ reward_issued: true })
        .eq('phone', phone);

      return { status: 'reward', message: `🎉 Congrats! You've earned a reward after ${newVisits} visits.` };
    }

    return { status: 'updated', message: `✅ Visit logged! ${newVisits}/${REWARD_THRESHOLD} visits.` };
  } else {
    await supabase
      .from('customers')
      .insert({ phone: phone, visits: 1, reward_issued: false });

    return { status: 'new', message: `👋 Welcome! 1/${REWARD_THRESHOLD} visits logged.` };
  }
}
