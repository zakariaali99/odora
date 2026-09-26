export interface Colorway {
  id: string;
  name: string;
  name_ar: string;
  hex_code: string;
  image: string | null;
  is_default: boolean;
}

export interface ScentNotes {
  id?: string;
  scent_family?: string;
  scent_family_ar?: string;
  top_notes: string;
  top_notes_ar: string;
  heart_notes: string;
  heart_notes_ar: string;
  base_notes?: string;
  base_notes_ar?: string;
}

export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  name_ar: string;
  product_type: 'diffuser' | 'oil' | 'bundle' | 'accessory';
  category?: string;
  category_name?: string;
  category_name_ar?: string;
  category_slug: string;
  subtitle: string;
  subtitle_ar: string;
  price: string;
  discount_price: string | null;
  final_price: string;
  has_discount: boolean;
  stock: number;
  sku?: string;
  main_image: string | null;
  is_featured: boolean;
  rating?: string | number;
  reviews_count?: number;
  colorways: Colorway[];
  capacity: string;
  scent_notes: ScentNotes | null;
  created_at?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_ar: string;
  products_count: number;
  order: number;
  description?: string;
  description_ar?: string;
  image?: string | null;
  is_active?: boolean;
}

export interface City {
  key: string;
  ar: string;
  en: string;
}

export interface BusinessConfig {
  currency: 'LYD';
  currency_symbol_ar: string;
  currency_symbol_en: string;
  delivery_fee: string;
  free_delivery_threshold: string;
  cod_enabled: boolean;
  card_enabled: boolean;
  warranty_months: number | null;
  whatsapp_number: string | null;
  cities: City[];
}

export interface CartItem {
  id: string;
  product: ProductListItem;
  colorway: Colorway | null;
  quantity: number;
  unit_price: string;
  line_total: string;
  total_price?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  subtotal: string;
  delivery_fee: string;
  free_delivery_remaining: string;
  total_price: string;
  created_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
