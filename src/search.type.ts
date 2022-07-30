export interface ShopeeSearchResult {
  bff_meta?: null;
  error?: null;
  error_msg?: null;
  reserved_keyword?: null;
  suggestion_algorithm?: null;
  algorithm: string;
  total_count: number;
  nomore: boolean;
  items?: ItemsEntity[] | null;
  price_adjust?: null;
  adjust: Adjust;
  total_ads_count: number;
  hint_keywords?: null;
  show_disclaimer: boolean;
  json_data: string;
  query_rewrite: QueryRewrite;
  disclaimer_infos?: null[] | null;
  need_next_search: boolean;
  low_result: LowResult;
  autoplay_info?: null;
  food_item_info: FoodItemInfo;
  search_tracking: string;
  search_sessionid?: null;
  batch_size: number;
  search_item_bff_tracking: string;
  user_info: UserInfo;
}
export interface ItemsEntity {
  item_basic: ItemBasic;
  adsid?: number | null;
  campaignid?: number | null;
  distance?: null;
  match_type?: number | null;
  ads_keyword?: string | null;
  deduction_info?: string | null;
  collection_id?: null;
  display_name?: null;
  campaign_stock?: null;
  json_data: string;
  tracking_info?: TrackingInfo | null;
  itemid: number;
  shopid: number;
  algo_image?: null;
  fe_flags?: null;
  item_type: number;
  foody_item?: null;
  search_item_tracking: string;
  bff_item_tracking: string;
  personalized_labels?: null;
  biz_json?: null;
}
export interface ItemBasic {
  itemid: number;
  shopid: number;
  name: string;
  label_ids?: number[] | null;
  image: string;
  images?: string[] | null;
  currency: string;
  stock: number;
  status: number;
  ctime: number;
  sold: number;
  historical_sold: number;
  liked: boolean;
  liked_count: number;
  view_count?: null;
  catid: number;
  brand: string;
  cmt_count: number;
  flag: number;
  cb_option: number;
  item_status: string;
  price: number;
  price_min: number;
  price_max: number;
  price_min_before_discount: number;
  price_max_before_discount: number;
  hidden_price_display?: null;
  price_before_discount: number;
  has_lowest_price_guarantee: boolean;
  show_discount: number;
  raw_discount: number;
  discount?: string | null;
  is_category_failed?: null;
  size_chart?: null;
  video_info_list?: VideoInfoListEntity[] | null;
  tier_variations?: TierVariationsEntity[] | null;
  item_rating: ItemRating;
  item_type: number;
  reference_item_id: string;
  transparent_background_image: string;
  is_adult: boolean;
  badge_icon_type: number;
  shopee_verified: boolean;
  is_official_shop: boolean;
  show_official_shop_label: boolean;
  show_shopee_verified_label: boolean;
  show_official_shop_label_in_title: boolean;
  is_cc_installment_payment_eligible: boolean;
  is_non_cc_installment_payment_eligible: boolean;
  coin_earn_label?: null;
  show_free_shipping: boolean;
  preview_info?: null;
  coin_info?: null;
  exclusive_price_info?: null;
  bundle_deal_id: number;
  can_use_bundle_deal: boolean;
  bundle_deal_info?: BundleDealInfo | null;
  is_group_buy_item?: null;
  has_group_buy_stock?: null;
  group_buy_info?: null;
  welcome_package_type: number;
  welcome_package_info?: null;
  add_on_deal_info?: null;
  can_use_wholesale: boolean;
  is_preferred_plus_seller: boolean;
  shop_location: string;
  has_model_with_available_shopee_stock: boolean;
  voucher_info?: VoucherInfo | null;
  can_use_cod: boolean;
  is_on_flash_sale: boolean;
  spl_installment_tenure?: null;
  is_live_streaming_price?: null;
  is_mart: boolean;
  pack_size?: null;
  deep_discount_skin?: null;
  is_service_by_shopee: boolean;
}
export interface VideoInfoListEntity {
  video_id: string;
  thumb_url: string;
  duration: number;
  version: number;
  vid: string;
  formats?: (FormatsEntityOrDefaultFormat | null)[] | null;
  default_format: FormatsEntityOrDefaultFormat1;
}
export interface FormatsEntityOrDefaultFormat {
  format: number;
  defn: string;
  profile: string;
  path: string;
  url: string;
  width: number;
  height: number;
}
export interface FormatsEntityOrDefaultFormat1 {
  format: number;
  defn: string;
  profile: string;
  path: string;
  url: string;
  width: number;
  height: number;
}
export interface TierVariationsEntity {
  name: string;
  options?: string[] | null;
  images?: string[] | null;
  properties?: null[] | null;
  type: number;
}
export interface ItemRating {
  rating_star: number;
  rating_count?: number[] | null;
  rcount_with_context: number;
  rcount_with_image: number;
}
export interface BundleDealInfo {
  bundle_deal_id: number;
  bundle_deal_label: string;
}
export interface VoucherInfo {
  promotion_id: number;
  voucher_code: string;
  label: string;
}
export interface TrackingInfo {
  viral_spu_tracking?: null;
  business_tracking?: null;
  multi_search_tracking?: null;
  groupid: number;
  ruleid?: number[] | null;
}
export interface Adjust {
  count?: null;
}
export interface QueryRewrite {
  fe_query_write_status: number;
  rewrite_keyword?: null;
  hint_keywords?: null;
  ori_keyword: string;
  ori_total_count: number;
  rewrite_type?: null;
}
export interface LowResult {
  triggered: boolean;
  scenarios?: null;
  total_organic_count: number;
  pre_lrp_total_organic_count: number;
}
export interface FoodItemInfo {
  total_count: number;
}
export interface UserInfo {
  user_type?: number[] | null;
}
