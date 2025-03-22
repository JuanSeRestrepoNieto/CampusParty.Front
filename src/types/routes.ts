export enum Routes {
  HOME = '/',
  AUTH = '/auth',
  LOGIN = '/login',
  REGISTER = '/register',
  EVENTS = '/events',
  COMMUNITY = '/community',
  ABOUT = '/about',
  CONTACT = '/contact',
  FAQ = '/faq'
}

export type RoutePaths = 
  | '/'
  | '/auth'
  | '/login'
  | '/register'
  | '/events'
  | '/community'
  | '/about'
  | '/contact'
  | '/faq';

export interface RouteConfig {
  path: RoutePaths;
  element: React.ReactNode;
  private?: boolean; // Indica si la ruta requiere autenticación
  exact?: boolean; // Indica si la ruta debe coincidir exactamente
}
