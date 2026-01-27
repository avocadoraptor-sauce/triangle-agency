/* Eventually generate this from proto or other codegen */

export type MissionImage = {
  image_type: string;
  asset_id: string;
  url: string;
};

export type MissionPublic = {
  mission: number;
  chaos_pool: number;
  loose_ends: number;
  image: MissionImage;
  description: string;
};

export type DMViewProps = {
  /* Add other stuff */
  mission: MissionPublic;
};