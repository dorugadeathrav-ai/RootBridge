import type { Seller } from '../types'

export const mockSeller: Seller = {
  id: 's1',
  fullName: 'Sita Devi',
  email: 'sita@example.com',
  phone: '9999999999',
  businessName: 'Sita Organic Farm',
  businessType: 'Farmer',
  location: {
    city: 'Kolhapur',
    district: 'Kolhapur',
    state: 'Maharashtra',
    pin: '416012'
  },
  primaryCategory: 'Agriculture'
}
