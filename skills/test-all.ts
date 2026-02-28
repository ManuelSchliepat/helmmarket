import { searchByCve } from './helm-skill-cve-scanner/index.ts';
import { convert } from './helm-skill-currency/index.ts';
import { getWeatherByCity } from './helm-skill-weather/index.ts';
import { redactText } from './helm-skill-pii-scanner/index.ts';
import { fullEmailSecurityAudit } from './helm-skill-dns-check/index.ts';

async function runTests() {
  console.log("--- TESTING helm-skill-cve-scanner ---");
  try {
    const cveResult = await searchByCve('CVE-2021-44228'); // Log4Shell
    console.log(`CVE: ${cveResult?.id}, Severity: ${cveResult?.severity}, Score: ${cveResult?.cvssScore}`);
  } catch (e: any) {
    console.error("CVE Scanner Failed:", e.message);
  }

  console.log("\n--- TESTING helm-skill-currency ---");
  try {
    const currencyResult = await convert(100, 'USD', 'EUR');
    console.log(`100 USD = ${currencyResult.result.toFixed(2)} EUR (Rate: ${currencyResult.rate})`);
  } catch (e: any) {
    console.error("Currency Failed:", e.message);
  }

  console.log("\n--- TESTING helm-skill-weather ---");
  try {
    const weatherResult = await getWeatherByCity('Berlin');
    console.log(`Berlin Weather: ${weatherResult.temperature}°C, ${weatherResult.weatherDescription}, Wind: ${weatherResult.windSpeed}km/h`);
  } catch (e: any) {
    console.error("Weather Failed:", e.message);
  }

  console.log("\n--- TESTING helm-skill-pii-scanner ---");
  try {
    const textToScan = "Hello, contact me at john.doe@example.com or call +49 151 1234567. My credit card is 4532 1111 2222 3333.";
    const piiResult = await redactText(textToScan);
    console.log("Original: " + textToScan);
    console.log("Redacted: " + piiResult.redacted);
    console.log(`Found ${piiResult.replacedCount} PII elements of types: ${piiResult.types.join(', ')}`);
  } catch (e: any) {
    console.error("PII Scanner Failed:", e.message);
  }

  console.log("\n--- TESTING helm-skill-dns-check ---");
  try {
    const dnsResult = await fullEmailSecurityAudit('github.com');
    console.log(`github.com Email Security Grade: ${dnsResult.grade} (Score: ${dnsResult.score})`);
    console.log(`SPF Status: ${dnsResult.spf.securityLevel}`);
  } catch (e: any) {
    console.error("DNS Check Failed:", e.message);
  }
}

runTests();
