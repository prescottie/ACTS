# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require_relative 'project_seeds'
include ProjectSeeds
puts "Seeding Data ..."

# Only run on development (local) instances not on production, etc.
unless Rails.env.development?
  puts "Development seeds only (for now)!"
  exit 0
end


puts "Re-creating Project types..."

ProjectType.destroy_all

projectTypes = ['tapstand', 'source', 'resevoir', 'break pressure tank', 'sediment tank']

projectTypes.each do |type|
  ProjectType.create!(name: type)
end

puts "Re-creating Projects"

Project.destroy_all

Project.create!(PROJECT_SEEDS)

puts "Re-creating Photos"

Photo.destroy_all

(1..643).each do |i|
  Photo.create!({url: 'https://s3-us-west-1.amazonaws.com/impact.acts.ca/tapstand.png', project: Project.find(i)})
end


puts "DONE!"