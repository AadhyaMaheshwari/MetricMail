import LABEL_RULES from './labelRules.js';

function getHeader(headers, name) {
  const h = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return h ? h.value : '';
}

function extractDomain(from) {
  const match = from.match(/@([\w.-]+)/);
  return match ? match[1].toLowerCase() : '';
}

function classifyEmail(headers) {
  const from    = getHeader(headers, 'From').toLowerCase();
  const subject = getHeader(headers, 'Subject').toLowerCase();
  const domain  = extractDomain(from);

  for (const rule of LABEL_RULES) {
    if (rule.domains.length && rule.domains.some(d => domain === d || domain.endsWith('.' + d)))
      return rule.key;

    if (rule.domainPattern && rule.domainPattern.test(domain))
      return rule.key;

    if (rule.subjects.some(s => subject.includes(s.toLowerCase())))
      return rule.key;

    if (rule.headers.length) {
      const hit = rule.headers.some(h => getHeader(headers, h.split(':')[0].trim()) !== '');
      if (hit) return rule.key;
    }
  }
  return null;
}
export { classifyEmail, extractDomain, getHeader };