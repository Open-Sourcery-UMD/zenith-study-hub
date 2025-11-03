'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Focus, BookOpen, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardPage() {
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuthStore()
    const [stats, setStats] = useState({
        upcomingEvents: 0,
        activeProjects: 0,
        focusHours: 0,
        courses: 0
    })

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login')
            return
        }

        // Load dashboard stats
        loadDashboardStats()
    }, [isAuthenticated, router])

    const loadDashboardStats = async () => {
        // This would fetch real data from your API
        setStats({
            upcomingEvents: 5,
            activeProjects: 3,
            focusHours: 12,
            courses: 4
        })
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card/50 backdrop-blur-sm shadow-sm border-b border-border/50 animate-slide-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="animate-slide-right">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
                        </div>
                        <div className="flex items-center space-x-3 animate-slide-left">
                            <ThemeToggle />
                            <Button variant="outline" className="hover-lift" onClick={() => router.push('/calendar')}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Calendar
                            </Button>
                            <Button variant="outline" className="hover-lift" onClick={() => router.push('/projects')}>
                                <Users className="h-4 w-4 mr-2" />
                                Projects
                            </Button>
                            <Button variant="outline" className="hover-lift" onClick={() => router.push('/focus')}>
                                <Focus className="h-4 w-4 mr-2" />
                                Focus
                            </Button>
                            <Button variant="outline" className="hover-lift" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="modern-card hover-lift animate-scale-in animate-stagger-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                            <Calendar className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{stats.upcomingEvents}</div>
                            <p className="text-xs text-muted-foreground">Next 7 days</p>
                        </CardContent>
                    </Card>

                    <Card className="modern-card hover-lift animate-scale-in animate-stagger-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats.activeProjects}</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </CardContent>
                    </Card>

                    <Card className="modern-card hover-lift animate-scale-in animate-stagger-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Focus Hours</CardTitle>
                            <Focus className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-500">{stats.focusHours}</div>
                            <p className="text-xs text-muted-foreground">This week</p>
                        </CardContent>
                    </Card>

                    <Card className="modern-card hover-lift animate-scale-in animate-stagger-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-500">{stats.courses}</div>
                            <p className="text-xs text-muted-foreground">This semester</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="modern-card animate-slide-up animate-stagger-1">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                Quick Actions
                            </CardTitle>
                            <CardDescription>Get started with common tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start hover-lift group" onClick={() => router.push('/syllabus/upload')}>
                                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                Upload Syllabus
                            </Button>
                            <Button variant="outline" className="w-full justify-start hover-lift group" onClick={() => router.push('/projects/new')}>
                                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                Create Project
                            </Button>
                            <Button variant="outline" className="w-full justify-start hover-lift group" onClick={() => router.push('/focus/start')}>
                                <Focus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                Start Focus Session
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="modern-card animate-slide-up animate-stagger-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Your latest updates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200 animate-fade-in animate-stagger-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Math Assignment due tomorrow</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200 animate-fade-in animate-stagger-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Completed 2-hour focus session</p>
                                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200 animate-fade-in animate-stagger-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">New project created: CS Group Project</p>
                                        <p className="text-xs text-muted-foreground">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}