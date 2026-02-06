import axiosInstance from './instance';

export interface DemoTrainer {
    id: number;
    name: string;
}

interface DemoTrainerResponse<T> {
    status: boolean;
    message: string;
    msg?: string;
    data?: T;
    error?: string;
}

export const demoTrainerService = {
    // Get all demo trainers
    getAllDemoTrainers: async (): Promise<DemoTrainerResponse<DemoTrainer[]>> => {
        try {
            const response = await axiosInstance.get<DemoTrainerResponse<DemoTrainer[]>>('/api/demo/trainers');
            return response.data;
        } catch (error: any) {
            return {
                status: false,
                message: error?.response?.data?.message || 'Failed to fetch demo trainers',
                error: error?.message
            };
        }
    },

    // Get single demo trainer by ID
    getDemoTrainerById: async (id: number): Promise<DemoTrainerResponse<DemoTrainer>> => {
        try {
            const response = await axiosInstance.get<DemoTrainerResponse<DemoTrainer>>(`/api/demo/trainers/${id}`);
            return response.data;
        } catch (error: any) {
            return {
                status: false,
                message: error?.response?.data?.message || 'Failed to fetch demo trainer',
                error: error?.message
            };
        }
    },

    // Create new demo trainer
    createDemoTrainer: async (name: string): Promise<DemoTrainerResponse<DemoTrainer>> => {
        try {
            const response = await axiosInstance.post<DemoTrainerResponse<DemoTrainer>>('/api/demo/trainers', { name });
            return response.data;
        } catch (error: any) {
            return {
                status: false,
                message: error?.response?.data?.message || 'Failed to create demo trainer',
                error: error?.message
            };
        }
    },

    // Update demo trainer
    updateDemoTrainer: async (id: number, name: string): Promise<DemoTrainerResponse<DemoTrainer>> => {
        try {
            const response = await axiosInstance.put<DemoTrainerResponse<DemoTrainer>>(`/api/demo/trainers/${id}`, { name });
            return response.data;
        } catch (error: any) {
            return {
                status: false,
                message: error?.response?.data?.message || 'Failed to update demo trainer',
                error: error?.message
            };
        }
    },

    // Delete demo trainer
    deleteDemoTrainer: async (id: number): Promise<DemoTrainerResponse<{ id: number }>> => {
        try {
            const response = await axiosInstance.delete<DemoTrainerResponse<{ id: number }>>(`/api/demo/trainers/${id}`);
            return response.data;
        } catch (error: any) {
            return {
                status: false,
                message: error?.response?.data?.message || 'Failed to delete demo trainer',
                error: error?.message
            };
        }
    }
};
