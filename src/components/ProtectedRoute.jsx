import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { user } = useAuth()
  
  return user ? <Outlet /> : <Navigate to="/login" />
}
