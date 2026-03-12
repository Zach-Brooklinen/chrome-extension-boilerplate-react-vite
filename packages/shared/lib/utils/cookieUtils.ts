export function checkCookie(cookieName: string): boolean {
  return document.cookie.indexOf(cookieName + '=') > -1;
}
