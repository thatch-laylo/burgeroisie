export interface Member {
  id: string;
  name: string;
  emoji: string;
  isGuest: boolean;
}

export interface MemberScore {
  memberId: string;
  burgerScore: number; // 0-90
  ambianceScore: number; // 0-10
  totalScore: number; // burgerScore + ambianceScore
}

export interface Comment {
  id: string;
  memberId: string;
  text: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  restaurantName: string;
  neighborhood: string;
  address: string;
  date: string; // YYYY-MM-DD
  scores: MemberScore[];
  averageScore: number;
  comments: Comment[];
  photoIds: string[];
  burgerDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BurgerData {
  members: Member[];
  visits: Visit[];
  version: number;
}
