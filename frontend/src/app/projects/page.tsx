'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ArrowLeft, Plus, Clock, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Project {
  id: number
  name: string
  description?: string
  course_id?: number
  course_name?: string
  due_date?: string
  status: string
  progress: number
}

export default function ProjectsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    loadProjects()
  }, [isAuthenticated, router])

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
                  <Users className="h-6 w-6 mr-2 text-green-500" />
                  Projects
                </h1>
                <p className="text-muted-foreground">Manage your group projects and assignments</p>
              </div>
            </div>
            <Button className="hover-lift animate-slide-left">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-4">Create your first project to start collaborating</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                projects.map((project, index) => (
                  <Card key={project.id} className="modern-card hover-lift cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            {project.course_name && (
                              <span className="bg-muted px-2 py-1 rounded text-xs mr-2">
                                {project.course_name}
                              </span>
                            )}
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(project.due_date)}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)} animate-fade-in`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {project.description && (
                        <CardDescription className="mb-4">
                          {project.description}
                        </CardDescription>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 hover-lift">
                          View Details
                        </Button>
                        {project.status === 'active' && (
                          <Button size="sm" className="flex-1 hover-lift">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        )}
                      </div>
                    </CardContent>
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