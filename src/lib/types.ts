/**
 * Shapes returned by portal.revun.com — the same API the MoveSmart Rentals
 * site reads. Only the fields this site uses are typed; the rest pass through.
 */

export interface PortalMedia {
  id: number;
  property_id: number;
  is_building?: number;
  category: string | null;
  sort_order: number | null;
  file_path: string | null;
  file_type: string | null;
  external_link: string | null;
}

export interface PortalBuilding {
  id: number;
  building_name: string | null;
  street_number?: string | null;
  street_name?: string | null;
  city: string | null;
  province: string | null;
  postal_code?: string | null;
  neighbourhood?: string | null;
  cross_street?: string | null;
  elementary_school?: string | null;
  high_school?: string | null;
  year_built?: string | null;
  pets_allowed?: string | null;
  cover_photo_url?: string | null;
  cover_thumb?: string | null;
  media?: PortalMedia[];
  [key: string]: unknown;
}

/**
 * A listing card. At The Bellmont every card is an "advert": one listing that
 * stands for every room (Tower A) or suite (Tower B) of one kind on a band of
 * floors. Its id is an advert id, so the tour endpoints are asked by slug.
 */
export interface PortalListing {
  kind?: "unit" | "advert";
  id: number;
  advert_id?: number;
  advert_code?: string;
  slug: string;
  unit_name: string;
  unit_address: string;
  where?: string | null;
  website_price: number | string | null;
  website_description?: string | null;
  number_of_bedrooms?: string | null;
  number_of_bathrooms?: string | null;
  number_of_parking_spots?: string | null;
  property_type?: string | null;
  property_sub_type?: string | null;
  show_unit_id?: number | null;
  cover_thumb?: string | null;
  cover_photo_url?: string | null;
  status?: string | null;
  available_count?: number;
  upcoming_count?: number;
  describes?: string | null;
  badge?: string | null;
  url?: string;
  [key: string]: unknown;
}

export interface PortalListingDetail extends PortalListing {
  unit_number?: string | null;
  description?: string | null;
  description_html?: string | null;
  availability?: string | null;
  available_date?: string | null;
  approximate_square_footage?: number | string | null;
  building?: PortalBuilding;
  media?: PortalMedia[];
  latitude?: string | null;
  longitude?: string | null;
}

export interface PortalListResponse {
  data: PortalListing[];
  current_page?: number;
  last_page?: number;
  next_page?: number | null;
}

export interface PortalDetailResponse {
  status: boolean;
  data: {
    unit: PortalListingDetail;
    similar_properties?: PortalListing[];
  };
}
