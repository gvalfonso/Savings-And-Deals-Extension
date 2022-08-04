import { currencies } from "../config";
import { Suggestion } from "../types/suggestion.type";
import { ShopeeProductData, ShopVouchersEntity } from "./product.type";
import { ShopeeSearchResult } from "./search.type";

export async function getShopeeSuggestions(
  itemid: string,
  shopid: string,
  baseUrl: string
): Promise<{
  success: boolean;
  suggestions: Suggestion[];
}> {
  const productData = await getProductData(itemid, shopid, baseUrl);
  if (!productData.data) return { success: false, suggestions: [] };
  // const bestVoucher = getBestDiscount(
  //   productData.data.price_min,
  //   productData.data.shop_vouchers || []
  // );
  var targetProduct: Record<string, any> = {
    price: productData.data.price_min,
    name: productData.data.name,
    shopid: productData.data.shopid,
    itemid: productData.data.itemid,
    catid: productData.data.categories?.[0].catid || 0,
  };
  // if (bestVoucher) {
  //   targetProduct = {
  //     ...targetProduct,
  //     voucher: bestVoucher.highestVoucherDiscountValue,
  //     price:
  //       productData.data.price_min - bestVoucher.highestVoucherDiscountValue,
  //   };
  // }
  const shopeeSuggestions = await getShopeeSuggestionsFromInsideShopee(
    targetProduct,
    baseUrl
  );
  return {
    success: true,
    suggestions: [...shopeeSuggestions],
  };
}
export async function getShopeeSuggestionsFromInsideShopee(
  targetProduct: Record<string, any>,
  baseUrl: string
) {
  const [otherProducts, otherRecommendedProducts] = await Promise.all([
    searchForOtherProducts(targetProduct.name, baseUrl),
    searchForRecommendedProducts(
      targetProduct.name,
      targetProduct.shopid,
      targetProduct.itemid,
      targetProduct.catid,
      baseUrl
    ),
  ]);
  otherProducts.items = [
    ...(otherProducts.items || []),
    ...((
      (otherRecommendedProducts.data.sections?.[0]?.data?.item as any) || []
    ).map((i: any) => ({ item_basic: i })) || []),
  ].filter((i) => i.item_basic.catid === targetProduct.catid);
  otherProducts.items = otherProducts.items?.filter(
    (val: any, index: any, self: any) =>
      val.item_basic &&
      index ===
        self.findIndex(
          (t: any) => t.item_basic.itemid === val.item_basic.itemid
        ) &&
      val.item_basic.sold > 0 &&
      val.item_basic.item_rating.rating_star > 4 &&
      val.item_basic.itemid.toString() != targetProduct.itemid
  );

  // otherProducts.items.forEach(
  //   (i: any) =>
  //     (i.item_basic.price_min_after_discount =
  //       i.item_basic.price_min -
  //       parseDiscount(
  //         i.item_basic.price_min,
  //         i.item_basic.voucher_info?.label || "",
  //         baseUrl
  //       ))
  // );
  console.log(otherProducts.items);
  otherProducts.items = otherProducts.items?.filter(
    (i: any) => i.item_basic.price_min < targetProduct.price
  );
  const rankedItems: Suggestion[] = otherProducts.items
    ?.filter((i: any) => i.item_basic.price_min / targetProduct.price > 0.3)
    ?.slice(0, 10)
    .sort((a: any, b: any) => b.item_basic.price_min - a.item_basic.price_min)
    .map((item: any) => ({
      name: item.item_basic.name,
      price: item.item_basic.price_min / 100000,
      rating: item.item_basic.item_rating.rating_star,
      url: `${baseUrl}/product/${item.item_basic.shopid}/${item.item_basic.itemid}`,
      image: `https://cf.shopee.ph/file/${item.item_basic.image}`,
      logo: "images/shopee-logo.png",
      voucher: item.item_basic.voucher_info?.label || "",
    }))
    .map((a: any) => ({
      ...a,
      priceString:
        (currencies[baseUrl as keyof typeof currencies] || "$") +
        a.price
          .toLocaleString("en", {
            useGrouping: false,
            minimumFractionDigits: 2,
          })
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    }));
  if (
    [
      "https://shopee.cl",
      "https://shopee.pl",
      "https://shopee.com.ar",
      "https://shopee.vn",
      "https://shopee.co.id",
      "https://shopee.com.br",
      "https://shopee.es",
    ].includes(baseUrl)
  ) {
    rankedItems.forEach(
      (a) =>
        (a.priceString =
          (currencies[baseUrl as keyof typeof currencies] || "$") +
          a.price
            .toLocaleString("en", {
              useGrouping: false,
              minimumFractionDigits: 2,
            })
            .toString()
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."))
    );
  }
  return rankedItems;
}

async function searchForOtherProducts(
  searchKeyword: string,
  baseUrl: string
): Promise<ShopeeSearchResult> {
  return (
    await fetch(
      `${baseUrl}/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(
        searchKeyword
      )}&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
      { method: "GET" }
    )
  ).json();
}

async function searchForRecommendedProducts(
  searchKeyword: string,
  shopid: number,
  itemid: number,
  categoryid: number,
  baseUrl: string
): Promise<any> {
  return (
    await fetch(
      `${baseUrl}/api/v4/recommend/recommend?bundle=product_detail_page&catid=${categoryid}&item_card=3&itemid=${itemid}&keyword=${encodeURIComponent(
        searchKeyword
      )}&limit=48&section=you_may_also_like&shopid=${shopid}`,
      { method: "GET" }
    )
  ).json();
}

function parseDiscount(
  itemPrice: number,
  voucherLabel: string,
  baseUrl: string
) {
  const discount = voucherLabel.split(" ")?.[0];
  var discountAmount = 0;
  if (discount.includes("%")) {
    discountAmount = itemPrice * +discount.replace(/%/g, "") * 0.01;
  } else if (
    discount.includes(currencies[baseUrl as keyof typeof currencies])
  ) {
    if (discount.includes("K")) {
      discountAmount = +discount.replace(/[₱K]/g, "") * 100000 * 1000;
    } else {
      discountAmount = +discount.replace(/₱/g, "") * 100000;
    }
  }
  return discountAmount || 0;
}

export async function getProductData(
  itemid: string,
  shopid: string,
  baseUrl: string
): Promise<ShopeeProductData> {
  return (
    await fetch(
      `${baseUrl}/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`,
      { method: "GET" }
    )
  ).json();
}

function getBestDiscount(currentPrice: number, vouchers: ShopVouchersEntity[]) {
  if (!vouchers || vouchers.length === 0) return undefined;
  const validVouchers = vouchers.filter(
    (i) =>
      i.end_time > new Date().getTime() / 1000 && i.min_spend < currentPrice
  );
  var highestVoucher!: ShopVouchersEntity;
  var highestVoucherDiscountValue: number = 0;
  validVouchers.forEach((voucher) => {
    var discountValue =
      voucher.discount_value || voucher.discount_percentage * currentPrice || 0;
    if (voucher.discount_cap && discountValue > voucher.discount_cap)
      discountValue = voucher.discount_cap;
    if (discountValue > highestVoucherDiscountValue) {
      highestVoucher = voucher;
      highestVoucherDiscountValue = discountValue;
    }
  });
  return { highestVoucher, highestVoucherDiscountValue };
}
