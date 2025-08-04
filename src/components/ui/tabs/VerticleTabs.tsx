import React from 'react'

function VerticleTabs() {
  return (

    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="border-t border-gray-100 p-4 dark:border-gray-800 sm:p-6">
                  <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800" x-data="{ activeTab: 'overview' }">
  <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
    <div className="overflow-x-auto pb-2 sm:w-[200px] [&amp;::-webkit-scrollbar-thumb]:rounded-full [&amp;::-webkit-scrollbar-thumb]:bg-gray-100 dark:[&amp;::-webkit-scrollbar-thumb]:bg-gray-600 [&amp;::-webkit-scrollbar-track]:bg-white dark:[&amp;::-webkit-scrollbar-track]:bg-transparent [&amp;::-webkit-scrollbar]:h-1.5">
      <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
        <button className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50" x-bind:className="activeTab === 'overview' ? ' text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 ' : 'bg-transparent text-gray-500 border-transparent  hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'" x-on:click="activeTab = 'overview'">
          Overview
        </button>
        <button className="inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" x-bind:className="activeTab === 'notification' ? ' text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 ' : 'bg-transparent text-gray-500 border-transparent  hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'" x-on:click="activeTab = 'notification'">
          Notification
        </button>
        <button className="inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" x-bind:className="activeTab === 'analytics' ? ' text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 ' : 'bg-transparent text-gray-500 border-transparent  hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'" x-on:click="activeTab = 'analytics'">
          Analytics
        </button>
        <button className="py-2.5å inline-flex items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" x-bind:className="activeTab === 'customers' ? ' text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 ' : 'bg-transparent text-gray-500 border-transparent  hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'" x-on:click="activeTab = 'customers'">
          Customers
        </button>
      </nav>
    </div>
    <div className="flex-1">
      <div className="">
        <div x-show="activeTab === 'overview'">
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
            Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview ipsum dolor sit amet consectetur. Non vitae facilisis urna
            tortor placerat egestas donec. Faucibus diam gravida enim elit lacus
            a. Tincidunt fermentum condimentum quis et a et tempus. Tristique
            urna nisi nulla elit sit libero scelerisque ante.
          </p>
        </div>

        <div x-show="activeTab === 'notification'" className='hidden' >
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
            Notification
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Notification ipsum dolor sit amet consectetur. Non vitae facilisis
            urna tortor placerat egestas donec. Faucibus diam gravida enim elit
            lacus a. Tincidunt fermentum condimentum quis et a et tempus.
            Tristique urna nisi nulla elit sit libero scelerisque ante.
          </p>
        </div>

        <div x-show="activeTab === 'analytics'" className='hidden'>
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
            Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analytics ipsum dolor sit amet consectetur. Non vitae facilisis urna
            tortor placerat egestas donec. Faucibus diam gravida enim elit lacus
            a. Tincidunt fermentum condimentum quis et a et tempus. Tristique
            urna nisi nulla elit sit libero scelerisque ante.
          </p>
        </div>

        <div x-show="activeTab === 'customers'" className='hidden'>
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">
            Customers
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customers ipsum dolor sit amet consectetur. Non vitae facilisis urna
            tortor placerat egestas donec. Faucibus diam gravida enim elit lacus
            a. Tincidunt fermentum condimentum quis et a et tempus. Tristique
            urna nisi nulla elit sit libero scelerisque ante.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
              </div>
    
    
  )
}

export default VerticleTabs