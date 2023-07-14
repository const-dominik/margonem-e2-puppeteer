declare global {
  interface Window {
    chatSend: (message: string) => void;
    newNpc: (mobs: Record<number, Mob>) => void;
    mAlert: (alert: string) => void;
    g: {
      init: number
      lock: {
        add: (arg: string) => void;
        remove: (arg: string) => void;
     }
    };
    map: {
      loaded: boolean
    };
    hero: {
      x: number,
      y: number
    };
    road: [];
    
  }
}

export type Catch = "nothing" | "all" | "legend-only"

export type Account = {
  login: string,
  password: string,
  catch: Catch
}

export type Mob = {
  icon: string,
  id: string,
  wt: number,
  x: number,
  y: number,
  del?: number
}

export type Accounts = Record<string, Account>
