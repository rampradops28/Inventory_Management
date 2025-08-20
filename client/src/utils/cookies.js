export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  }
  
  export function setCookie(name, value, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};path=/;SameSite=Strict;${location.protocol === "https:" ? "Secure;" : ""}expires=${d.toUTCString()}`;
  }
  
  export function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
  }
  