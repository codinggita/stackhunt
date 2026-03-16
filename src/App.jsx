import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Dashboard from './pages/Dashboard'
import CreateBounty from './pages/CreateBounty'
import CompanyBounties from './pages/CompanyBounties'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ReviewQueue from './pages/ReviewQueue'
import MyRepo from './pages/MyRepo'
import MyWork from './pages/MyWork'
import BountyDetails from './pages/BountyDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bounty/:id" element={<BountyDetails />} />
        <Route path="create-bounty" element={<CreateBounty />} />
        <Route path="company-bounties" element={<CompanyBounties />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="review-queue" element={<ReviewQueue />} />
        <Route path="my-repo" element={<MyRepo />} />
        <Route path="my-work" element={<MyWork />} />
        <Route path="profile" element={<div>Profile Placeholder</div>} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
