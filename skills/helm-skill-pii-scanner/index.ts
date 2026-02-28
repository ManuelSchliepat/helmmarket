// Luhn algorithm implementation
function isValidLuhn(num: string): boolean {
  let sum = 0;
  let isEven = false;
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export interface PiiFinding {
  type: string;
  value: string;
  position: number;
  gdprRelevant: boolean;
}

export interface PiiScanResult {
  hasPii: boolean;
  findings: PiiFinding[];
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  gdprCategories: string[];
}

const PII_PATTERNS = [
  { type: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, gdpr: true, category: 'Personal Data' },
  { type: 'PHONE_EU', regex: /(?:^|\s)(?:\+|00)(?:49|33|44|31|34|39|41|43|45|46|47|48)\s*(?:\(?\d{1,4}\)?[\s\-]*)?\d{3,4}[\s\-]*\d{3,4}[\s\-]*\d{0,4}(?=$|\s|\b)/g, gdpr: true, category: 'Personal Data' },
  { type: 'PHONE_US', regex: /(?:^|\s)(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}(?=$|\s|\b)/g, gdpr: true, category: 'Personal Data' },
  { type: 'IBAN', regex: /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/g, gdpr: true, category: 'Financial Data' },
  { type: 'IP_ADDRESS', regex: /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}/g, gdpr: true, category: 'Online Identifiers' },
  { type: 'CREDIT_CARD', regex: /(?:\d[ -]*?){13,19}/g, gdpr: true, category: 'Financial Data' },
  { type: 'DATE_OF_BIRTH', regex: /(?:0[1-9]|[12][0-9]|3[01])[-/.](?:0[1-9]|1[012])[-/.](?:19|20)\d\d|(?:19|20)\d\d[-/.](?:0[1-9]|1[012])[-/.](?:0[1-9]|[12][0-9]|3[01])/g, gdpr: true, category: 'Demographic Data' },
  { type: 'GERMAN_ID', regex: /[LMT][A-Z0-9]{8}[D]/g, gdpr: true, category: 'Government Identifiers' },
  { type: 'POSTCODE_DE', regex: /\b\d{5}\b/g, gdpr: false, category: 'Location Data' }
];

export async function scanText(text: string): Promise<PiiScanResult> {
  const findings: PiiFinding[] = [];
  const categories = new Set<string>();
  
  for (const pattern of PII_PATTERNS) {
    let match;
    // Reset regex index
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(text)) !== null) {
      let isFindingValid = true;
      const value = match[0];
      
      if (pattern.type === 'CREDIT_CARD') {
        const cleanNumber = value.replace(/[\s-]/g, '');
        if (cleanNumber.length >= 13 && cleanNumber.length <= 19) {
          isFindingValid = isValidLuhn(cleanNumber);
        } else {
          isFindingValid = false;
        }
      }
      
      if (pattern.type === 'IBAN') {
         // simple check to avoid catching pure numbers
         if (!/^[a-zA-Z]{2}/.test(value)) isFindingValid = false;
      }
      
      if (isFindingValid) {
        findings.push({
          type: pattern.type,
          value,
          position: match.index,
          gdprRelevant: pattern.gdpr
        });
        
        if (pattern.gdpr) {
          categories.add(pattern.category);
        }
      }
    }
  }
  
  const hasPii = findings.length > 0;
  
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (hasPii) {
    if (findings.some(f => f.type === 'CREDIT_CARD' || f.type === 'GERMAN_ID')) {
      riskLevel = 'high';
    } else if (findings.some(f => f.type === 'IBAN' || f.type === 'EMAIL' || f.type === 'PHONE_EU')) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
  }

  return {
    hasPii,
    findings,
    riskLevel,
    gdprCategories: Array.from(categories)
  };
}

export async function redactText(text: string, replacementChar: string = '*') {
  const scanResult = await scanText(text);
  let redacted = text;
  
  // Sort findings by position descending to avoid offset issues when replacing
  const sortedFindings = [...scanResult.findings].sort((a, b) => b.position - a.position);
  
  for (const finding of sortedFindings) {
    const replacement = replacementChar.repeat(finding.value.length);
    redacted = redacted.substring(0, finding.position) + replacement + redacted.substring(finding.position + finding.value.length);
  }
  
  return {
    redacted,
    replacedCount: scanResult.findings.length,
    types: Array.from(new Set(scanResult.findings.map(f => f.type)))
  };
}

export async function scanObject(obj: Record<string, unknown>) {
  const affectedPaths: string[] = [];
  const findings: Record<string, PiiScanResult> = {};
  
  async function traverse(currentObj: any, currentPath: string) {
    if (currentObj === null || currentObj === undefined) return;
    
    if (typeof currentObj === 'string') {
      const result = await scanText(currentObj);
      if (result.hasPii) {
        affectedPaths.push(currentPath);
        findings[currentPath] = result;
      }
    } else if (Array.isArray(currentObj)) {
      for (let i = 0; i < currentObj.length; i++) {
        await traverse(currentObj[i], `${currentPath}[${i}]`);
      }
    } else if (typeof currentObj === 'object') {
      for (const [key, value] of Object.entries(currentObj)) {
        const nextPath = currentPath ? `${currentPath}.${key}` : key;
        await traverse(value, nextPath);
      }
    }
  }
  
  await traverse(obj, '');
  
  return {
    hasPii: affectedPaths.length > 0,
    affectedPaths,
    findings
  };
}

export const plugin = {
  name: 'helm-skill-pii-scanner',
  operations: {
    scanText: { permission: 'ask', handler: scanText },
    redactText: { permission: 'ask', handler: redactText },
    scanObject: { permission: 'ask', handler: scanObject }
  }
};
