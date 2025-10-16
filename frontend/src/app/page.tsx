'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Focus, BookOpen } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Zenith Study Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your all-in-one student productivity suite
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              onClick={() => router.push('/auth/login')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/auth/register')}
            >
              Sign Up
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Smart Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload syllabi and automatically populate your calendar with assignments and exams
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Collaborate with classmates on group projects with task management and file sharing
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Focus className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Focus Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Block distracting websites and track study time for better productivity
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Course Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize all your courses, assignments, and study materials in one place
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}