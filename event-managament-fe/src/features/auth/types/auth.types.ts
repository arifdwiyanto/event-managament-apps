export interface SignUp {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
  terms?: boolean;
  role: "CUSTOMER" | "ORGANIZER";
  organizerName?: string;
  organizerDescription?: string;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  avatarUrl:string;
  email: string;
  roles: string[];
  organizer?: {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    createdAt:string;
    isVerified:boolean;
    teams?: {
      role: string;
      user: {
        id: string;
        name: string;
      };
    }[];
  } | null;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  isAuthenticated: boolean;

  signUp: (data: SignUp) => Promise<boolean>;
  signIn: (data: SignIn) => Promise<boolean>;
  me: () => Promise<AuthUser | null>;
  signOut: () => Promise<boolean>;
}
