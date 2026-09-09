export interface Colorway {
  id: string;
  name: string;
  name_ar: string;
  hex_code: string;
  image?: string;
  stock: number;
  is_default: boolean;
}

export interface ScentNotes {
  top_notes?: string;
  top_notes_ar?: string;
  heart_notes?: string;
  heart_notes_ar?: string;
  base_notes?: string;
  base_notes_ar?: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: string | number;
  name: string;
  name_ar: string;
  slug: string;
  product_type: 'diffuser' | 'oil' | 'bundle';
  price: string;
  final_price: string;
  has_discount: boolean;
  rating: number;
  reviews_count: number;
  main_image?: string;
  secondary_images?: string[];
  description?: string;
  description_ar?: string;
  subtitle_ar?: string;
  category?: Category;
  category_name?: string;
  category_name_ar?: string;
  colorways?: Colorway[];
  scent_notes?: ScentNotes;
  stock: number;
  is_featured: boolean;
  is_in_stock: boolean;
  is_active?: boolean;
  discount_price?: string | number;
  coverage_area?: string;
  coverage_m3?: number;
  capacity?: string;
  capacity_ml?: number;
  noise_level?: string;
  noise_db?: number;
  power_spec?: string;
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  product: Product;
  colorway?: Colorway | null;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface Cart {
  id?: string;
  session_id?: string;
  items: CartItem[];
  subtotal: string;
  delivery_fee: string;
  total: string;
  total_items: number;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  is_staff: boolean;
}

export interface OrderItem {
  id: string;
  product_name: string;
  colorway_name?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  subtotal: string;
  delivery_fee: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_city: string;
  shipping_address: string;
  shipping_notes?: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export interface Faq {
  id: number | string;
  category: string;
  question_ar: string;
  question_en?: string;
  answer_ar: string;
  answer_en?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  is_active: boolean;
}
