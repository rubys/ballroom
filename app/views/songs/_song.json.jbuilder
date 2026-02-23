json.extract! song, :id, :dance_id, :title, :artist, :order, :created_at, :updated_at
json.url song_url(song, format: :json)
