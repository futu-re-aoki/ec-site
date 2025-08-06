export type Product = {
  id: number;
  name: string;
  image_url: string;
  price_yen: number;
  stock: number;
};

export type CartItem = {
  id: number;
  name: string;
  image_url: string;
  price_yen: number;
  stock: number;
  quantity: number;
};
