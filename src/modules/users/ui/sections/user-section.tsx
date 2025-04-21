'use client'
import { trpc } from '@/trpc/client'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface UserSectionProps {
    userId: string
}

const UserSection = (props: UserSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
            <UserSectionSuspense {...props} />
        </ErrorBoundary>
    </Suspense>
  )
}

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
    const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId })
    return (
        <div className='flex flex-col'>
            <UserPageBanner user={user} />
        </div>
    )
}

export default UserSection