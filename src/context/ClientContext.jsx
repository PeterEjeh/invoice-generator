import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ClientContext = createContext();

export const useClient = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClient must be used within ClientProvider');
    }
    return context;
};

export const ClientProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                loadClients();
            } else {
                setClients([]);
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    const loadClients = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const createClient = async (clientData) => {
        try {
            const newClient = {
                user_id: user.id,
                ...clientData,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('clients')
                .insert([newClient])
                .select()
                .single();

            if (error) throw error;
            setClients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
            return data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    };

    const updateClient = async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setClients(prev => prev.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name)));
            return data;
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        }
    };

    const deleteClient = async (id) => {
        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setClients(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    };

    const value = {
        clients,
        loading,
        createClient,
        updateClient,
        deleteClient
    };

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    );
};
