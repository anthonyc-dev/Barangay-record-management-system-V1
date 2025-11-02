import apiClient from "./config";

export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  posted_id?: number;
  posted_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventListResponse {
  data?: Event[];
  error?: string;
}

export interface EventResponse {
  data?: Event;
  error?: string;
}

export interface CreateEventResponse {
  message: string;
  event: Event;
}

export interface UpdateEventResponse {
  message: string;
  event: Event;
}

export interface DeleteEventResponse {
  message: string;
}

export const eventService = {
  // Get all events (Admin)
  getAll: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[] | { error: string }>(
      "/admin-get-event"
    );

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error((response.data as { error: string }).error);
    }
  },

  // Get all events by role
  getAllByPosted: async (posted_by: string): Promise<Event[]> => {
    const response = await apiClient.get<Event[] | { error: string }>(
      `/getAllByPosted/${posted_by}`
    );

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error((response.data as { error: string }).error);
    }
  },

  // Get event by ID (Admin)
  getById: async (id: number): Promise<Event> => {
    const response = await apiClient.get<Event | { error: string }>(
      `/admin-get-event-by-id/${id}`
    );

    if ("error" in response.data) {
      throw new Error(response.data.error);
    }

    return response.data;
  },

  // Create new event (Admin)
  create: async (eventData: {
    title: string;
    description: string;
    date: string;
  }): Promise<CreateEventResponse> => {
    const response = await apiClient.post<CreateEventResponse>(
      "/admin-event",
      eventData
    );
    return response.data;
  },

  // Update event (Admin)
  update: async (
    id: number,
    eventData: Partial<Event>
  ): Promise<UpdateEventResponse> => {
    const response = await apiClient.put<UpdateEventResponse>(
      `/admin-event-update/${id}`,
      eventData
    );
    return response.data;
  },

  // Delete event (Admin)
  delete: async (id: number): Promise<DeleteEventResponse> => {
    const response = await apiClient.delete<DeleteEventResponse>(
      `/admin-event-delete/${id}`
    );
    return response.data;
  },
};

export default eventService;
