import { dinar, goldbar, PRINTING_COSTS } from "@repo/constant/products";
import type { PriceListItem, PriceListResult } from "@repo/types";
import { useCallback, useMemo } from "react";

const allProducts = [...dinar, ...goldbar];

const getWeightNumber = (weightStr: string): number =>
  parseFloat(weightStr.replace(/[^\d.]/g, "")) || 0;

const parsePriceToNumber = (
  priceStr: string | null | undefined,
): number | null => {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[^0-9]/g, "");
  const num = parseInt(cleaned, 10);
  return Number.isNaN(num) ? null : num;
};

interface UsePriceCalculationOptions {
  price?: PriceListResult;
  priceMode: "tabungan" | "tunai";
}

/**
 * All price-related calculation & formatting logic for the PriceList component.
 * Returns derived values, a formatter, and the final product list with prices.
 */
export function usePriceCalculation({
  price,
  priceMode,
}: UsePriceCalculationOptions) {
  const perGramPrice = useMemo(
    () => parsePriceToNumber(price?.poe?.[1]?.price),
    [price],
  );

  const savingsWeight = useMemo(() => {
    if (!price?.poe?.[0]?.label) return null;
    return getWeightNumber(price.poe[0].label);
  }, [price]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  );

  const formatPrice = useCallback(
    (priceValue: string | number | null | undefined) => {
      if (priceValue === null || priceValue === undefined) return null;

      const val =
        typeof priceValue === "string"
          ? parsePriceToNumber(priceValue)
          : priceValue;
      if (val === null) return "Rp ...";

      return currencyFormatter.format(val).replace("Rp", "Rp ");
    },
    [currencyFormatter],
  );

  const getCalculatedPrice = useCallback(
    (item: (typeof allProducts)[0]) => {
      const weight = getWeightNumber(item.weight);
      let printCost = PRINTING_COSTS[item.weight] || 0;

      if (priceMode === "tabungan") {
        if (!perGramPrice) return null;
        return perGramPrice * weight + printCost;
      }

      // mode tunai
      const apiArray =
        item.category === "dinar" ? price?.dinar : price?.goldbar;
      const apiItem = apiArray?.find((p: PriceListItem) =>
        item.title.startsWith(p.label),
      );
      const apiPrice = parsePriceToNumber(apiItem?.price);

      if (!apiPrice) return null;

      if (item.category === "goldbar") {
        if (weight <= 1) printCost = 0;
        else if (weight === 5) printCost = 15000;
        return apiPrice + printCost;
      }

      // category === "dinar"
      if (weight <= 2.125) printCost = 0;
      const baseAmount = apiPrice + printCost;
      const tax = Math.floor((baseAmount * 0.011) / 1000) * 1000;
      return baseAmount + tax;
    },
    [priceMode, perGramPrice, price],
  );

  const productsWithPrices = useMemo(() => {
    return allProducts.map((item) => {
      const weightNum = getWeightNumber(item.weight);
      const isPortraitBar =
        item.category === "goldbar" &&
        weightNum >= 5 &&
        !item.title.match(/Batik|Raya|Merdeka|Sultan|Cenderawasih/i);

      return {
        ...item,
        calculatedPrice: getCalculatedPrice(item),
        weightNum,
        isPortraitBar,
      };
    });
  }, [getCalculatedPrice]);

  return {
    perGramPrice,
    savingsWeight,
    formatPrice,
    productsWithPrices,
  };
}
