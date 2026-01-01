import { checkUsername, currentUser } from "@/actions/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { claimUsername } from "@/actions/user";

export const getCurrentUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => await currentUser(),
    })
};

export const useClaimUsername = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ username }: ClaimUsernameType) => claimUsername({ username }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
};

export const useCheckUsername = () => {
    return useMutation({
        mutationFn: async ({ username }: CheckUsernameType) => checkUsername({ username })
    })
};