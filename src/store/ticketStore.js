import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTicketStore = create(
  persist(
    (set, get) => ({
      // State
      tickets: [],
      selectedTicket: null,

      // Actions
      addTicket: (ticket) => {
        const newTicket = {
          ...ticket,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }));
        return newTicket;
      },

      updateTicket: (id, updatedData) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id
              ? { ...ticket, ...updatedData, updatedAt: new Date().toISOString() }
              : ticket
          ),
        }));
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
        }));
      },

      setSelectedTicket: (ticket) => {
        set({ selectedTicket: ticket });
      },

      getTicketById: (id) => {
        return get().tickets.find((ticket) => ticket.id === id);
      },

      getTicketsByStatus: (status) => {
        return get().tickets.filter((ticket) => ticket.status === status);
      },

      clearTickets: () => {
        set({ tickets: [], selectedTicket: null });
      },
    }),
    {
      name: 'ticket-storage',
    }
  )
);

export default useTicketStore;