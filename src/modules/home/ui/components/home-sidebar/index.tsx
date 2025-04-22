import { Sidebar, SidebarContent } from '@/components/ui/sidebar'
import React from 'react'
import MainSection from './main-section'
import { Separator } from '@/components/ui/separator'
import PersonalSection from './personal-section'
import { SignedIn } from '@clerk/nextjs'
import SubscriptionSection from './subscription-section'

const HomeSidebar = () => {
  return (
    <Sidebar className='pt-16 z-40 border-none' collapsible='icon'>
        <SidebarContent className='ng-background'>
            <MainSection />
            <Separator />
            <PersonalSection />
            <SignedIn>
              <>
                <Separator className='my-4' />
                <SubscriptionSection />
              </>
            </SignedIn>
        </SidebarContent>
    </Sidebar>
  )
}

export default HomeSidebar