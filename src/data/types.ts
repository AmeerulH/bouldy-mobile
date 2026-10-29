export type UserResponse = {
  id: number;
  username: string;
  email: string;
  current_grade: string | null;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type Gym = {
  id: number;
  name: string;
  location: string;
};

export type RouteStatus = "active" | "retired";

export type Route = {
  id: number;
  gym_id: number;
  route_name: string;
  grade: string;
  colour: string | null;
  wall: string | null;
  setter: string | null;
  set_date: string | null;
  retired_date: string | null;
  status: RouteStatus;
  styles: string[];
  /** Planned backend field; absent until competition classification is supported. */
  is_competition?: boolean;
};

export type Session = {
  id: number;
  user_id: number;
  gym_id: number;
  session_date: string;
  duration_minutes: number;
  notes: string | null;
};

export type AttemptResult = "flash" | "zone" | "send" | "project";

export type Attempt = {
  id: number;
  session_id: number;
  route_id: number;
  num_attempts: number;
  result: AttemptResult;
  notes: string | null;
};
