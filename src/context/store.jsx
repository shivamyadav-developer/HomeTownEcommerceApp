import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useEffect, useMemo, useReducer } from "react";

import { getProduct } from "@/data/products";

const STORAGE_KEY = "praxis-store-v1";
const FREE_DELIVERY_ABOVE = 999;
const DELIVERY_FEE = 199;

const COUPONS = {
  HOMETOWN10: { label: "10% off (max ₹5,000)", apply: (subtotal) => Math.min(subtotal * 0.1, 5000) },
  FRY500: { label: "₹500 off on ₹5,000+", apply: (subtotal) => (subtotal >= 5000 ? 500 : 0) },
};

const initialState = {
  loaded: false,
  cart: [], // [{ id, qty }]
  wishlist: [], // [id]
  orders: [], // [{ id, date, items, totals, address, payment }]
  address: null,
  coupon: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.state, loaded: true };
    case "addToCart": {
      const existing = state.cart.find((item) => item.id === action.id);
      const qty = action.qty ?? 1;
      const cart = existing
        ? state.cart.map((item) =>
            item.id === action.id ? { ...item, qty: Math.min(item.qty + qty, 10) } : item,
          )
        : [...state.cart, { id: action.id, qty }];
      return { ...state, cart };
    }
    case "setQty":
      return {
        ...state,
        cart:
          action.qty <= 0
            ? state.cart.filter((item) => item.id !== action.id)
            : state.cart.map((item) =>
                item.id === action.id ? { ...item, qty: Math.min(action.qty, 10) } : item,
              ),
      };
    case "removeFromCart":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.id) };
    case "toggleWishlist":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    case "moveToWishlist":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.id),
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist
          : [...state.wishlist, action.id],
      };
    case "applyCoupon":
      return { ...state, coupon: action.code };
    case "removeCoupon":
      return { ...state, coupon: null };
    case "saveAddress":
      return { ...state, address: action.address };
    case "placeOrder":
      return { ...state, orders: [action.order, ...state.orders], cart: [], coupon: null };
    case "cancelOrder":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.id
            ? { ...order, cancelled: true, cancelledAt: new Date().toISOString() }
            : order,
        ),
      };
    default:
      return state;
  }
}

function computeTotals(cart, coupon) {
  const lines = cart
    .map((item) => ({ ...item, product: getProduct(item.id) }))
    .filter((line) => line.product);
  const mrp = lines.reduce((sum, l) => sum + l.product.mrp * l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const couponDiscount = COUPONS[coupon] ? Math.round(COUPONS[coupon].apply(subtotal)) : 0;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  return {
    lines,
    count: lines.reduce((sum, l) => sum + l.qty, 0),
    mrp,
    productDiscount: mrp - subtotal,
    subtotal,
    couponDiscount,
    delivery,
    total: subtotal - couponDiscount + delivery,
  };
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => dispatch({ type: "hydrate", state: json ? JSON.parse(json) : {} }))
      .catch(() => dispatch({ type: "hydrate", state: {} }));
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    const { cart, wishlist, orders, address, coupon } = state;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cart, wishlist, orders, address, coupon }),
    ).catch(() => {});
  }, [state]);

  const value = useMemo(() => {
    const totals = computeTotals(state.cart, state.coupon);
    return {
      ...state,
      totals,
      addToCart: (id, qty) => dispatch({ type: "addToCart", id, qty }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      removeFromCart: (id) => dispatch({ type: "removeFromCart", id }),
      moveToWishlist: (id) => dispatch({ type: "moveToWishlist", id }),
      toggleWishlist: (id) => dispatch({ type: "toggleWishlist", id }),
      isInCart: (id) => state.cart.some((item) => item.id === id),
      isWishlisted: (id) => state.wishlist.includes(id),
      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!COUPONS[normalized]) return false;
        dispatch({ type: "applyCoupon", code: normalized });
        return true;
      },
      removeCoupon: () => dispatch({ type: "removeCoupon" }),
      couponLabel: COUPONS[state.coupon]?.label ?? null,
      saveAddress: (address) => dispatch({ type: "saveAddress", address }),
      placeOrder: (payment) => {
        const order = {
          id: `PX${Date.now().toString().slice(-8)}`,
          date: new Date().toISOString(),
          items: totals.lines.map(({ id, qty, product }) => ({
            id,
            qty,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
          })),
          mrp: totals.mrp,
          productDiscount: totals.productDiscount,
          couponDiscount: totals.couponDiscount,
          coupon: state.coupon,
          delivery: totals.delivery,
          total: totals.total,
          address: state.address,
          payment,
        };
        dispatch({ type: "placeOrder", order });
        return order.id;
      },
      cancelOrder: (id) => dispatch({ type: "cancelOrder", id }),
    };
  }, [state]);

  return <StoreContext value={value}>{children}</StoreContext>;
}

export function useStore() {
  const store = use(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}

export const AVAILABLE_COUPONS = Object.entries(COUPONS).map(([code, c]) => ({
  code,
  label: c.label,
}));
