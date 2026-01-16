import { createSupabaseClient } from './client';
import { ScanResults } from '@/lib/scanner-logic';

export interface ScanRecord {
  id: string;
  user_id: string;
  input_text: string;
  risk_score: number;
  findings: {
    critical: any[];
    warnings: any[];
    minor: any[];
  };
  summary: {
    totalFindings: number;
    uniqueTerms: number;
    estimatedPenalty: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Saves a scan result to the database
 * @param userId - The user's ID
 * @param scanResults - The scan results to save
 * @returns The saved scan record or error
 */
export async function saveScan(
  userId: string,
  scanResults: ScanResults
) {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: userId,
      input_text: scanResults.inputText,
      risk_score: scanResults.riskScore,
      findings: {
        critical: scanResults.findings.critical,
        warnings: scanResults.findings.warnings,
        minor: scanResults.findings.minor,
      },
      summary: scanResults.summary,
    })
    .select()
    .single();
  
  return { data, error };
}

/**
 * Gets all scans for a user
 * @param userId - The user's ID
 * @returns Array of scan records or error
 */
export async function getUserScans(userId: string) {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

/**
 * Gets a single scan by ID
 * @param scanId - The scan ID
 * @param userId - The user's ID (for security)
 * @returns The scan record or error
 */
export async function getScanById(scanId: string, userId: string) {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

/**
 * Deletes a scan
 * @param scanId - The scan ID
 * @param userId - The user's ID (for security)
 * @returns Success or error
 */
export async function deleteScan(scanId: string, userId: string) {
  const supabase = createSupabaseClient();
  
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', scanId)
    .eq('user_id', userId);
  
  return { error };
}
