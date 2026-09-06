import React, { useMemo, useRef, useState } from 'react'
import { Check, ImagePlus, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getRegisteredUser } from '../../utils/auth'
import { indiaLocations } from '../../data/indiaLocations'
import { getProducts, updateProduct } from '../../utils/products'
import type { ProductLocation, ProductStatus, SellerProduct } from '../../types'

const emptyLocation: ProductLocation = { state: '', district: '', taluka: '', villageCity: '', pinCode: '' }

export default function EditProductPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const seller = currentUser ? getRegisteredUser(currentUser.id) : null
  const profileLocation = (seller?.profile as { location?: ProductLocation } | undefined)?.location ?? emptyLocation
  const initialProduct = currentUser ? getProducts().find(product => product.id === id && product.sellerId === currentUser.id) : null

  const [images, setImages] = useState<string[]>(initialProduct?.images ?? [])
  const [useRegisteredLocation, setUseRegisteredLocation] = useState(JSON.stringify(initialProduct?.location ?? emptyLocation) === JSON.stringify(profileLocation))
  const [form, setForm] = useState({
    name: initialProduct?.name ?? '',
    category: initialProduct?.category ?? '',
    description: initialProduct?.description ?? '',
    price: initialProduct?.price.toString() ?? '',
    unit: initialProduct?.unit ?? 'kg',
    quantity: initialProduct?.quantity.toString() ?? '',
    status: (initialProduct?.status ?? 'available') as ProductStatus,
    location: initialProduct?.location ?? emptyLocation
  })

  if (!initialProduct) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-800"><div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-lg font-semibold">Product not found.</p><button type="button" onClick={() => navigate('/seller-dashboard/products')} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Back to Products</button></div></div>
  }

  const stateOptions = Object.keys(indiaLocations)
  const districtOptions = form.location.state ? Object.keys(indiaLocations[form.location.state as keyof typeof indiaLocations] ?? {}) : []
  const talukaOptions = form.location.state && form.location.district ? Object.keys((indiaLocations[form.location.state as keyof typeof indiaLocations] as Record<string, Record<string, string[]>>)[form.location.district] ?? {}) : []
  const cityOptions = form.location.state && form.location.district && form.location.taluka ? ((indiaLocations[form.location.state as keyof typeof indiaLocations] as Record<string, Record<string, string[]>>)[form.location.district] ?? {})[form.location.taluka] ?? [] : []
  const effectiveLocation = useMemo(() => (useRegisteredLocation ? profileLocation : form.location), [form.location, profileLocation, useRegisteredLocation])

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm(previous => ({ ...previous, [field]: value }))
  }

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setImages(previous => [...previous, String(reader.result)])
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!currentUser || !initialProduct) return

    const nextProduct: SellerProduct = {
      ...initialProduct,
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      unit: form.unit,
      quantity: Number(form.quantity),
      status: form.status,
      images,
      location: effectiveLocation,
      updatedAt: new Date().toISOString()
    }

    updateProduct(nextProduct)
    navigate('/seller-dashboard/products', { replace: true, state: { successMessage: 'Product updated successfully.' } })
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(value => !value)}
          onLogout={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader title="Edit Product" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Product Information</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Edit product listing</h2>
                </div>
                <button type="button" onClick={() => navigate('/seller-dashboard/products')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Back to Products</button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Product Images</label>
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={event => handleImageFiles(event.target.files)} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100">
                      <ImagePlus size={16} /> Upload New Images
                    </button>

                    {images.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {images.map((image, index) => (
                          <div key={`${image}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <img src={image} alt="Preview" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => setImages(current => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Product Name *</label>
                  <input value={form.name} onChange={event => updateField('name', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Category *</label>
                  <input value={form.category} onChange={event => updateField('category', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                  <textarea value={form.description} onChange={event => updateField('description', event.target.value)} className="min-h-[120px] w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Price *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={event => updateField('price', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Unit *</label>
                  <select value={form.unit} onChange={event => updateField('unit', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500">
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="packet">packet</option>
                    <option value="bundle">bundle</option>
                    <option value="liter">liter</option>
                    <option value="box">box</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Available Quantity *</label>
                  <input type="number" min="0" value={form.quantity} onChange={event => updateField('quantity', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Product Status</label>
                  <select value={form.status} onChange={event => updateField('status', event.target.value as ProductStatus)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500">
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <input id="use-registered-location" type="checkbox" checked={useRegisteredLocation} onChange={event => setUseRegisteredLocation(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <label htmlFor="use-registered-location" className="text-sm font-medium text-slate-700">Use my registered location</label>
                </div>

                {useRegisteredLocation ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="flex items-center gap-2 font-medium"><Check size={16} /> Registered location</div>
                    <p className="mt-2">{profileLocation.state || 'State'}, {profileLocation.district || 'District'}, {profileLocation.taluka || 'Taluka'}, {profileLocation.villageCity || 'Village / City'}, {profileLocation.pinCode || 'PIN'}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
                      <select value={form.location.state} onChange={event => setForm(previous => ({ ...previous, location: { ...previous.location, state: event.target.value, district: '', taluka: '', villageCity: '' } }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500">
                        <option value="">Select State</option>
                        {stateOptions.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">District</label>
                      <select value={form.location.district} disabled={!form.location.state} onChange={event => setForm(previous => ({ ...previous, location: { ...previous.location, district: event.target.value, taluka: '', villageCity: '' } }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500 disabled:bg-slate-100">
                        <option value="">Select District</option>
                        {districtOptions.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Taluka</label>
                      <select value={form.location.taluka} disabled={!form.location.district} onChange={event => setForm(previous => ({ ...previous, location: { ...previous.location, taluka: event.target.value, villageCity: '' } }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500 disabled:bg-slate-100">
                        <option value="">Select Taluka</option>
                        {talukaOptions.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Village / City</label>
                      <select value={form.location.villageCity} disabled={!form.location.taluka} onChange={event => setForm(previous => ({ ...previous, location: { ...previous.location, villageCity: event.target.value } }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500 disabled:bg-slate-100">
                        <option value="">Select Village / City</option>
                        {cityOptions.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">PIN Code</label>
                      <input value={form.location.pinCode} onChange={event => setForm(previous => ({ ...previous, location: { ...previous.location, pinCode: event.target.value } }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-emerald-500" placeholder="Enter 6-digit PIN" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => navigate('/seller-dashboard/products')} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Update Product</button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}
