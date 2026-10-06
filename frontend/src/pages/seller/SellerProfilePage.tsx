import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { API_URL, getAuthHeaders } from '../../utils/api'

export default function SellerProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/auth/profile`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

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
          <DashboardHeader title="My Profile" onMenuToggle={() => setSidebarOpen(value => !value)} />

          <main className="flex-1 p-4 sm:p-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Profile</h2>

            {loading ? (
              <p>Loading profile...</p>
            ) : profile ? (
              <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-emerald-800">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{profile.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Joined</p>
                      <p className="font-medium text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-emerald-800">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Business/Farm Name</p>
                      <p className="font-medium text-gray-900">{profile.vendorInfo?.businessName || 'Not Set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{profile.vendorInfo?.location || 'Not Set'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium text-gray-900">{profile.vendorInfo?.description || 'No description provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Coordinates (Auto-Located)</p>
                      <p className="font-medium text-gray-900 font-mono text-xs mt-1">
                        Lat: {profile.vendorInfo?.latitude || 'N/A'} <br />
                        Lng: {profile.vendorInfo?.longitude || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-500">Failed to load profile.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
