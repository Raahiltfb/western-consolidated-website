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

const dealers = [
  { email: 'deepak@westernconsolidated.com', firm: 'Deepak Power' },
  { email: 'abhishek@westernconsolidated.com', firm: 'Abhishek Power' },
  { email: 'saurav@westernconsolidated.com', firm: 'Saurav Power' },
  { email: 'navneet@westernconsolidated.com', firm: 'Navneet Power' },
  { email: 'vishal@westernconsolidated.com', firm: 'Vishal Power' },
  { email: 'abhilash@westernconsolidated.com', firm: 'Abhilash Power' }
];

const DEFAULT_PASSWORD = 'Western@1234';

async function run() {
  console.log('Fetching existing users from Supabase Auth...');
  
  let existingEmails = new Set();
  
  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
      perPage: 1000
    });
    
    if (listError) {
      throw listError;
    }
    
    users.forEach(u => {
      if (u.email) {
        existingEmails.add(u.email.toLowerCase());
      }
    });
    
    console.log(`Found ${existingEmails.size} existing users.`);
  } catch (error) {
    console.error('Warning: Failed to list existing users. Will attempt direct creation (duplicate emails will be handled).', error);
  }

  for (const dealer of dealers) {
    const emailLower = dealer.email.toLowerCase();
    
    if (existingEmails.has(emailLower)) {
      console.log(`[-] User ${dealer.email} already exists. Skipping.`);
      continue;
    }

    console.log(`[+] Creating dealer: ${dealer.email}...`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: dealer.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: 'dealer',
        firm_name: dealer.firm
      }
    });

    if (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`[-] User ${dealer.email} already exists (detected on insertion). Skipping.`);
      } else {
        console.error(`[X] Failed to create ${dealer.email}:`, error.message);
      }
    } else {
      console.log(`[✓] Successfully created dealer account for ${dealer.email} (ID: ${data.user.id})`);
    }
  }

  console.log('All provisioning operations completed.');
}

run().catch(err => {
  console.error('Fatal error during execution:', err);
  process.exit(1);
});
