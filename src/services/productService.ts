import type { SellerProduct } from '../types'

const PRODUCTS_KEY = 'rootbridge_products'

function readProducts(): SellerProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    return raw ? (JSON.parse(raw) as SellerProduct[]) : []
  } catch {
    return []
  }
}

function writeProducts(products: SellerProduct[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function getAllProducts(): SellerProduct[] {
  return readProducts()
}

export function getProductsBySeller(sellerId: string): SellerProduct[] {
  return readProducts().filter(product => product.sellerId === sellerId)
}

export function getVisibleBuyerProducts(): SellerProduct[] {
  return readProducts().filter(product => product.status === 'available' && product.quantity > 0)
}

export function addProduct(product: SellerProduct) {
  const products = readProducts()
  const updated = [...products, product]
  writeProducts(updated)
  return product
}

export function updateProductById(productId: string, data: Partial<SellerProduct>) {
  const products = readProducts()
  const updated = products.map(product => {
    if (product.id !== productId) return product
    return {
      ...product,
      ...data,
      updatedAt: new Date().toISOString()
    }
  })
  writeProducts(updated)
  return updated.find(product => product.id === productId) ?? null
}

export function deleteProductById(productId: string) {
  const products = readProducts().filter(product => product.id !== productId)
  writeProducts(products)
  return products
}
