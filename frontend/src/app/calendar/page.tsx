'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowLeft, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface CalendarEvent {
  id: number
  title: string
  description?: string
  date: string
  time?: string
  type: string
  course_id?: number
}

export default function CalendarPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    loadEvents()
  }, [isAuthenticated, router])

  const loadEvents = async () => {
    try {
      const response = await api.get('/calendar')
      setEvents(response.data)
    } catch (error) {
      toast.error('Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'presentation':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
            <div className="flex items-center animate-slide-right">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mr-4 hover-lift"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  <Calendar className="h-6 w-6 mr-2 text-primary" />
                  Calendar
                </h1>
                <p className="text-muted-foreground">Manage your assignments and events</p>
              </div>
            </div>
            <Button className="hover-lift animate-slide-left">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {events.length === 0 ? (
                <Card className="modern-card animate-swipe-up">
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No events yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding your first event or uploading a syllabus</p>
                    <Button className="hover-lift">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Event
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                events.map((event, index) => (
                  <Card key={event.id} className="modern-card hover-lift animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {formatDate(event.date)}
                            {event.time && ` at ${event.time}`}
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)} animate-fade-in`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    {event.description && (
                      <CardContent>
                        <p className="text-muted-foreground">{event.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}