export function getSessionId(): string {
  
  let sessionId = localStorage.getItem('support_session_id');
  
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('support_session_id', sessionId);
    console.log('A new session has been created:', sessionId); 
  } else {
    console.log('Current session:', sessionId); 
  }
  
  return sessionId;
}


export function clearSession() {
  localStorage.removeItem('support_session_id');
  console.log('Session deleted');
}