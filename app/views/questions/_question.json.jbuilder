json.extract! question, :id, :billable_id, :question_text, :question_type, :choices, :order, :created_at, :updated_at
json.url question_url(question, format: :json)
