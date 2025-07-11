import { useQuery } from '@tanstack/vue-query'
import { HealthResponseSchema, type HealthResponse } from '@acme/api-types'

const API_BASE_URL = 'http://localhost:3000'

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getHealth(): Promise<HealthResponse> {
    const data = await this.request<HealthResponse>('/api/v1/health')
    return HealthResponseSchema.parse(data)
  }
}

export const apiClient = new ApiClient()

export const useHealthQuery = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealth(),
  })
}
