export async function lookup(domain: string, type: string = 'A') {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/dns-json'
    }
  });

  if (!response.ok) {
    throw new Error(`Cloudflare DNS API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  let status = "NOERROR";
  if (data.Status === 3) status = "NXDOMAIN";
  else if (data.Status === 2) status = "SERVFAIL";

  return {
    domain,
    type,
    status,
    records: (data.Answer || []).map((a: any) => ({
      value: a.data,
      ttl: a.TTL
    }))
  };
}

export async function checkMxRecords(domain: string) {
  const result = await lookup(domain, 'MX');
  
  const mxRecords = result.records.map(r => {
    // Cloudflare returns MX data like "10 mail.example.com."
    const parts = r.value.split(' ');
    if (parts.length === 2) {
      return {
        priority: parseInt(parts[0], 10),
        exchange: parts[1],
        ttl: r.ttl
      };
    }
    return { priority: 0, exchange: r.value, ttl: r.ttl };
  });

  // Sort by priority
  mxRecords.sort((a, b) => a.priority - b.priority);

  return {
    domain,
    hasMailServer: mxRecords.length > 0,
    mxRecords
  };
}

export async function checkSpf(domain: string) {
  const result = await lookup(domain, 'TXT');
  
  let spfRecord: string | null = null;
  for (const r of result.records) {
    const value = r.value.replace(/^"|"$/g, ''); // Remove quotes if present
    if (value.startsWith('v=spf1')) {
      spfRecord = value;
      break;
    }
  }

  if (!spfRecord) {
    return {
      domain,
      hasSPF: false,
      spfRecord: null,
      includes: [],
      ip4: [],
      ip6: [],
      allPolicy: null,
      securityLevel: 'missing'
    };
  }

  const parts = spfRecord.split(/\s+/);
  const includes = parts.filter(p => p.startsWith('include:')).map(p => p.substring(8));
  const ip4 = parts.filter(p => p.startsWith('ip4:')).map(p => p.substring(4));
  const ip6 = parts.filter(p => p.startsWith('ip6:')).map(p => p.substring(4));
  
  let allPolicy: string | null = null;
  const allMatch = parts.find(p => p.endsWith('all'));
  if (allMatch) {
    allPolicy = allMatch;
  }

  let securityLevel: 'good' | 'weak' | 'missing' = 'missing';
  if (allPolicy === '-all') securityLevel = 'good';
  else if (allPolicy === '~all') securityLevel = 'weak';

  return {
    domain,
    hasSPF: true,
    spfRecord,
    includes,
    ip4,
    ip6,
    allPolicy,
    securityLevel
  };
}

export async function checkDkim(domain: string, selector: string = 'default') {
  const result = await lookup(`${selector}._domainkey.${domain}`, 'TXT');
  
  if (result.records.length === 0) {
    return {
      domain,
      selector,
      hasDKIM: false,
      publicKey: null,
      keyType: null
    };
  }

  const value = result.records[0].value.replace(/^"|"$/g, '');
  const parts = value.split(';');
  
  let keyType = null;
  let publicKey = null;

  for (const part of parts) {
    const p = part.trim();
    if (p.startsWith('k=')) keyType = p.substring(2);
    if (p.startsWith('p=')) publicKey = p.substring(2);
  }

  return {
    domain,
    selector,
    hasDKIM: !!publicKey,
    publicKey,
    keyType: keyType || 'rsa' // default is usually RSA if not specified
  };
}

export async function fullEmailSecurityAudit(domain: string) {
  const [mx, spf, dkim] = await Promise.all([
    checkMxRecords(domain),
    checkSpf(domain),
    checkDkim(domain, 'google') // Many modern domains use google or selector1. We'll check default first.
  ]);

  let score = 0;
  const recommendations: string[] = [];

  if (mx.hasMailServer) {
    score += 25;
  } else {
    recommendations.push("Configure MX records to enable email receiving.");
  }

  if (spf.hasSPF) {
    if (spf.securityLevel === 'good') {
      score += 25;
    } else {
      score += 15;
      recommendations.push("Update SPF record to end with '-all' (HardFail) instead of '~all' (SoftFail) or '?all' (Neutral).");
    }

    // Basic check for popular providers
    if (spf.includes.some(inc => inc.includes('google') || inc.includes('outlook') || inc.includes('sendgrid'))) {
      score += 25;
    } else {
      score += 10; // Still giving some points for having includes
      recommendations.push("Ensure all third-party email senders are included in the SPF record.");
    }
  } else {
    recommendations.push("Create an SPF (Sender Policy Framework) record to prevent domain spoofing.");
  }

  // DKIM check might fail if we don't know the exact selector.
  // We check 'default' in the background as a fallback.
  let dkimResult = dkim;
  if (!dkim.hasDKIM) {
    const fallbackDkim = await checkDkim(domain, 'default');
    if (fallbackDkim.hasDKIM) dkimResult = fallbackDkim;
  }

  if (dkimResult.hasDKIM) {
    score += 25;
  } else {
    recommendations.push("Configure DKIM (DomainKeys Identified Mail) signing for outgoing emails. (Note: accurate check requires the exact selector used by your provider)");
  }

  // Ensure score is within 0-100
  score = Math.min(100, Math.max(0, score));

  let grade: "A" | "B" | "C" | "D" | "F" = "F";
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 50) grade = "C";
  else if (score >= 25) grade = "D";

  return {
    domain,
    score,
    grade,
    mx,
    spf,
    dkim: dkimResult,
    recommendations
  };
}

export const plugin = {
  name: 'helm-skill-dns-check',
  operations: {
    lookup: { permission: 'allow', handler: lookup },
    checkMxRecords: { permission: 'allow', handler: checkMxRecords },
    checkSpf: { permission: 'allow', handler: checkSpf },
    checkDkim: { permission: 'allow', handler: checkDkim },
    fullEmailSecurityAudit: { permission: 'ask', handler: fullEmailSecurityAudit }
  }
};
