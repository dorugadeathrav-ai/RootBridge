import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRegisteredUser } from '../utils/auth'
import { saveProduct, updateProduct } from '../utils/products'
import type { ProductLocation, ProductStatus, SellerProduct } from '../types'

type Props = { product?: SellerProduct }
const blankLocation: ProductLocation = { state: '', district: '', taluka: '', villageCity: '', pinCode: '' }

export default function SellerAddProduct({ product: productProp }: Props) {
  const { currentUser } = useAuth()
  const seller = currentUser ? getRegisteredUser(currentUser.id) : null
  const locationState = useLocation().state as { product?: SellerProduct } | null
  const product = productProp ?? locationState?.product
  const profile = seller?.profile as { location?: ProductLocation } | undefined
  const defaultLocation = profile?.location ?? blankLocation
  const [name, setName] = useState(product?.name ?? '')
  const [category, setCategory] = useState(product?.category ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price.toString() ?? '')
  const [unit, setUnit] = useState(product?.unit ?? 'Per Piece')
  const [quantity, setQuantity] = useState(product?.quantity.toString() ?? '')
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'available')
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [useRegisteredLocation, setUseRegisteredLocation] = useState(!product || JSON.stringify(product.location) === JSON.stringify(defaultLocation))
  const [location, setLocation] = useState<ProductLocation>(product?.location ?? defaultLocation)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  function readImages(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(file => { const reader = new FileReader(); reader.onload = () => setImages(previous => [...previous, String(reader.result)]); reader.readAsDataURL(file) })
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!currentUser || !name.trim() || !category || !price || !unit || !quantity) return setError('Complete all required product fields.')
    const now = new Date().toISOString()
    const value: SellerProduct = { id: product?.id ?? (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `product-${Date.now()}`), sellerId: currentUser.id, name: name.trim(), category, description, price: Number(price), unit, quantity: Number(quantity), status, images, location: useRegisteredLocation ? defaultLocation : location, createdAt: product?.createdAt ?? now, updatedAt: now }
    product ? updateProduct(value) : saveProduct(value)
    navigate('/seller-dashboard')
  }

  function locationField(field: keyof ProductLocation, label: string) { return <div><label className="text-sm">{label}</label><input value={location[field]} disabled={useRegisteredLocation} onChange={event => setLocation(previous => ({ ...previous, [field]: event.target.value }))} className="w-full rounded border p-2 disabled:bg-gray-100" /></div> }
  return <div className="min-h-screen bg-gray-50 p-6"><div className="mx-auto max-w-4xl"><div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">{product ? 'Edit Product' : 'Add New Product'}</h1><button type="button" onClick={() => navigate('/seller-dashboard')} className="text-emerald-700">Back to Dashboard</button></div><form onSubmit={submit} className="mt-6 rounded bg-white p-6 shadow-sm"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><div className="md:col-span-2"><label className="text-sm">Product Images</label><input ref={fileInput} type="file" accept="image/*" multiple onChange={event => readImages(event.target.files)} className="mt-1 block w-full text-sm" /><div className="mt-3 flex flex-wrap gap-3">{images.map((image, index) => <div key={`${image}-${index}`} className="relative"><img src={image} alt="Product preview" className="h-24 w-24 rounded object-cover" /><button type="button" onClick={() => setImages(images.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-1 top-1 rounded bg-white px-1 text-red-600">x</button></div>)}</div></div><div><label className="text-sm">Product Name *</label><input required value={name} onChange={event => setName(event.target.value)} className="mt-1 w-full rounded border p-2" /></div><div><label className="text-sm">Product Category *</label><input required value={category} onChange={event => setCategory(event.target.value)} className="mt-1 w-full rounded border p-2" /></div><div className="md:col-span-2"><label className="text-sm">Product Description</label><textarea value={description} onChange={event => setDescription(event.target.value)} className="mt-1 w-full rounded border p-2" /></div><div><label className="text-sm">Price *</label><input required type="number" min="0" step="0.01" value={price} onChange={event => setPrice(event.target.value)} className="mt-1 w-full rounded border p-2" /></div><div><label className="text-sm">Unit *</label><select value={unit} onChange={event => setUnit(event.target.value)} className="mt-1 w-full rounded border p-2"><option>Per Kg</option><option>Per 500g</option><option>Per Piece</option><option>Per Litre</option><option>Per Pack</option></select></div><div><label className="text-sm">Available Quantity *</label><input required type="number" min="0" value={quantity} onChange={event => setQuantity(event.target.value)} className="mt-1 w-full rounded border p-2" /></div><div><label className="text-sm">Product Status</label><select value={status} onChange={event => setStatus(event.target.value as ProductStatus)} className="mt-1 w-full rounded border p-2"><option value="available">Available</option><option value="out-of-stock">Out of Stock</option></select></div></div><div className="mt-6 border-t pt-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useRegisteredLocation} onChange={event => { setUseRegisteredLocation(event.target.checked); if (event.target.checked) setLocation(defaultLocation) }} /> Use my registered location</label><div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">{locationField('state', 'State')}{locationField('district', 'District')}{locationField('taluka', 'Taluka')}{locationField('villageCity', 'Village / City')}{locationField('pinCode', 'PIN Code')}</div></div>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<button className="mt-6 rounded bg-emerald-600 px-4 py-2 text-white">{product ? 'Save Changes' : 'Add Product'}</button></form></div></div>
}
