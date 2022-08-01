export interface ShopeeProductData {
  error?: null;
  error_msg?: null;
  data: Data;
  is_indexable: boolean;
}
export interface Data {
  itemid: number;
  shopid: number;
  userid: number;
  price_max_before_discount: number;
  has_lowest_price_guarantee: boolean;
  price_before_discount: number;
  price_min_before_discount: number;
  exclusive_price_info?: null;
  hidden_price_display?: null;
  price_min: number;
  price_max: number;
  price: number;
  stock: number;
  discount: string;
  historical_sold: number;
  sold: number;
  show_discount: number;
  raw_discount: number;
  min_purchase_limit: number;
  overall_purchase_limit: OverallPurchaseLimit;
  pack_size?: null;
  is_live_streaming_price?: null;
  name: string;
  ctime: number;
  item_status: string;
  status: number;
  condition: number;
  catid: number;
  description: string;
  is_mart: boolean;
  rich_text_description?: null;
  show_shopee_verified_label: boolean;
  size_chart?: null;
  reference_item_id: string;
  brand: string;
  item_rating: ItemRating;
  label_ids?: number[] | null;
  attributes?: AttributesEntity[] | null;
  liked: boolean;
  liked_count: number;
  cmt_count: number;
  flag: number;
  shopee_verified: boolean;
  is_adult: boolean;
  is_preferred_plus_seller: boolean;
  tier_variations?: TierVariationsEntity[] | null;
  bundle_deal_id: number;
  can_use_bundle_deal: boolean;
  size_chart_info?: null;
  add_on_deal_info?: null;
  bundle_deal_info?: null;
  can_use_wholesale: boolean;
  wholesale_tier_list?: null[] | null;
  is_group_buy_item?: null;
  group_buy_info?: null;
  welcome_package_type: number;
  welcome_package_info?: null;
  tax_code?: null;
  invoice_option?: null;
  complaint_policy?: null;
  wp_eligibility?: null;
  images?: string[] | null;
  image: string;
  video_info_list?: null;
  item_type: number;
  is_official_shop: boolean;
  show_official_shop_label_in_title: boolean;
  shop_location: string;
  coin_earn_label?: null;
  cb_option: number;
  is_pre_order: boolean;
  estimated_days: number;
  badge_icon_type: number;
  show_free_shipping: boolean;
  shipping_icon_type: number;
  cod_flag: number;
  is_service_by_shopee: boolean;
  show_original_guarantee: boolean;
  categories?: CategoriesEntityOrFeCategoriesEntity[] | null;
  other_stock: number;
  item_has_post: boolean;
  discount_stock: number;
  current_promotion_has_reserve_stock: boolean;
  current_promotion_reserved_stock: number;
  normal_stock: number;
  brand_id: number;
  is_alcohol_product: boolean;
  show_recycling_info: boolean;
  coin_info: CoinInfo;
  models?: ModelsEntity[] | null;
  spl_info?: null;
  preview_info?: null;
  fe_categories?: CategoriesEntityOrFeCategoriesEntity[] | null;
  presale_info?: null;
  show_best_price_guarantee: boolean;
  item_has_video: boolean;
  is_cc_installment_payment_eligible: boolean;
  is_non_cc_installment_payment_eligible: boolean;
  flash_sale?: null;
  upcoming_flash_sale?: null;
  deep_discount?: null;
  has_low_fulfillment_rate: boolean;
  is_partial_fulfilled: boolean;
  makeups?: null;
  shop_vouchers?: ShopVouchersEntity[] | null;
  credit_insurance_data: CreditInsuranceData;
  global_sold: number;
  is_infant_milk_formula_product: boolean;
  should_show_amp_tag: boolean;
  sorted_variation_image_index_list?: null;
  lowest_past_price?: null;
  is_prescription_item: boolean;
}
export interface OverallPurchaseLimit {
  order_max_purchase_limit: number;
  overall_purchase_limit?: null;
  item_overall_quota?: null;
  start_date?: null;
  end_date?: null;
}
export interface ItemRating {
  rating_star: number;
  rating_count?: number[] | null;
}
export interface AttributesEntity {
  name: string;
  value: string;
  id: number;
  is_timestamp: boolean;
  brand_option?: null;
  val_id?: null;
}
export interface TierVariationsEntity {
  name: string;
  options?: string[] | null;
  images?: null;
  properties?: null;
  type: number;
  summed_stocks?: null;
}
export interface CategoriesEntityOrFeCategoriesEntity {
  catid: number;
  display_name: string;
  no_sub: boolean;
  is_default_subcat: boolean;
}
export interface CoinInfo {
  spend_cash_unit: number;
  coin_earn_items?: CoinEarnItemsEntity[] | null;
}
export interface CoinEarnItemsEntity {
  coin_earn: number;
}
export interface ModelsEntity {
  itemid: number;
  status: number;
  current_promotion_reserved_stock: number;
  name: string;
  promotionid: number;
  price: number;
  price_stocks?: PriceStocksEntity[] | null;
  current_promotion_has_reserve_stock: boolean;
  normal_stock: number;
  extinfo: Extinfo;
  price_before_discount: number;
  modelid: number;
  stock: number;
  has_gimmick_tag: boolean;
  key_measurement?: null;
}
export interface PriceStocksEntity {
  allocated_stock?: number | null;
  stock_breakdown_by_location?: StockBreakdownByLocationEntity[] | null;
}
export interface StockBreakdownByLocationEntity {
  location_id: string;
  available_stock: number;
  fulfilment_type: number;
  address_id?: number | null;
}
export interface Extinfo {
  tier_index?: number[] | null;
  group_buy_info?: null;
  is_pre_order: boolean;
  estimated_days: number;
}
export interface ShopVouchersEntity {
  promotionid: number;
  voucher_code: string;
  signature: string;
  use_type?: null;
  platform_type?: null;
  voucher_market_type?: null;
  min_spend: number;
  used_price?: null;
  current_spend?: null;
  product_limit: boolean;
  quota_type: number;
  percentage_claimed: number;
  percentage_used: number;
  start_time: number;
  end_time: number;
  collect_time?: null;
  claim_start_time?: null;
  valid_days?: null;
  reward_type: number;
  reward_percentage?: null;
  reward_value?: null;
  reward_cap?: null;
  coin_earned?: null;
  title?: null;
  use_link?: null;
  icon_hash: string;
  icon_text: string;
  icon_url?: null;
  customised_labels?: null[] | null;
  customised_product_scope_tags?: null;
  shop_id: number;
  shop_name?: null;
  is_shop_preferred: boolean;
  is_shop_official: boolean;
  shop_count?: null;
  ui_display_type?: null;
  customised_mall_name?: null;
  small_icon_list?: null;
  dp_category_name?: null;
  invalid_message_code?: null;
  invalid_message?: null;
  display_labels?: null;
  wallet_redeemable?: null;
  customer_reference_id?: null;
  fully_redeemed?: null;
  has_expired?: null;
  disabled?: null;
  voucher_external_market_type?: null;
  now_food_extra_info?: null;
  airpay_opv_extra_info?: null;
  partner_extra_info?: null;
  discount_value: number;
  discount_percentage: number;
  discount_cap: number;
  coin_percentage?: null;
  coin_cap?: null;
  usage_limit?: null;
  used_count?: null;
  left_count?: null;
  shopee_wallet_only?: null;
  new_user_only?: null;
  description?: null;
  shop_logo?: null;
  error_code: number;
  is_claimed_before: boolean;
}
export interface CreditInsuranceData {
  insurance_products?: null[] | null;
}
