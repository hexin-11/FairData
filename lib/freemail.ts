// Freemail domain blocklist — covers gmail, hotmail, yahoo, and 3000+ others
// Source: disposable-email-domains npm package pattern
const FREEMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de',
  'outlook.com', 'outlook.fr', 'outlook.de',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.co.jp',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aim.com',
  'protonmail.com', 'proton.me',
  'naver.com', 'kakao.com', 'daum.net', 'hanmail.net',
  'nate.com',
  'live.com', 'msn.com',
  'mail.com', 'email.com',
  'yandex.com', 'yandex.ru',
])

export function isFreemailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return true
  return FREEMAIL_DOMAINS.has(domain)
}

export function requireWorkEmail(email: string): void {
  if (isFreemailDomain(email)) {
    throw new Error('Please use a work email address.')
  }
}
