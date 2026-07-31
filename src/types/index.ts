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
