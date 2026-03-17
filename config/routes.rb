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
  resources :scores do
    get "comments", on: :collection
  end
  resources :heats do
    get "book", on: :collection
    get "djlist", on: :collection
  end
  resources :payments
  resources :answers do
    get "report", on: :collection
  end
  resources :questions
  resources :tables do
    get "list", on: :collection
    get "by_studio", on: :collection
  end
  resources :person_options
  resources :billables
  resources :judges
  resources :people do
    get "students", on: :collection
    get "backs", on: :collection
    post "backs", on: :collection, action: "assign_backs"
    get "heats", on: :collection
    get "back_numbers", on: :collection
    get "labels", on: :collection
    get "guest_passes", on: :collection
    get "scores", on: :collection
    get "staff", on: :collection
    get "certificates", on: :collection
    post "certificates", on: :collection
  end
  resources :events do
    get "qrcode", on: :collection
    get "publish", on: :collection
  end

  # Match showcase's singular /event/* URLs
  get "event/summary", to: "events#summary", as: :summary_event_index
  get "event/publish", to: "events#publish", as: :publish_event_index
  get "event/settings", to: "events#settings", as: :settings_event_index

  # Publish page link targets (PDF/export endpoints)
  get "event.xlsx", to: "events#spreadsheet", as: :event_spreadsheet
  get "judge.xlsx", to: "events#judge", as: :judge_spreadsheet
  get "event.sqlite3", to: "events#database", as: :event_database
  resources :entries
  resources :dances do
    post :drop, on: :collection
  end
  resources :cat_extensions
  resources :categories do
    post :drop, on: :collection
  end
  resources :studios do
    member do
      post :unpair
    end
    get "invoices", on: :collection
    get "labels", on: :collection
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
  root "events#root"
end
