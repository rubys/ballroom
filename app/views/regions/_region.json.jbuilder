json.extract! region, :id, :code, :type, :location, :latitude, :longitude, :created_at, :updated_at
json.url region_url(region, format: :json)
