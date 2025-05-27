// reward.js
import { createClient } from '@supabase/supabase-js';

// Replace with your actual API URL (NOT dashboard URL)
const supabaseUrl = 'https://zkukekljmknrsyjbkcoh.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdWtla2xqbWtucnN5amJrY29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjQxNDksImV4cCI6MjA2MzkwMDE0OX0.V3WRkW1Z3BxZdbFD_5LHYqkLHqN7dpuWGXvEXFk-KRM'; // Please keep this secure!

const supabase = createClient(supabaseUrl, supabaseKey);

const REWARD_THRESHOLD = 5;

export async function logVisit(phone) {
  if (!phone) {
    return { status: 'error', message: 'Phone number required.' };
  }
  
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
