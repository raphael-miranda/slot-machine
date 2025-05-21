export class SessionStore {
  private static instance: SessionStore;
  private sessions: { [key: string]: { credits: number; isActive: boolean } } = {};

  private constructor() {
  }

  public static getInstance(): SessionStore {
    if (!SessionStore.instance) {
      SessionStore.instance = new SessionStore();
    }
    return SessionStore.instance;
  }

  public getSessions() {
    return this.sessions;
  }

  public resetSessions() {
    this.sessions = {};
  }
}

export const sessionStore = SessionStore.getInstance();