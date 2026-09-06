import type { SellerProduct } from '../types'

const PRODUCTS_KEY = 'rootbridge_products'

export function getProducts(): SellerProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    return raw ? (JSON.parse(raw) as SellerProduct[]) : []
  } catch {
    return []
  }
}

export function saveProduct(product: SellerProduct) {
  const products = getProducts()
  const next = [...products, product]
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
  return next
}

export function updateProduct(product: SellerProduct) {
  const next = getProducts().map(item => item.id === product.id ? product : item)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
  return next
}

export function deleteProduct(id: string) {
  const next = getProducts().filter(item => item.id !== id)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
  return next
}

export function getAvailableProducts(): SellerProduct[] {
  return getProducts().filter(item => item.status === 'available' && item.quantity > 0)
}

export function getVisibleBuyerProducts(): SellerProduct[] {
  return getAvailableProducts()
}

