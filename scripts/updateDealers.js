import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lbgcdzazmlumbhcrlupg.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const dealers = [
  { email: 'sunil@westernconsolidated.com', name: 'Sunil' },
  { email: 'shyamal@westernconsolidated.com', name: 'Shyamal' },
  { email: 'deepak@westernconsolidated.com', name: 'Deepak' },
  { email: 'abhishek@westernconsolidated.com', name: 'Abhishek' },
  { email: 'saurav@westernconsolidated.com', name: 'Saurav' },
  { email: 'navneet@westernconsolidated.com', name: 'Navneet' },
  { email: 'vishal@westernconsolidated.com', name: 'Vishal' },
  { email: 'abhilash@westernconsolidated.com', name: 'Abhilash' }
];

async function run() {
  console.log('Fetching all users to find matching IDs...');
  
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
    perPage: 1000
  });

  if (listError) {
    throw listError;
  }

  for (const dealer of dealers) {
    const matchedUser = users.find(u => u.email && u.email.toLowerCase() === dealer.email.toLowerCase());
    
    if (!matchedUser) {
      console.log(`[!] User not found in Auth for email: ${dealer.email}`);
      continue;
    }

    console.log(`[+] Updating ${dealer.email} -> "${dealer.name}"...`);

    // 1. Update Auth user metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(matchedUser.id, {
      user_metadata: {
        role: 'dealer',
        firm_name: dealer.name
      }
    });

    if (authError) {
      console.error(`[X] Failed to update Auth user ${dealer.email}:`, authError.message);
    } else {
      console.log(`[✓] Updated Auth metadata for ${dealer.email}.`);
    }

    // 2. Update Profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ firm_name: dealer.name })
      .eq('id', matchedUser.id);

    if (profileError) {
      console.error(`[X] Failed to update Profile table for ${dealer.email}:`, profileError.message);
    } else {
      console.log(`[✓] Updated Profile table record for ${dealer.email}.`);
    }
  }

  console.log('All update operations completed.');
}

run().catch(err => {
  console.error('Fatal error during execution:', err);
  process.exit(1);
});
