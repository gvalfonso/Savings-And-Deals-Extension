export interface LazadaSearchResult {
  mods: Mods;
  mainInfo: MainInfo;
  seoInfo: SeoInfo;
}
export interface Mods {
  filter: Filter;
  listItems?: ListItemsEntity[] | null;
  breadcrumb?: BreadcrumbEntity[] | null;
  sortBar: SortBar;
  resultTips: ResultTips;
  linksInfo?: null[] | null;
}
export interface Filter {
  tItemType: string;
  filterItems?: FilterItemsEntity[] | null;
  filteredQuatity: string;
  filteredDoneText: string;
  bizData: string;
  pos: number;
}
export interface FilterItemsEntity {
  options?: (OptionsEntity | null)[] | null;
  isPreposed?: boolean | null;
  preposeOrder?: number | null;
  name: string;
  type: string;
  unfoldRow: string;
  title: string;
  urlKey: string;
  value?: string | null[] | null;
  hidden: boolean;
  locked: boolean;
  showMin?: string | null;
  showMax?: string | null;
}
export interface OptionsEntity {
  value: string;
  title: string;
  url?: string | null;
  order: number;
  id?: string | null;
}
export interface ListItemsEntity {
  name: string;
  nid: string;
  icons?: (IconsEntity | null)[] | null;
  image: string;
  price: string;
  promotionId: string;
  priceShow: string;
  ratingScore: string;
  review: string;
  installment: string;
  tItemType: string;
  location: string;
  cheapest_sku: string;
  sku: string;
  skus?: null[] | null;
  brandId: string;
  brandName: string;
  sellerId: string;
  mainSellerId: string;
  sellerName: string;
  thumbs?: ThumbsEntity[] | null;
  restrictedAge: number;
  categories?: number[] | null;
  clickTrace: string;
  addToCartSkus?: AddToCartSkusEntity[] | null;
  itemId: string;
  skuId: string;
  inStock: boolean;
  isAD: number;
  addToCart: boolean;
  showFeedBack: boolean;
  longImageDisplayable: boolean;
  itemUrl: string;
  querystring: string;
  originalPrice?: string | null;
  originalPriceShow?: string | null;
}
export interface IconsEntity {
  domClass: string;
  alias: string;
  type: string;
  group: string;
  showType: string;
  order: number;
  "font-size": number;
  coins: boolean;
  url?: string | null;
  style?: Style | null;
}
export interface Style {
  width: number;
  height: number;
}
export interface ThumbsEntity {
  image: string;
  sku: string;
  skuId: string;
  itemUrl: string;
  querystring: string;
}
export interface AddToCartSkusEntity {
  sku: string;
  skuId: string;
  count: number;
  title?: string | null;
}
export interface BreadcrumbEntity {
  url?: string | null;
  title: string;
}
export interface SortBar {
  tItemType: string;
  filter: string;
  style: string;
  sortItems?: SortItemsEntity[] | null;
  hiddenLayoutBtn: boolean;
  showFilterBtn: boolean;
  hasFilter: boolean;
  module: Module;
}
export interface SortItemsEntity {
  name: string;
  tip: string;
  isActive?: string | null;
  value: string;
  key: string;
  tabName: string;
}
export interface Module {
  widgets: WidgetsOrTrackParamsOrSelectedFilters;
  style: Style1;
}
export interface WidgetsOrTrackParamsOrSelectedFilters {}
export interface Style1 {
  sale: Sale;
  guarantee: GuaranteeOrFreeshipping;
  freeshipping: GuaranteeOrFreeshipping;
}
export interface Sale {
  type: string;
  color: string;
  selectColor: string;
  fontSize: string;
  marginLeft: string;
  direction: string;
}
export interface GuaranteeOrFreeshipping {
  type: string;
  width: string;
  height: string;
  marginRight: string;
  marginBottom: string;
  direction: string;
}
export interface ResultTips {
  tItemType: string;
  tips: string;
  brandLink: string;
  keywords?: KeywordsEntity[] | null;
}
export interface KeywordsEntity {
  text: string;
}
export interface MainInfo {
  errorMsg: string;
  bizCode: number;
  cluster: string;
  isShowFloatCart: boolean;
  isHideAddToCart: boolean;
  totalResults: string;
  pageSize: string;
  page: string;
  RN: string;
  style: string;
  layoutInfo: LayoutInfo;
  pageType: string;
  gridTitleLine: string;
  trackParams: WidgetsOrTrackParamsOrSelectedFilters;
  anonUid: string;
  cate_id: string;
  hyperspaceInfo: string;
  lang: string;
  venture: string;
  currency: string;
  currencyOnRight: string;
  currencySpace: string;
  isShowFeedbackForm: string;
  showThumbs: string;
  addToCartURL: string;
  themes?: ThemesEntity[] | null;
  q: string;
  column: number;
  bucketId: string;
  auctionType: number;
  selectedFilters: WidgetsOrTrackParamsOrSelectedFilters;
  reqParams: string;
  pageTitle: string;
}
export interface LayoutInfo {
  listHeader?: string[] | null;
  stickyHeader?: string[] | null;
  sceneHeader?: string[] | null;
}
export interface ThemesEntity {
  key: string;
  isImgIcon: string;
  url: string;
  locaLang: string;
  enLang: string;
  style: string;
  text: string;
}
export interface SeoInfo {
  canonicalHref: string;
  androidDeepLink: string;
  nextHref: string;
  internalLink?: null[] | null;
  h1: string;
  pageTitle: string;
  description: string;
  robotsContent: string;
  itemListSchema: ItemListSchema;
  breadcrumbSchema: BreadcrumbSchema;
  breadcrumbData?: BreadcrumbDataEntity[] | null;
  productSchema: ProductSchema;
}
export interface ItemListSchema {
  "@context": string;
  "@type": string;
  itemListElement?: ItemListElementEntity[] | null;
}
export interface ItemListElementEntity {
  "@type": string;
  position: number;
  url: string;
}
export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement?: ItemListElementEntity1[] | null;
}
export interface ItemListElementEntity1 {
  item: Item;
  "@type": string;
  position: number;
}
export interface Item {
  "@id": string;
  name: string;
}
export interface BreadcrumbDataEntity {
  categoryName: string;
  categoryLink?: string | null;
}
export interface ProductSchema {
  "@type": string;
  "@context": string;
  name: string;
  image: string;
  sku: string;
  mpn: string;
  aggregateRating: AggregateRating;
  brand: Brand;
}
export interface AggregateRating {
  "@type": string;
  ratingValue: string;
  ratingCount: number;
}
export interface Brand {
  "@type": string;
  name: string;
}
