Event.delete_all
Event.create!(
  name: "Showcase",
  location: "TBD",
  date: "TBD",
  heat_range_cat: 0,
  heat_range_level: 3,
  heat_range_age: 7,
)

Studio.delete_all
Studio.create! name: "Event Staff", id: 0

Age.delete_all
{
  "J" => "< 17",
  "A" => "18-35",
  "A1" => "36-45",
  "B" => "46-54",
  "B1" => "55-65",
  "C" => "66-75",
  "C1" => "76-85",
  "D" => "86+"
}.each do |category, description|
  Age.create!(category: category, description: description)
end

Level.delete_all
[
  "Newcomer",
  "Assoc. Bronze",
  "Full Bronze",
  "Assoc. Silver",
  "Full Silver",
  "Assoc. Gold",
  "Full Gold"
].each do |name|
  Level.create!(name: name)
end

Dance.delete_all
[
  "Waltz",
  "Fox Trot",
  "Tango",
  "V. Waltz",
  "Quickstep",
  "Peabody",
  "Arg. Tango",
  "Salsa",
  "Rumba",
  "Cha Cha",
  "Merengue",
  "Samba",
  "Bolero",
  "Paso Doble",
  "Mambo",
  "WCS",
  "Bachata",
  "ECS",
  "Hustle",
  "CW Swing",
  "Lindy Hop",
  "CW Waltz",
  "CW Cha Cha",
  "NC2",
  "CW Two Step",
  "CW Three Step",
  "CW Shuffle",
  "Swing",
  "4 Count",
  "Polka"
].each_with_index do |name, index|
  Dance.create!(name: name, order: index + 1)
end
