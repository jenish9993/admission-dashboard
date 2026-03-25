import React, { useState } from 'react'
import { DashboardProvider } from './context/DashboardContext'
import moment from 'moment'
import DashboardContent from './AdmissionDashboard'

const AdminDashboardMain = () => {
    const [backgroundColor,setBackgroundColor] = useState(false)
    console.log(backgroundColor);
  return (
        <DashboardProvider>
            <div className= {`${backgroundColor ? 'bg-white-900 min-h-screen text-slate-100' : 'bg-slate-900 min-h-screen text-slate-100'}`}>
                {/* Nav bar */}
                <nav className="bg-slate-800/80 backdrop-blur border-b border-slate-700/50 px-4 md:px-8 py-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
                            U
                        </div>
                        <span className="font-bold text-slate-100 text-lg tracking-tight">University Admin Portal</span>
                        <span className="ml-auto text-xs text-slate-500 hidden sm:block">
                            {moment().format("dddd, MMMM D YYYY")}
                        </span>
                    </div>
                </nav>
    
                {/* Main content */}
                <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    <DashboardContent backgroundColor={backgroundColor}setBackgroundColor = {setBackgroundColor}/>
                </main>
            </div>
        </DashboardProvider>
  )
}

export default AdminDashboardMain