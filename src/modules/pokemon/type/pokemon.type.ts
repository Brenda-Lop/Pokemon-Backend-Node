export type PokemonTypes = {
  id: number;
  name: string;
  created_at: Date;
};

export type PaginationPayload = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
};
