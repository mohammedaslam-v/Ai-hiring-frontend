import { useState, useEffect, useCallback } from 'react';
import { demoTrainerService } from '@/services/demoTrainer.service';

export interface DemoTrainer {
    id: number;
    name: string;
}

export const useDemoTrainers = () => {
    const [trainers, setTrainers] = useState<DemoTrainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrainers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await demoTrainerService.getAllDemoTrainers();
            if (response.status && response.data) {
                setTrainers(response.data);
                setError(null);
            } else {
                setError(response.message || 'Failed to fetch demo trainers');
            }
        } catch (err) {
            console.error('Error fetching demo trainers:', err);
            setError('An error occurred while fetching demo trainers');
        } finally {
            setLoading(false);
        }
    }, []);

    const addTrainer = async (name: string) => {
        const response = await demoTrainerService.createDemoTrainer(name);
        if (response.status) {
            await fetchTrainers();
        }
        return response;
    };

    const updateTrainer = async (id: number, name: string) => {
        const response = await demoTrainerService.updateDemoTrainer(id, name);
        if (response.status) {
            await fetchTrainers();
        }
        return response;
    };

    const deleteTrainer = async (id: number) => {
        const response = await demoTrainerService.deleteDemoTrainer(id);
        if (response.status) {
            await fetchTrainers();
        }
        return response;
    };

    useEffect(() => {
        fetchTrainers();
    }, [fetchTrainers]);

    return {
        trainers,
        loading,
        error,
        refreshTrainers: fetchTrainers,
        addTrainer,
        updateTrainer,
        deleteTrainer
    };
};
