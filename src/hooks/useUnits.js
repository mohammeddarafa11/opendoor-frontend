import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  unitsAPI,
  reservationsAPI,
  paymentsAPI,
  waitlistAPI,
  wishlistAPI,
  dashboardAPI,
  adminAPI,
} from "../services/api";

// ========== UNITS ==========
export const useUnits = (filters = {}) => {
  return useQuery({
    queryKey: ["units", filters],
    queryFn: () => unitsAPI.getAll(filters).then((res) => res.data),
  });
};

export const useUnit = (id) => {
  return useQuery({
    queryKey: ["unit", id],
    queryFn: () => unitsAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

// ========== RESERVATIONS ==========
export const useMyReservations = () => {
  return useQuery({
    queryKey: ["my-reservations"],
    queryFn: () => reservationsAPI.getMy().then((res) => res.data),
  });
};

export const useReservations = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: () =>
      reservationsAPI.getAll().then((res) => res.data.reservations || res.data),
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      reservationsAPI.create(data).then((res) => res.data.reservation),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
      queryClient.invalidateQueries(["my-reservations"]);
      queryClient.invalidateQueries(["units"]);
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => reservationsAPI.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
      queryClient.invalidateQueries(["my-reservations"]);
      queryClient.invalidateQueries(["units"]);
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => reservationsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
    },
  });
};

// ========== PAYMENTS ==========
export const useMyPayments = () => {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: () => paymentsAPI.getMy().then((res) => res.data),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      paymentsAPI.create(data).then((res) => res.data.payment),
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["my-payments"]);
    },
  });
};

// ========== WAITLIST ==========
export const useMyWaitlist = () => {
  return useQuery({
    queryKey: ["my-waitlist"],
    queryFn: () => waitlistAPI.getMy().then((res) => res.data),
  });
};

export const useWaitlists = () => {
  return useQuery({
    queryKey: ["waitlists"],
    queryFn: () =>
      waitlistAPI.getAll().then((res) => res.data.entries || res.data),
  });
};

export const useJoinWaitlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unitId) => waitlistAPI.join(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-waitlist"]);
      queryClient.invalidateQueries(["waitlists"]);
    },
  });
};

export const useLeaveWaitlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => waitlistAPI.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-waitlist"]);
      queryClient.invalidateQueries(["waitlists"]);
    },
  });
};

export const useNotifyWaitlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => waitlistAPI.notify(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["waitlists"]);
    },
  });
};

// ========== WISHLIST ==========
export const useMyWishlist = () => {
  return useQuery({
    queryKey: ["my-wishlist"],
    queryFn: () => wishlistAPI.getMy().then((res) => res.data),
  });
};

export const useCheckWishlist = (unitId) => {
  return useQuery({
    queryKey: ["wishlist-check", unitId],
    queryFn: () => wishlistAPI.check(unitId).then((res) => res.data),
    enabled: !!unitId,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unitId) => wishlistAPI.toggle(unitId),
    onSuccess: (_, unitId) => {
      queryClient.invalidateQueries(["my-wishlist"]);
      queryClient.invalidateQueries(["wishlist-check", unitId]);
    },
  });
};

export const useRemoveWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => wishlistAPI.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-wishlist"]);
    },
  });
};

// ========== DASHBOARD ==========
export const useManagerDashboard = () => {
  return useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: () => dashboardAPI.getManagerStats().then((res) => res.data),
  });
};

export const useAgentDashboard = () => {
  return useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: () => dashboardAPI.getAgentStats().then((res) => res.data),
  });
};

// ========== ADMIN ==========
export const useAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => adminAPI.getAgents().then((res) => res.data),
  });
};
