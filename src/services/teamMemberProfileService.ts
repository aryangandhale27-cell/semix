import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface TeamMemberProfile {
  name: string;
  mobile: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  internId: string;
  photoDataUrl: string;
  updatedAt?: string;
}

export const INDIAN_SCHEDULED_BANKS = [
  'Abu Dhabi Commercial Bank',
  'AU Small Finance Bank',
  'Airtel Payments Bank',
  'AB Bank Limited',
  'American Express Banking Corp.',
  'Australia and New Zealand Banking Group',
  'Axis Bank',
  'Bandhan Bank',
  'Bank of America',
  'Bank of Bahrain and Kuwait',
  'Bank of Baroda',
  'Bank of Ceylon',
  'Bank of India',
  'Bank of Maharashtra',
  'Bank of China',
  'Bank of Nova Scotia',
  'Barclays Bank',
  'BNP Paribas',
  'BNY Mellon',
  'Canara Bank',
  'Capital Small Finance Bank',
  'Central Bank of India',
  'Citi Bank',
  'Cooperatieve Rabobank U.A.',
  'Credit Agricole',
  'Credit Suisse',
  'China Construction Bank',
  'City Union Bank',
  'CSB Bank',
  'DBS Bank India',
  'DCB Bank',
  'Deutsche Bank',
  'Dhanlaxmi Bank',
  'Doha Bank',
  'Emirates NBD',
  'ESAF Small Finance Bank',
  'Equitas Small Finance Bank',
  'Federal Bank',
  'Fino Payments Bank',
  'First Abu Dhabi Bank',
  'FirstRand Bank',
  'HDFC Bank',
  'HSBC',
  'ICICI Bank',
  'IDBI Bank',
  'IDFC FIRST Bank',
  'India Post Payments Bank',
  'Indian Bank',
  'Indian Overseas Bank',
  'IndusInd Bank',
  'Industrial and Commercial Bank of China',
  'Industrial Bank of Korea',
  'JPMorgan Chase Bank',
  'Jammu & Kashmir Bank',
  'Jana Small Finance Bank',
  'Jio Payments Bank',
  'Karnataka Bank',
  'Karur Vysya Bank',
  'KEB Hana Bank',
  'Kotak Mahindra Bank',
  'Kookmin Bank',
  'Mashreq Bank',
  'Mizuho Bank',
  'MUFG Bank',
  'Nainital Bank',
  'NatWest Markets Plc',
  'North East Small Finance Bank',
  'NSDL Payments Bank',
  'Punjab & Sind Bank',
  'Punjab National Bank',
  'Paytm Payments Bank',
  'Qatar National Bank',
  'RBL Bank',
  'Resona Bank',
  'Sberbank',
  'SBM Bank (India)',
  'Shinhan Bank',
  'Shivalik Small Finance Bank',
  'Societe Generale',
  'South Indian Bank',
  'Standard Chartered Bank',
  'State Bank of India',
  'Sumitomo Mitsui Banking Corporation',
  'Suryoday Small Finance Bank',
  'Sonali Bank',
  'Tamilnad Mercantile Bank',
  'UCO Bank',
  'Ujjivan Small Finance Bank',
  'Union Bank of India',
  'Unity Small Finance Bank',
  'Utkarsh Small Finance Bank',
  'YES BANK',
  'UBS AG',
  'Woori Bank',
  'JSC VTB Bank',
].map((bank) => bank.trim()).sort((a, b) => a.localeCompare(b));

const profileRef = (userId: string) => doc(db, 'users', userId, 'private', 'teamProfile');

export async function getTeamMemberProfile(userId: string): Promise<TeamMemberProfile | null> {
  const snapshot = await getDoc(profileRef(userId));
  return snapshot.exists() ? snapshot.data() as TeamMemberProfile : null;
}

export async function saveTeamMemberProfile(
  userId: string,
  profile: TeamMemberProfile
): Promise<void> {
  await setDoc(profileRef(userId), {
    ...profile,
    updatedAt: new Date().toISOString(),
  });
}
