export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface UserContext {
  id: string;
  profile: { id: string; code: string; label: string };
  role?: { id: string; code: string; label: string };
  shop?: { id: string; name: string; status: string };
}

export interface AuthData {
  user: User;
  context: UserContext;
}

export interface ShopAuthData extends AuthData {
  shop: { id: string; name: string; status: string };
}
