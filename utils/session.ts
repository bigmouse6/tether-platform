export function getSessionId(): string {
  
  let sessionId = localStorage.getItem('support_session_id');
  
  
  if (!sessionId) {
    sessionId = crypto.randomUUID(); 
    localStorage.setItem('support_session_id', sessionId);
  }
  
  return sessionId;
}


export function regenerateSessionId(): string {
  const sessionId = crypto.randomUUID();
  localStorage.setItem('support_session_id', sessionId);
  return sessionId;
}