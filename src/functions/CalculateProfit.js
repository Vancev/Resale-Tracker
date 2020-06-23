import React, { useState, useEffect, useContext } from "react";

export function CalculateProfit(
  soldPlatform,
  fees,
  soldCost,
  cost,
  shippingCost,
  buyerShipping,
  ebayCategory,
  ebayOther,
  adRate
) {
  var profit;
  switch (soldPlatform) {
    case "Mecari":
      let fee = parseFloat(soldCost) * fees.fee.platformPercentFee * 0.01;
      console.log(fee);
      profit =
        parseFloat(soldCost || 0) -
        parseFloat(cost || 0) -
        parseFloat(shippingCost || 0) +
        parseFloat(buyerShipping || 0) -
        parseFloat(fee || 0);
      console.log(profit);
      break;
    case "Ebay":
      console.log(fees);
      let totalReceived = parseFloat(soldCost) + parseFloat(buyerShipping);
      var paymentFee;
      var ebayFee;
      if (ebayOther.managedPayment) {
        paymentFee =
          fees.fee.EbayManagedPercent * 0.01 * totalReceived +
          fees.fee.EbayManagedFixed;
      } else if (ebayOther.internationalPayment && !ebayOther.managedPayment) {
        paymentFee =
          fees.fee.PayPalInternationalPercent * 0.01 * totalReceived +
          fees.fee.PayPalInternationalFixed;
      } else {
        paymentFee =
          fees.fee.PayPalPercent * 0.01 * totalReceived + fees.fee.PayPalFixed;
      }
      console.log(paymentFee);
      var categoryFees = {};
      categoryFees = fees.fee.ebayCategory.find(
        ({ CategoryName }) => CategoryName === ebayCategory
      );

      ebayFee = Math.min(
        totalReceived * 0.01 * categoryFees.CategoryFee,
        categoryFees.MaxFee
      );
      console.log(ebayFee);
      if (ebayOther.topRated) {
        let discount = ebayFee * fees.fee.TopRatedDiscount * 0.01;
        ebayFee = ebayFee - discount;
      }
      if (ebayOther.promotedListing) {
        let promotionFee = totalReceived * 0.01 * adRate;
        ebayFee = ebayFee - promotionFee;
      }
      console.log(ebayFee);
      profit =
        parseFloat(soldCost || 0) -
        parseFloat(cost || 0) -
        parseFloat(paymentFee || 0) -
        parseFloat(ebayFee || 0) -
        parseFloat(shippingCost || 0) +
        parseFloat(buyerShipping || 0);
      console.log(profit);
      break;
    case "OfferUp - Local" || "Craigslist" || "Local - Other":
      profit =
        parseFloat(soldCost || 0) -
        parseFloat(cost || 0) -
        parseFloat(shippingCost || 0) +
        parseFloat(buyerShipping || 0);
      break;
    default:
      profit =
        parseFloat(soldCost || 0) -
        parseFloat(cost || 0) -
        parseFloat(shippingCost || 0) +
        parseFloat(buyerShipping || 0);
      break;
  }
  return profit.toFixed(2);
}
