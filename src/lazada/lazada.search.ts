import { Suggestion } from "../types/suggestion.type";
import { LazadaSearchResult } from "./lazada.types";

export async function getLazadaSuggestions(url: string): Promise<{
  success: boolean;
  suggestions: Suggestion[];
}> {
  const productData = await getProductData(url);
  return {
    success: true,
    suggestions: [],
  };
}

async function getProductData(url: string) {
  const res = await fetch(url, {
    method: "GET",
  });
}

async function searchLazada(name: string): Promise<LazadaSearchResult> {
  return (
    await fetch(
      `https://www.lazada.com.ph/catalog/?_keyori=ss&ajax=true&from=input&isFirstRequest=true&page=1&q=${name}`,
      {
        method: "GET",
        mode: "no-cors",
      }
    )
  ).json();
}

async function getLazadaSuggestionsFromInside(name: string, price: number) {
  const lazadaResult = await searchLazada(name);
  const filteredLazadaItems = lazadaResult.mods.listItems
    ?.filter((item) => +item.price < price && +item.ratingScore > 4)
    .filter((item) => +item.price / price > 0.3)
    ?.slice(0, 10)
    .sort((a, b) => +b.price - +a.price)
    .map((item) => ({
      name: item.name,
      price: +item.price,
      rating: +item.ratingScore,
      url: `https:${item.itemUrl}`,
      image: item.image,
      logo: "images/lazada-logo.png",
    }));
  return filteredLazadaItems || [];
}
