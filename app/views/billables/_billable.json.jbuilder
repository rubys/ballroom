json.extract! billable, :id, :name, :type, :price, :order, :table_size, :couples, :created_at, :updated_at
json.url billable_url(billable, format: :json)
