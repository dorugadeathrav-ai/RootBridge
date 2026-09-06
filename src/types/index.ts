export interface Product {
  id: string
  name: string
  seller: string
  location: string
  price: number
  rating: number
  image?: string
  description?: string
}

export type ProductStatus = 'available' | 'out-of-stock'

export interface ProductLocation {
  state: string
  district: string
  taluka: string
  villageCity: string
  pinCode: string
}

export interface SellerProduct {
  id: string
  sellerId: string
  name: string
  category: string
  description: string
  price: number
  unit: string
  quantity: number
  status: ProductStatus
  images: string[]
  location: ProductLocation
  createdAt: string
  updatedAt: string
}

export interface Seller {
  id: string
  fullName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  location: {
    city: string
    district?: string
    state?: string
    pin?: string
  }
  primaryCategory?: string
}

export type Category = string
