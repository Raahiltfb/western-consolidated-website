import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lbgcdzazmlumbhcrlupg.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required.');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/createDealers.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const accounts = [
  { email: 'sunil@westernconsolidated.com', firm: 'Sunil', role: 'admin' },
  { email: 'shyamal@westernconsolidated.com', firm: 'Shyamal', role: 'dealer' },
  { email: 'deepak@westernconsolidated.com', firm: 'Deepak', role: 'dealer' },
  { email: 'abhishek@westernconsolidated.com', firm: 'Abhishek', role: 'dealer' },
  { email: 'saurav@westernconsolidated.com', firm: 'Saurav', role: 'dealer' },
  { email: 'navneet@westernconsolidated.com', firm: 'Navneet', role: 'dealer' },
  { email: 'vishal@westernconsolidated.com', firm: 'Vishal', role: 'dealer' },
  { email: 'abhilash@westernconsolidated.com', firm: 'Abhilash', role: 'dealer' }
];

const DEFAULT_PASSWORD = 'Western@1234';

async function run() {
  console.log('Fetching existing users from Supabase Auth...');
  
  let existingUsersByEmail = new Map();
  
  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
      perPage: 1000
    });
    
    if (listError) {
      throw listError;
    }
    
    users.forEach(u => {
      if (u.email) {
        existingUsersByEmail.set(u.email.toLowerCase(), u);
      }
    });
    
    console.log(`Found ${existingUsersByEmail.size} existing users.`);
  } catch (error) {
    console.error('Warning: Failed to list existing users. Will attempt direct creation (duplicate emails will be handled).', error);
  }

  for (const account of accounts) {
    const emailLower = account.email.toLowerCase();
    
    if (existingUsersByEmail.has(emailLower)) {
      const existingUser = existingUsersByEmail.get(emailLower);
      console.log(`[-] User ${account.email} already exists (ID: ${existingUser.id}). Syncing profile...`);
      
      // Ensure metadata & profile match
      await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          role: account.role,
          firm_name: account.firm
        }
      });

      await supabase.from('profiles').upsert({
        id: existingUser.id,
        email: account.email,
        firm_name: account.firm,
        role: account.role
      });
      continue;
    }

    console.log(`[+] Creating account: ${account.email} (Role: ${account.role})...`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: account.role,
        firm_name: account.firm
      }
    });

    if (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`[-] User ${account.email} already exists (detected on insertion). Skipping.`);
      } else {
        console.error(`[X] Failed to create ${account.email}:`, error.message);
      }
    } else {
      console.log(`[✓] Successfully created account for ${account.email} (ID: ${data.user.id})`);
      
      // Ensure profile row exists
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: account.email,
        firm_name: account.firm,
        role: account.role
      });
    }
  }

  console.log('All provisioning operations completed.');
}

run().catch(err => {
  console.error('Fatal error during execution:', err);
  process.exit(1);
});
