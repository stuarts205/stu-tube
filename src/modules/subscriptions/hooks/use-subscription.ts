import { toast } from 'sonner'
import { useClerk } from '@clerk/nextjs'
import { trpc } from '@/trpc/client'
import { of } from 'svix/dist/openapi/rxjsStub'

interface UserSubscriptionProps {
    userId: string
    isSubscribed: boolean
    fromVideoId?: string
}

export const useSubscription = ({
    userId,
    isSubscribed,
    fromVideoId
}: UserSubscriptionProps) => {
    const clerk = useClerk()
    const utils = trpc.useUtils()

    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess: () => {
            toast.success(`Subscribed to user`)
            utils.videos.getManySubscribed.invalidate()
            utils.users.getOne.invalidate({ id: userId })
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId})
            }
        },
        onError: (error) => {
            toast.error('Something went wrong')
            if(error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn()
            }
        }
    })
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: () => {
            toast.success(`Subscribed to user`)
            utils.videos.getManySubscribed.invalidate()
            utils.users.getOne.invalidate({ id: userId })
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId})
            }
        },
        onError: (error) => {
            toast.error('Something went wrong')
            if(error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn()
            }
        }
    })

    const isPending = subscribe.isPending || unsubscribe.isPending

    const onClick = () => {
        if (isSubscribed) {
            unsubscribe.mutate({ userId })
        } else {
            subscribe.mutate({ userId })
        }
    }

    return {
        isPending,
        onClick,
    }
}