
import { supabase } from '@/integrations/supabase/client';

// Helper function to query tables not yet defined in the TypeScript types
export const queryTable = (tableName: string) => {
  // This is a workaround to allow querying tables that aren't in the TypeScript types
  // @ts-ignore - intentionally ignoring type issues to work around limitations
  return supabase.from(tableName);
};

// Helper function to execute raw SQL queries if needed
export const rpc = (functionName: string, params?: Record<string, any>) => {
  // @ts-ignore - intentionally ignoring type issues to work around limitations
  return supabase.rpc(functionName, params);
};
