import items from "../data/items.json" assert { type: "json" };

export const priceCities = [
  "Black Market", "Bridgewatch", "Caerleon", "Fort Sterling", "Lymhurst", "Martlock", "Thetford"
];

export const itemLists = items.filter((item: any) => item.LocalizedNames).map((item: any) => {
  return {
    name: item.LocalizedNames["KO-KR"],
    value: item.UniqueName,
  }
});