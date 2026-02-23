json.extract! feedback, :id, :abbr, :value, :order, :created_at, :updated_at
json.url feedback_url(feedback, format: :json)
