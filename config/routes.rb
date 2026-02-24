Rails.application.routes.draw do
  resources :regions
  resources :showcases
  resources :locations
  resources :users
  resources :feedbacks
  resources :songs
  resources :recordings
  resources :formations
  resources :solos
  resources :scores
  resources :heats
  resources :payments
  resources :answers
  resources :questions
  resources :tables
  resources :person_options
  resources :billables
  resources :judges
  resources :people
  resources :events
  resources :entries
  resources :dances
  resources :cat_extensions
  resources :categories
  resources :studios do
    member do
      post :unpair
    end
  end
  resources :age_costs
  resources :ages
  resources :levels
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "events#index"
end
