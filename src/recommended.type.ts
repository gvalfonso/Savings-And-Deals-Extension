export interface RecommendedSearchType {
  bff_meta?: null;
  error: number;
  error_msg?: null;
  data: Data;
}
export interface Data {
  update_time: number;
  version: string;
  sections?: SectionsEntity[] | null;
  expire: number;
  tab_meta_data?: null;
  misc_info?: null;
  realtime_meta_data: RealtimeMetaData;
  user_meta_data: UserMetaData;
}
export interface SectionsEntity {
  total: number;
  key: string;
  index?: IndexEntity[] | null;
  data: Data1;
  item_card_type: string;
  section_meta_data?: null;
  has_more: boolean;
  pagination_type: string;
}
export interface IndexEntity {
  data_type: string;
  key: string;
  filtered?: null;
  filtered_dunit?: null;
}
export interface Data1 {
  item?: ItemEntity[] | null;
  keyword?: null;
  ads?: AdsEntity[] | null;
  top_product?: null;
  collection?: null;
  item_lite?: null;
  video?: null;
  voucher?: null;
  voucher_detail?: null;
  l1cat?: null;
  collection_lite?: null;
  l2cat?: null;
  shop?: null;
  shop_lite?: null;
  shopcat?: null;
  feed?: null;
  feed_tab?: null;
  stream?: null;
  promotion?: null;
  knode?: null;
  food_item?: null;
  l3cat?: null;
}
export interface ItemEntity {
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
  video_info_list?: (VideoInfoListEntity | null)[] | null;
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
  add_on_deal_info?: AddOnDealInfo | null;
  can_use_wholesale: boolean;
  is_preferred_plus_seller: boolean;
  shop_location: string;
  has_model_with_available_shopee_stock: boolean;
  voucher_info?: VoucherInfo | null;
  is_on_flash_sale: boolean;
  spl_installment_tenure?: null;
  is_live_streaming_price?: null;
  shop_name: string;
  shop_rating: number;
  is_mart: boolean;
  pack_size?: null;
  overlay_image?: null;
  autogen_title?: null;
  autogen_title_id?: null;
  overlay_id?: null;
  is_service_by_shopee: boolean;
  flash_sale_stock: number;
  info: string;
  data_type: string;
  key: string;
  count: number;
  adsid: number;
  campaignid: number;
  deduction_info: string;
  video_display_control: number;
  deep_discount_skin?: null;
  experiment_info: ExperimentInfo;
  relationship_label: string;
  live_stream_session?: null;
  new_user_label: boolean;
  wp_eligibility?: null;
  platform_voucher?: null;
  rcmd_reason?: null;
  highlight_video?: null;
  can_use_cod: boolean;
  pub_id: string;
  pub_context_id: string;
  friend_relationship_label: string;
  showing_rs_label?: null;
  showing_friend_rs_label?: null;
  show_flash_sale_label: boolean;
  search_id: string;
  ext_info: string;
  product_banners?: null;
  top_product_label?: null;
}
export interface VideoInfoListEntity {
  video_id: string;
  thumb_url: string;
  duration: number;
  version: number;
  vid: string;
  formats?: FormatsEntityOrDefaultFormat[] | null;
  default_format: FormatsEntityOrDefaultFormat;
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
  rcount_with_image: number;
  rcount_with_context: number;
}
export interface BundleDealInfo {
  bundle_deal_id: number;
  bundle_deal_label: string;
}
export interface AddOnDealInfo {
  add_on_deal_id: number;
  add_on_deal_label: string;
  sub_type: number;
  status: number;
}
export interface VoucherInfo {
  promotion_id: number;
  voucher_code: string;
  label: string;
}
export interface ExperimentInfo {
  image_overlay_exp?: null;
  title_autogen_exp?: null;
  highlight_video_exp?: null;
  cod_free_shipping_exp?: null;
}
export interface AdsEntity {
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
  video_info_list?: (VideoInfoListEntity1 | null)[] | null;
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
  bundle_deal_info?: BundleDealInfo1 | null;
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
  voucher_info?: VoucherInfo1 | null;
  is_on_flash_sale: boolean;
  spl_installment_tenure?: null;
  is_live_streaming_price?: null;
  shop_name: string;
  shop_rating: number;
  is_mart: boolean;
  pack_size?: null;
  overlay_image?: null;
  autogen_title?: null;
  autogen_title_id?: null;
  overlay_id?: null;
  is_service_by_shopee: boolean;
  flash_sale_stock: number;
  info: string;
  data_type: string;
  key: string;
  count: number;
  adsid: number;
  campaignid: number;
  deduction_info: string;
  video_display_control: number;
  deep_discount_skin?: null;
  experiment_info: ExperimentInfo;
  relationship_label: string;
  live_stream_session?: null;
  new_user_label: boolean;
  wp_eligibility?: null;
  platform_voucher?: null;
  rcmd_reason?: null;
  highlight_video?: null;
  can_use_cod: boolean;
  pub_id?: null;
  pub_context_id?: null;
  friend_relationship_label: string;
  showing_rs_label?: null;
  showing_friend_rs_label?: null;
  show_flash_sale_label: boolean;
  search_id: string;
  ext_info: string;
  product_banners?: null;
  top_product_label?: null;
}
export interface VideoInfoListEntity1 {
  video_id: string;
  thumb_url: string;
  duration: number;
  version: number;
  vid: string;
  formats?: FormatsEntityOrDefaultFormat[] | null;
  default_format: FormatsEntityOrDefaultFormat;
}
export interface BundleDealInfo1 {
  bundle_deal_id: number;
  bundle_deal_label: string;
}
export interface VoucherInfo1 {
  promotion_id: number;
  voucher_code: string;
  label: string;
}
export interface RealtimeMetaData {
  next_page_size: number;
}
export interface UserMetaData {
  is_new_user: boolean;
}
