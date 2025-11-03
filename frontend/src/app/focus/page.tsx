'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Focus, ArrowLeft, Play, Pause, Square, Clock, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface FocusSession {
  id: number
  duration: number
  course_id?: number
  course_name?: string
  started_at: string
  ended_at?: string
  status?: string
}

export default function FocusPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    loadSessions()
  }, [isAuthenticated, router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1)
      }, 1000)
    } else if (timer === 0 && isRunning) {
      setIsRunning(false)
      toast.success('Focus session completed!')
      if (activeSession) {
        endSession(activeSession.id)
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, timer, activeSession])

  const loadSessions = async () => {
    try {
      const response = await api.get('/focus/sessions')
      setSessions(response.data)
    } catch (error) {
      toast.error('Failed to load focus sessions')
    } finally {
      setLoading(false)
    }
  }

  const startSession = async (duration: number = 1800) => {
    try {
      const response = await api.post('/focus/start', { duration })
      const session = response.data
      setActiveSession(session)
      setTimer(duration)
      setIsRunning(true)
      toast.success('Focus session started!')
    } catch (error) {
      toast.error('Failed to start focus session')
    }
  }

  const endSession = async (sessionId: number) => {
    try {
      await api.post(`/focus/${sessionId}/end`)
      setActiveSession(null)
      setTimer(0)
      setIsRunning(false)
      loadSessions()
      toast.success('Focus session ended!')
    } catch (error) {
      toast.error('Failed to end focus session')
    }
  }

  const pauseSession = () => {
    setIsRunning(false)
  }

  const resumeSession = () => {
    setIsRunning(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalFocusTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0)
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
                  <Focus className="h-6 w-6 mr-2 text-purple-500" />
                  Focus Mode
                </h1>
                <p className="text-muted-foreground">Track your study time and stay focused</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <Card className="modern-card mb-6 animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Focus Timer</CardTitle>
                <CardDescription>
                  {activeSession ? 'Session in progress' : 'Start a new focus session'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-8">
                  <div className="text-6xl font-mono font-bold text-primary mb-4 animate-pulse">
                    {formatTime(timer)}
                  </div>
                  {activeSession && (
                    <p className="text-muted-foreground animate-fade-in">
                      {activeSession.course_name || 'General Study'}
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  {!activeSession ? (
                    <>
                      <Button
                        size="lg"
                        onClick={() => startSession(1500)} // 25 minutes
                        className="bg-green-600 hover:bg-green-700 hover-lift animate-slide-up animate-stagger-1"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        25 min
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => startSession(1800)} // 30 minutes
                        className="bg-primary hover:bg-primary/90 hover-lift animate-slide-up animate-stagger-2"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        30 min
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => startSession(2700)} // 45 minutes
                        className="bg-purple-600 hover:bg-purple-700 hover-lift animate-slide-up animate-stagger-3"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        45 min
                      </Button>
                    </>
                  ) : (
                    <>
                      {isRunning ? (
                        <Button
                          size="lg"
                          onClick={pauseSession}
                          variant="outline"
                          className="hover-lift animate-scale-in"
                        >
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={resumeSession}
                          className="bg-green-600 hover:bg-green-700 hover-lift animate-scale-in"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Resume
                        </Button>
                      )}
                      <Button
                        size="lg"
                        onClick={() => activeSession && endSession(activeSession.id)}
                        variant="destructive"
                        className="hover-lift animate-scale-in"
                      >
                        <Square className="h-5 w-5 mr-2" />
                        End Session
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your latest focus sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No focus sessions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{session.course_name || 'General Study'}</p>
                          <p className="text-sm text-gray-600">{formatDate(session.started_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{formatDuration(session.duration)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="modern-card animate-slide-left">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center animate-fade-in animate-stagger-1">
                  <div className="text-3xl font-bold text-primary">
                    {formatDuration(getTotalFocusTime())}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Focus Time</p>
                </div>
                
                <div className="text-center animate-fade-in animate-stagger-2">
                  <div className="text-2xl font-bold text-green-600">
                    {sessions.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                </div>

                <div className="text-center animate-fade-in animate-stagger-3">
                  <div className="text-2xl font-bold text-purple-600">
                    {sessions.length > 0 ? Math.round(getTotalFocusTime() / sessions.length / 60) : 0}m
                  </div>
                  <p className="text-sm text-muted-foreground">Average Session</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Use the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Find a quiet environment free from distractions</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Set specific goals for each focus session</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}